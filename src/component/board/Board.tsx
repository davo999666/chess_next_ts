"use client";
import React, { forwardRef, useRef, useState } from "react";
import { flipBoardView, initialBoard } from "@/utils/boardUtils";
import { PieceLetter } from "@/utils/pieceMap";
import { boardSize } from "@/utils/classNameSize";
import PiecePools from "@/component/PiecePools";
import { useHistory } from "@/context/HistoryContext";
import BoardGrid from "@/component/board/BoardGrid";
import { BoardHandle, useBoardHandlers } from "@/hooks/useBoardHandlers";
import MoveArrows from "@/component/MoveArrows";
import RightClickCircles from "@/component/RightClickCircles";
import { useArrowDrawing, Square } from "@/hooks/useArrowDrawing"; // your arrow hook

type BoardProps = {
    board?: (PieceLetter | null)[][];
    flipped?: boolean;
};

const Board = forwardRef<BoardHandle, BoardProps>(
    ({ board = initialBoard, flipped = false }, ref) => {
        // -------------------
        // BOARD STATE
        // -------------------
        const [currentBoard, setCurrentBoard] = useState(board);
        const [boardFlipped, setBoardFlipped] = useState(flipped);
        // -------------------
        // DRAG STATE
        // -------------------
        const [draggedPiece, setDraggedPiece] = useState<PieceLetter | null>(null);
        const [fromPos, setFromPos] = useState<Square | "pool" | null>(null);
        const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
        const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
        // ARROW HOOK
        const { arrows, storedArrows, handleRightEnter, handleRightUp } = useArrowDrawing();
        // POOL STATE
        const [selectedPoolPiece, setSelectedPoolPiece] = useState<PieceLetter | null>(null);
        // CIRCLE STATE
        const [circles, setCircles] = useState<{ r: number; c: number; color: string }[]>([]);
        // REFS & HISTORY
        const boardRef = useRef<HTMLDivElement>(null);
        const { addMove, moveBack: moveBackHistory, clearHistory, history } = useHistory();
        // HOOK
        useBoardHandlers({ref, history, setCurrentBoard, clearHistory, moveBackHistory, setSelectedPoolPiece, setBoardFlipped,
            setStoreArrow: () => {}, // optional, arrow state is handled in hook
        });

        const displayedBoard = boardFlipped ? flipBoardView(currentBoard) : currentBoard;
        const toRealPos = (r: number, c: number): Square => (boardFlipped ? [7 - r, 7 - c] : [r, c]);

        // DRAG HANDLERS
        // -------------------
        const handlePointerDownBoard =
            (r: number, c: number, piece: PieceLetter) => (e: React.PointerEvent) => {
                if (e.button === 2) return;

                setDraggedPiece(piece);
                setFromPos([r, c]);

                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            };

        const handlePointerMove = (e: React.PointerEvent) => {
            if (!draggedPiece || !boardRef.current || !dragOffset) return;

            const rect = boardRef.current.getBoundingClientRect();
            setDragPos({
                x: e.clientX - rect.left - dragOffset.x,
                y: e.clientY - rect.top - dragOffset.y,
            });
        };

        const handlePointerUp = (e: React.PointerEvent) => {
            if (!draggedPiece || !boardRef.current) return;

            const rect = boardRef.current.getBoundingClientRect();
            let c = Math.floor((e.clientX - rect.left) / (rect.width / 8));
            let r = Math.floor((e.clientY - rect.top) / (rect.height / 8));

            r = Math.max(0, Math.min(7, r));
            c = Math.max(0, Math.min(7, c));

            const [realR, realC] = toRealPos(r, c);
            const captured = currentBoard[realR][realC] || null;

            setCurrentBoard((prev) => {
                const copy = prev.map((row) => [...row]);
                if (fromPos && fromPos !== "pool") copy[fromPos[0]][fromPos[1]] = null;
                copy[realR][realC] = draggedPiece;
                return copy;
            });

            addMove({ pieceFrom: draggedPiece, from: fromPos || "pool", to: [realR, realC], captured });

            setDraggedPiece(null);
            setFromPos(null);
            setDragPos(null);
            setDragOffset(null);
        };

        // -------------------
        // DOUBLE RIGHT CLICK CIRCLES
        // -------------------
        const handleRightClick = (r: number, c: number, e: React.MouseEvent) => {
            e.preventDefault();
            console.log(arrows, storedArrows)
            // Check if circle exists at this square
            setCircles((prev) => {
                const exists = prev.some((x) => x.r === r && x.c === c);
                if (exists) {
                    // Remove if exists
                    return prev.filter((x) => x.r !== r || x.c !== c);
                } else {
                    // Add new circle with random color
                    const color = `hsl(${Math.random() * 360}, 80%, 50%)`;
                    return [...prev, { r, c, color }];
                }
            });
        };

        // -------------------
        // RENDER
        // -------------------
        return (
            <div className="w-full h-[99%] flex flex-row m-1 gap-4 bg-blue-100">
                <div className="flex flex-row items-center">
                    <div
                        ref={boardRef}
                        className={`relative grid grid-cols-8 grid-rows-8 ${boardSize}`}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                    >
                        <RightClickCircles circles={circles} />
                        <BoardGrid
                            displayedBoard={displayedBoard}
                            draggedPiece={draggedPiece}
                            dragPos={dragPos}
                            fromPos={fromPos}
                            toRealPos={toRealPos}
                            handleClickSquare={() => {}}
                            handlePointerDownBoard={handlePointerDownBoard}
                            boardFlipped={boardFlipped}
                            onRightEnter={handleRightEnter}
                            onRightUp={handleRightUp}
                            onRightClick={handleRightClick}
                        />

                        {/* Current arrow while drawing */}
                        {arrows.length > 0 && (
                            <MoveArrows
                                from={{ r: arrows[0][0], c: arrows[0][1] }}
                                legalMoves={arrows}
                                flipped={boardFlipped}
                                isDrawing={true}
                            />
                        )}

                        {/* Stored arrows */}
                        {storedArrows.map((path, i) =>
                            path.length > 0 ? (
                                <MoveArrows
                                    key={i}
                                    from={{ r: path[0][0], c: path[0][1] }}
                                    legalMoves={path}
                                    flipped={boardFlipped}
                                    isDrawing={false}
                                />
                            ) : null
                        )}
                    </div>

                    <PiecePools selectedPoolPiece={selectedPoolPiece} onSelectPiece={setSelectedPoolPiece} />
                </div>
            </div>
        );
    }
);

export default Board;
