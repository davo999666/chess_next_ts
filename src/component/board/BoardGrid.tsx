"use client";
import React from "react";
import PieceImage from "@/component/PieceImage";
import DragLayer from "@/component/board/DragLayer";
import { PieceLetter } from "@/utils/pieceMap";
import { letters, numbers } from "@/utils/boardUtils";

type Square = [number, number];

type BoardGridProps = {
    displayedBoard: (PieceLetter | null)[][];
    draggedPiece: PieceLetter | null;
    dragPos: { x: number; y: number } | null;
    fromPos: Square | "pool" | null;
    toRealPos: (r: number, c: number) => Square;
    handleClickSquare: (r: number, c: number) => void;
    handlePointerDownBoard: (r: number, c: number, piece: PieceLetter) => (e: React.PointerEvent) => void;
    boardFlipped: boolean;
    isDraggingArrow: boolean;

    onRightDown: (r: number, c: number) => void;
    onRightEnter: (r: number, c: number) => void;
    onRightUp: () => void;
    onRightClick?: (r: number, c: number, e: React.MouseEvent) => void; // new
    circles?: { r: number; c: number; color: string }[]; // new
};

const BoardGrid: React.FC<BoardGridProps> = ({
                                                 displayedBoard,
                                                 draggedPiece,
                                                 dragPos,
                                                 fromPos,
                                                 toRealPos,
                                                 handleClickSquare,
                                                 handlePointerDownBoard,
                                                 boardFlipped,
                                                 onRightDown,
                                                 onRightEnter,
                                                 onRightUp,
                                                 onRightClick,
                                                 circles = [],
                                                 isDraggingArrow
                                             }) => {
    const boardLetters = boardFlipped ? [...letters].reverse() : letters;
    const boardNumbers = boardFlipped ? [...numbers].reverse() : numbers;

    const squarePercent = 100 / 8; // for circle positioning

    const toPercent = (r: number, c: number) => {
        if (boardFlipped) {
            r = 7 - r;
            c = 7 - c;
        }
        return {
            x: (c + 0.5) * squarePercent,
            y: (r + 0.5) * squarePercent,
        };
    };

    return (
        <>
            {displayedBoard.map((row, r) =>
                row.map((piece, c) => {
                    const isDark = (r + c) % 2 === 1;
                    const [realR, realC] = toRealPos(r, c);

                    const isFrom =
                        draggedPiece &&
                        dragPos &&
                        fromPos &&
                        fromPos !== "pool" &&
                        fromPos[0] === realR &&
                        fromPos[1] === realC;

                    return (
                        <div
                            key={`${r}-${c}`}
                            className={`relative flex items-center justify-center w-full h-full ${
                                isDark ? "bg-[#b58863]" : "bg-[#f0d9b5]"
                            }`}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                if (!isDraggingArrow) onRightClick?.(realR, realC, e);
                            }}
                            onMouseDown={(e) => {
                                if (e.button === 2) onRightDown(realR, realC);
                            }}
                            onMouseEnter={() => onRightEnter(realR, realC)}
                            onMouseUp={(e) => {
                                if (e.button === 2) onRightUp();
                            }}
                        >
                            <div
                                className="absolute w-full h-full flex items-center justify-center"
                                onClick={() => handleClickSquare(realR, realC)}
                                onPointerDown={piece ? handlePointerDownBoard(realR, realC, piece) : undefined}
                            >
                                {!isFrom && piece && <PieceImage piece={piece} />}
                            </div>

                            {r === 7 && (
                                <span className="absolute bottom-1 right-1 text-black font-bold text-xs sm:text-sm md:text-lg">
                  {boardLetters[c]}
                </span>
                            )}
                            {c === 0 && (
                                <span className="absolute left-1 top-1 text-black font-bold text-xs sm:text-sm md:text-lg">
                  {boardNumbers[r]}
                </span>
                            )}
                        </div>
                    );
                })
            )}

            {/* Render dragged piece */}
            {draggedPiece && dragPos && <DragLayer piece={draggedPiece} x={dragPos.x} y={dragPos.y} />}

            {/* Render right-click circles */}
            {circles.map((circle, i) => {
                const pos = toPercent(circle.r, circle.c);
                return (
                    <svg
                        key={i}
                        className="absolute top-0 left-0 pointer-events-none"
                        style={{ width: "100%", height: "100%", zIndex: 60 }}
                    >
                        <circle
                            cx={`${pos.x}%`}
                            cy={`${pos.y}%`}
                            r="5.5%"
                            stroke={circle.color}
                            strokeWidth="0.6%"
                            fill="none"
                            opacity={0.9}
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                );
            })}
        </>
    );
};

export default BoardGrid;
