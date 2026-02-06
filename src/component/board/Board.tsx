"use client";
import React, {forwardRef, useRef, useState} from "react";
import {flipBoardView, initialBoard} from "@/utils/boardUtils";
import {PieceLetter} from "@/utils/pieceMap";
import {boardSize} from "@/utils/classNameSize";
import PiecePools from "@/component/PiecePools";
import {useHistory} from "@/context/HistoryContext";
import BoardGrid from "@/component/board/BoardGrid";
import {BoardHandle, useBoardHandlers} from "@/hooks/useBoardHandlers";
import MoveArrows from "@/component/MoveArrows";
import RightClickCircles from "@/component/RightClickCircles";

type Square = [number, number];

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
        // -------------------
        // POOL STATE
        // -------------------
        const [selectedPoolPiece, setSelectedPoolPiece] = useState<PieceLetter | null>(null);
        // -------------------
        // ARROW STATE
        // -------------------
        const [arrows, setArrows] = useState<Square[]>([]);
        const [storedArrows, setStoredArrows] = useState<Square[][]>([]);
        let lastPos: [number, number] | null = null;
        // -------------------
        // CIRCLE STATE
        // -------------------
        const [circles, setCircles] = useState<{ r: number; c: number; color: string }[]>([]);
        const [lastRightClickTime, setLastRightClickTime] = useState(0);
        const doubleClickThreshold = 300;


        const boardRef = useRef<HTMLDivElement>(null);
        const { addMove, moveBack: moveBackHistory, clearHistory, history } = useHistory();
        // -------------------
        // HOOK
        // -------------------
        useBoardHandlers({
            ref,
            history,
            setCurrentBoard,
            clearHistory,
            moveBackHistory,
            setSelectedPoolPiece,
            setBoardFlipped,
            setStoreArrow: setStoredArrows,
        });

        const displayedBoard = boardFlipped ? flipBoardView(currentBoard) : currentBoard;
        const toRealPos = (r: number, c: number): Square =>
            boardFlipped ? [7 - r, 7 - c] : [r, c];
        // -------------------
        // DRAG HANDLERS
        // -------------------
        const handlePointerDownBoard = (r: number, c: number, piece: PieceLetter) => (e: React.PointerEvent) => {
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

        const handleRightEnter = (r: number, c: number) => {
            console.log(r, c)
            setArrows((prev) =>
                prev.some(([rr, cc]) => rr === r && cc === c) ? prev : [...prev, [r, c]]
            );
        };

        const handleRightUp = () => {
            setStoredArrows((prev) => {
                const existsIndex = prev.findIndex((path, idx) => {
                    if (path.length === 0 || arrows.length === 0) return false;
                    const pathStart = path[0];
                    const pathEnd = path[path.length - 1];
                    const arrowStart = arrows[0];
                    const arrowEnd = arrows[arrows.length - 1];
                    // Check if start and end match (either direction)
                    return (pathStart[0] === arrowStart[0] && pathStart[1] === arrowStart[1] &&
                            pathEnd[0] === arrowEnd[0] && pathEnd[1] === arrowEnd[1]) ||
                        (pathStart[0] === arrowEnd[0] && pathStart[1] === arrowEnd[1] &&
                            pathEnd[0] === arrowStart[0] && pathEnd[1] === arrowStart[1]);

                });
                if (existsIndex !== -1) {
                    return prev.filter((_, i) => i !== existsIndex);
                }
                return [...prev, arrows];
            });

            setArrows([]);
        };
        // -------------------
        // DOUBLE RIGHT CLICK CIRCLES
        // -------------------
        const handleRightClick = (r: number, c: number, e: React.MouseEvent) => {
            e.preventDefault();
            const now = Date.now();
            if (now - lastRightClickTime < doubleClickThreshold) {
                const color = `hsl(${Math.random() * 360}, 80%, 50%)`;
                setCircles((prev) => [...prev, { r, c, color }]);
            } else {
                setCircles((prev) => prev.filter((x) => x.r !== r || x.c !== c));
            }
            setLastRightClickTime(now);
        };
        // -------------------
        // RENDER
        // -------------------
        return (
            <div className="w-full h-[99%] flex flex-row m-1 gap-4 bg-blue-100">
                <div className="flex flex-row items-center">
                    <div ref={boardRef}
                         className={`relative grid grid-cols-8 grid-rows-8 ${boardSize}`}
                         onPointerMove={handlePointerMove}
                         onPointerUp={handlePointerUp}
                    >
                        <RightClickCircles circles={circles}/>

                        <BoardGrid
                            displayedBoard={displayedBoard}
                            draggedPiece={draggedPiece}
                            dragPos={dragPos}
                            fromPos={fromPos}
                            boardFlipped={boardFlipped}
                            toRealPos={toRealPos}
                            handleClickSquare={() => {
                            }}
                            handlePointerDownBoard={handlePointerDownBoard}
                            onRightEnter={handleRightEnter}
                            onRightUp={handleRightUp}
                            onRightClick={handleRightClick}
                            circles={circles}
                        />
                        {arrows.length > 0 && (
                            <MoveArrows from={{r: arrows[0][0], c: arrows[0][1]}} legalMoves={arrows}
                                        flipped={boardFlipped} isDrawing={true}/>
                        )}
                        {storedArrows.map((path, i) =>
                            path.length > 0 ? (
                                <MoveArrows
                                    key={i}
                                    from={{r: path[0][0], c: path[0][1]}}
                                    legalMoves={path}
                                    flipped={boardFlipped}
                                    isDrawing={false}
                                />
                            ) : null
                        )}
                    </div>
                    <PiecePools selectedPoolPiece={selectedPoolPiece} onSelectPiece={setSelectedPoolPiece}/>
                    </div>
                </div>
                );
                }
                );

                export default Board;
