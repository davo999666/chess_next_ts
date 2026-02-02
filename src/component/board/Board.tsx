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

type BoardProps = {
    board?: (PieceLetter | null)[][];
    flipped?: boolean;
};

type Square = [number, number];

const Board = forwardRef<BoardHandle, BoardProps>(
    ({ board = initialBoard, flipped = false }, ref) => {
        const [currentBoard, setCurrentBoard] = useState<(PieceLetter | null)[][]>(board);
        const [draggedPiece, setDraggedPiece] = useState<PieceLetter | null>(null);
        const [fromPos, setFromPos] = useState<Square | "pool" | null>(null);
        const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
        const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
        const [selectedPoolPiece, setSelectedPoolPiece] = useState<PieceLetter | null>(null);
        const [boardFlipped, setBoardFlipped] = useState(flipped);
        const [isDraggingArrow, setIsDraggingArrow] = useState(false);

        const boardRef = useRef<HTMLDivElement>(null);
        const { addMove, moveBack: moveBackHistory, clearHistory, history } = useHistory();

        // ARROW STATES
        const [isRightMouseDown, setIsRightMouseDown] = useState(false);
        const [arrows, setArrows] = useState<Square[]>([]);
        const [storeArrow, setStoreArrow] = useState<Square[][]>([]);
        const [circles, setCircles] = useState<{ r: number; c: number; color: string }[]>([]);
        const [rightClickDragged, setRightClickDragged] = useState(false);

        // DOUBLE RIGHT CLICK DETECTION
        const [lastRightClickTime, setLastRightClickTime] = useState(0);
        const doubleClickThreshold = 300; // ms for double-click

        // BOARD HANDLERS HOOK
        useBoardHandlers({
            ref,
            history,
            setCurrentBoard,
            clearHistory,
            moveBackHistory,
            setSelectedPoolPiece,
            setBoardFlipped,
            setStoreArrow
        });

        const displayedBoard = boardFlipped ? flipBoardView(currentBoard) : currentBoard;
        const toRealPos = (r: number, c: number): Square => (boardFlipped ? [7 - r, 7 - c] : [r, c]);

        // -----------------------------
        // POINTER / DRAG HANDLERS
        // -----------------------------
        const handlePointerDownBoard = (r: number, c: number, piece: PieceLetter) => (e: React.PointerEvent) => {
            if (e.button === 2) return;
            e.preventDefault();
            setDraggedPiece(piece);
            setFromPos([r, c]);
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        };

        const handlePointerMove = (e: React.PointerEvent) => {
            if (!draggedPiece || !boardRef.current || !dragOffset) return;
            const rect = boardRef.current.getBoundingClientRect();
            setDragPos({ x: e.clientX - rect.left - dragOffset.x, y: e.clientY - rect.top - dragOffset.y });
        };

        const handlePointerUp = (e: React.PointerEvent) => {
            if (!draggedPiece || !boardRef.current) return;

            const rect = boardRef.current.getBoundingClientRect();
            let c = Math.floor((e.clientX - rect.left) / (rect.width / 8));
            let r = Math.floor((e.clientY - rect.top) / (rect.height / 8));

            r = Math.max(0, Math.min(7, r));
            c = Math.max(0, Math.min(7, c));

            const [realR, realC] = toRealPos(r, c);
            const piece = draggedPiece;
            const from = fromPos || "pool";

            if (from !== "pool" && from[0] === realR && from[1] === realC) {
                setDraggedPiece(null);
                setFromPos(null);
                setDragPos(null);
                setDragOffset(null);
                return;
            }

            const captured: PieceLetter | null = currentBoard[realR][realC] || null;

            setCurrentBoard((prev) => {
                const newBoard = prev.map((row) => [...row]);
                if (fromPos && fromPos !== "pool") newBoard[fromPos[0]][fromPos[1]] = null;
                newBoard[realR][realC] = piece;
                return newBoard;
            });

            const isMoveValid = from === "pool" || from[0] !== realR || from[1] !== realC || captured;
            if (isMoveValid) addMove({ pieceFrom: piece, from, to: [realR, realC], captured });

            setDraggedPiece(null);
            setFromPos(null);
            setDragPos(null);
            setDragOffset(null);
        };

        // -----------------------------
        // POOL CLICK
        // -----------------------------
        const handleClickSquare = (r: number, c: number) => {
            if (!selectedPoolPiece) return;
            if (currentBoard[r][c] === selectedPoolPiece) return;
            const captured = currentBoard[r][c] || null;

            setCurrentBoard((prev) => {
                const newBoard = prev.map((row) => [...row]);
                newBoard[r][c] = selectedPoolPiece;
                return newBoard;
            });

            addMove({ pieceFrom: selectedPoolPiece, from: "pool", to: [r, c], captured });
        };

        // -----------------------------
        // RIGHT CLICK ARROWS
        // -----------------------------
        const handleRightDown = (r: number, c: number) => {
            setIsRightMouseDown(true);
            setRightClickDragged(false);
            setArrows([[r, c]]);
        };
        const handleRightEnter = (r: number, c: number) => {
            if (isRightMouseDown) {
                setRightClickDragged(true);
                setArrows((prev) => [...prev, [r, c]]);
            }
        };
        const handleRightUp = () => {
            if (arrows.length === 0) {
                setIsRightMouseDown(false);
                setIsDraggingArrow(false);
                return;
            }

            setStoreArrow((prev) => {
                const end = arrows[arrows.length - 1];
                const exists = prev.some((path) => {
                    const pEnd = path[path.length - 1];
                    return pEnd[0] === end[0] && pEnd[1] === end[1];
                });

                if (exists) {
                    return prev.filter((path) => {
                        const pEnd = path[path.length - 1];
                        return !(pEnd[0] === end[0] && pEnd[1] === end[1]);
                    });
                }

                return [...prev, arrows];
            });

            setArrows([]);
            setIsRightMouseDown(false);
            setIsDraggingArrow(false);
        };

        // -----------------------------
        // DOUBLE RIGHT CLICK FOR CIRCLES
        // -----------------------------
        const handleRightClick = (r: number, c: number, e: React.MouseEvent) => {
            e.preventDefault();
            if (rightClickDragged) return;

            const now = Date.now();
            if (now - lastRightClickTime < doubleClickThreshold) {
                // DOUBLE RIGHT-CLICK → ADD
                const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 80%, 50%)`;
                setCircles((prev) => [...prev, { r, c, color: randomColor }]);
            } else {
                // SINGLE RIGHT-CLICK → REMOVE circle at this square
                setCircles((prev) => prev.filter((circle) => circle.r !== r || circle.c !== c));
            }

            setLastRightClickTime(now);
        };



        // -----------------------------
        // RENDER
        // -----------------------------
        return (
            <div className="w-full h-[99%] flex flex-row m-1 gap-4 bg-blue-100">
                <div className="flex flex-row items-center">
                    <div
                        ref={boardRef}
                        className={`relative grid grid-cols-8 grid-rows-8 ${boardSize}`}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        style={{ touchAction: "none" }}
                    >
                        {/* Circles from right-click */}
                        {circles.map((circle, i) => {
                            const squarePercent = 100 / 8;
                            const x = (circle.c + 0.5) * squarePercent;
                            const y = (circle.r + 0.5) * squarePercent;
                            const radiusPct = 5.5;
                            const strokePct = 0.6;

                            return (
                                <svg
                                    key={i}
                                    className="absolute top-0 left-0 pointer-events-none"
                                    style={{ width: "100%", height: "100%", zIndex: 60 }}
                                >
                                    <circle
                                        cx={`${x}%`}
                                        cy={`${y}%`}
                                        r={`${radiusPct}%`}
                                        stroke={circle.color}
                                        strokeWidth={`${strokePct}%`}
                                        fill="none"
                                        opacity={0.9}
                                        vectorEffect="non-scaling-stroke"
                                    />
                                </svg>
                            );
                        })}

                        <BoardGrid
                            displayedBoard={displayedBoard}
                            draggedPiece={draggedPiece}
                            dragPos={dragPos}
                            fromPos={fromPos}
                            boardFlipped={boardFlipped}
                            isDraggingArrow={isDraggingArrow}
                            toRealPos={toRealPos}
                            handleClickSquare={handleClickSquare}
                            handlePointerDownBoard={handlePointerDownBoard}
                            onRightDown={handleRightDown}
                            onRightEnter={handleRightEnter}
                            onRightUp={handleRightUp}
                            onRightClick={handleRightClick}
                            circles={circles}
                        />

                        {/* Live arrow while dragging */}
                        {isRightMouseDown && arrows.length > 0 && (
                            <MoveArrows
                                from={{ r: arrows[0][0], c: arrows[0][1] }}
                                legalMoves={arrows}
                                flipped={boardFlipped}
                                isDrawing={true}
                            />
                        )}

                        {/* Stored arrows */}
                        {storeArrow.map(
                            (path, i) =>
                                path.length > 0 && (
                                    <MoveArrows
                                        key={i}
                                        from={{ r: path[0][0], c: path[0][1] }}
                                        legalMoves={path}
                                        flipped={boardFlipped}
                                        isDrawing={false}
                                    />
                                )
                        )}
                    </div>

                    <PiecePools selectedPoolPiece={selectedPoolPiece} onSelectPiece={setSelectedPoolPiece} />
                </div>
            </div>
        );
    }
);

export default Board;
