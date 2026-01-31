// BoardGrid.tsx
"use client";
import React from "react";
import PieceImage from "@/component/PieceImage";
import DragLayer from "@/component/board/DragLayer";
import { PieceLetter } from "@/utils/pieceMap";
import {letters, numbers} from "@/utils/boardUtils";

type BoardGridProps = {
    displayedBoard: (PieceLetter | null)[][];
    draggedPiece: PieceLetter | null;
    dragPos: { x: number; y: number } | null;
    fromPos: [number, number] | "pool" | null;
    toRealPos: (r: number, c: number) => [number, number];
    handleClickSquare: (r: number, c: number) => void;
    handlePointerDownBoard: (r: number, c: number, piece: PieceLetter) => (e: React.PointerEvent) => void;
    boardFlipped:boolean
};

const BoardGrid: React.FC<BoardGridProps> = ({
                                                 displayedBoard,
                                                 draggedPiece,
                                                 dragPos,
                                                 fromPos,
                                                 toRealPos,
                                                 handleClickSquare,
                                                 handlePointerDownBoard,
                                                 boardFlipped
                                             }) => {
    const boardLetters = boardFlipped ? [...letters].reverse() : letters;
    const boardNumbers = boardFlipped ? [...numbers].reverse() : numbers;
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
                        >
                            <div
                                className="absolute w-full h-full flex items-center justify-center"
                                style={{ top: 0, left: 0 }}
                                onClick={() => handleClickSquare(realR, realC)}
                                onPointerDown={
                                    piece ? handlePointerDownBoard(realR, realC, piece) : undefined
                                }
                            >
                                {!isFrom && piece && <PieceImage piece={piece} />}
                            </div>

                            {r === 7 && (
                                <span className="absolute bottom-1 right-1 text-black font-bold text-lg">
                                    {boardLetters[c]}
                                </span>
                            )}
                            {c === 0 && (
                                <span className="absolute left-1 top-1 text-black font-bold text-lg">
                                    {boardNumbers[r]}
                                </span>
                            )}
                        </div>
                    );
                })
            )}

            {draggedPiece && dragPos && <DragLayer piece={draggedPiece} x={dragPos.x} y={dragPos.y} />}
        </>
    );
};

export default BoardGrid;
