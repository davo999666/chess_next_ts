"use client";
import React, { forwardRef, useRef, useState } from "react";
import { flipBoardView, initialBoard } from "../../utils/boardUtils";
import { PieceLetter } from "@/utils/pieceMap";
import { boardSize } from "../../utils/classNameSize";
import PiecePools from "../../component/PiecePools";
import { useHistory } from "../../context/HistoryContext";
import BoardGrid from "../../component/board/BoardGrid";
import { BoardHandle, useBoardHandlers } from "../../hooks/useBoardHandlers";
import MoveArrows from "../../component/MoveArrows";
import RightClickCircles from "../../component/RightClickCircles";
import { useArrowDrawing, Square } from "../../hooks/useArrowDrawing";
import {getLegalMovesForPiece} from "../../utils/legalMoves";




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
        const [legalMoves, setLegalMoves] = useState<Square[]>([]);
        const [switchLegalMoves, setSwitchLegalMoves] = useState<boolean>(false)
        // -------------------
        // DRAG STATE
        // -------------------
        const [draggedPiece, setDraggedPiece] = useState<PieceLetter | null>(null);
        const [fromPos, setFromPos] = useState<Square | "pool" | null>(null);
        const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
        const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
        // ARROW HOOK
        const { arrows, storedArrows, setStoredArrows ,  handleRightEnter, handleRightUp } = useArrowDrawing();
        // POOL STATE
        const [selectedPoolPiece, setSelectedPoolPiece] = useState<PieceLetter | null>(null);
        // CIRCLE STATE
        const [circles, setCircles] = useState<{ r: number; c: number; color: string }[]>([]);
        // REFS & HISTORY
        const boardRef = useRef<HTMLDivElement>(null);
        const { addMove, moveBack: moveBackHistory, clearHistory, history } = useHistory();
        // HOOK
        useBoardHandlers({ref, history, setCurrentBoard, clearHistory, moveBackHistory, setSelectedPoolPiece, setBoardFlipped,
            setStoredArrows, setCircles , setSwitchLegalMoves // optional, arrow state is handled in hook
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
                if(switchLegalMoves){
                    const moves = getLegalMovesForPiece(piece, [r, c], currentBoard)
                        .map(move => [move[0], move[1]] as [number, number]);
                    setLegalMoves(moves);
                }

            };

        const handlePointerMove = (e: React.PointerEvent) => {
            if (!draggedPiece || !boardRef.current || !dragOffset) return;
            e.preventDefault(); // ✅ Prevent page scroll while dragging
            const rect = boardRef.current.getBoundingClientRect();
            setDragPos({
                x: e.clientX - rect.left - dragOffset.x,
                y: e.clientY - rect.top - dragOffset.y,
            });
        };

        const handlePointerUp = (e: React.PointerEvent) => {
            e.preventDefault();
            e.stopPropagation();
            // Clear legal moves
            setLegalMoves([]);
            if ((!draggedPiece && !selectedPoolPiece) || !boardRef.current || e.button === 2) return;

            const rect = boardRef.current.getBoundingClientRect();
            const pieceToPlace = draggedPiece ?? selectedPoolPiece;

            if (!pieceToPlace) return;


            // ---------- Check if outside board ----------
            const outsideBoard =
                e.clientX < rect.left ||
                e.clientX > rect.right ||
                e.clientY < rect.top ||
                e.clientY > rect.bottom;


            if (outsideBoard) {
                // Remove piece from board if it came from board

                if(!fromPos)return;

                if (fromPos && fromPos !== "pool" && fromPos) {
                    setCurrentBoard((prev) => {
                        const copy = prev.map((row) => [...row]);
                        copy[fromPos[0]][fromPos[1]] = null;
                        return copy;
                    });
                }

                // Add history entry
                addMove({
                    pieceFrom: pieceToPlace,
                    from: fromPos ?? "pool",
                    to: "removed", // instead of a board position
                    captured: null,
                });

                // Reset drag state
                setDraggedPiece(null);
                setFromPos(null);
                setDragPos(null);
                setDragOffset(null);
                if (fromPos === "pool") setSelectedPoolPiece(null);


                return;
            }

            // ---------- Inside board logic ----------
            let c = Math.floor((e.clientX - rect.left) / (rect.width / 8));
            let r = Math.floor((e.clientY - rect.top) / (rect.height / 8));

            r = Math.max(0, Math.min(7, r));
            c = Math.max(0, Math.min(7, c));

            const [realR, realC] = toRealPos(r, c);
            // --- NEW: check if drop is same square ---
                if (
                    fromPos &&
                    fromPos !== "pool" &&
                    fromPos[0] === realR &&
                    fromPos[1] === realC &&
                    !selectedPoolPiece
                ) {
                    // Reset drag state without changing board or adding history
                    setDraggedPiece(null);
                    setFromPos(null);
                    setDragPos(null);
                    setDragOffset(null);
                    return;
                }

            const captured = currentBoard[realR][realC] || null;
            const moveFrom = selectedPoolPiece && !dragPos ? "pool" : fromPos ?? "pool";
            setCurrentBoard((prev) => {
                const copy = prev.map((row) => [...row]);
                if (fromPos && fromPos !== "pool") copy[fromPos[0]][fromPos[1]] = null;
                if(selectedPoolPiece && !dragPos){
                    copy[realR][realC] = selectedPoolPiece;
                }else {
                    copy[realR][realC] = pieceToPlace;
                }
                return copy;
            });
            addMove({
                pieceFrom: pieceToPlace,
                from: moveFrom,
                to: [realR, realC],
                captured,
            });

            // Reset drag state
            setDraggedPiece(null);
            setFromPos(null);
            setDragPos(null);
            setDragOffset(null);
            if (fromPos === "pool") setSelectedPoolPiece(null);


        };



        // -------------------
        // RIGHT CLICK CIRCLES
        // -------------------
        const handleRightClick = (r: number, c: number, e: React.MouseEvent) => {
            e.preventDefault();
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
            <div className="w-full h-full flex flex-row gap-4 bg-blue-100">
                <div className="flex flex-row items-center ">
                    <div
                        className=" flex flex-row "
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        style={{ touchAction: "none" }}
                    >
                        <div
                            ref={boardRef}
                            className={`relative grid grid-cols-8 border-1 border-[#b58863] grid-rows-8 ${boardSize}`}

                        >
                            <RightClickCircles circles={circles} boardFlipped={boardFlipped} />
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
                                legalMoves={legalMoves}
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
            </div>
        );
    }
);

export default Board;