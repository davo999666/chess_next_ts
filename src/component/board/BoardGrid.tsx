"use client";
import React, { useState, useRef } from "react";
import PieceImage from "../../component/PieceImage";
import DragLayer from "../../component/board/DragLayer";
import { PieceLetter } from "../../utils/pieceMap";
import { letters, numbers } from "../../utils/boardUtils";

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

    legalMoves?: Square[];
    onRightEnter: (r: number, c: number) => void;
    onRightUp: () => void;
    onRightClick?: (r: number, c: number, e: React.MouseEvent) => void;
};

const FAST_CLICK_TIME = 200; // ms

const BoardGrid: React.FC<BoardGridProps> = ({
                                                 displayedBoard,
                                                 draggedPiece,
                                                 dragPos,
                                                 fromPos,
                                                 toRealPos,
                                                 handleClickSquare,
                                                 handlePointerDownBoard,
                                                 boardFlipped,
                                                 onRightEnter,
                                                 onRightUp,
                                                 onRightClick,
                                                 legalMoves = [],
                                             }) => {
    const boardLetters = boardFlipped ? [...letters].reverse() : letters;
    const boardNumbers = boardFlipped ? [...numbers].reverse() : numbers;

    const [isRightMouseDown, setIsRightMouseDown] = useState(false);
    const rightClickStart = useRef<number>(0);
    const rightMoved = useRef(false);



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
                    const isLegal = legalMoves.some(([lr, lc]) => lr === realR && lc === realC);

                    return (
                        <div
                            key={`${r}-${c}`}
                            data-testid={`square-${r}-${c}`}
                            className={`relative flex items-center justify-center w-full h-full ${
                                isDark ? "bg-[#b58863]" : "bg-[#f0d9b5]"
                            }`}

                            onMouseDown={(e) => {
                                if (e.button === 2) {
                                    e.preventDefault();
                                    setIsRightMouseDown(true);

                                    rightClickStart.current = Date.now();
                                    rightMoved.current = false;
                                    onRightEnter(realR, realC);
                                }
                            }}

                            onMouseEnter={() => {
                                if (isRightMouseDown) {
                                    rightMoved.current = true;
                                    onRightEnter(realR, realC);
                                }
                            }}

                            onMouseUp={(e) => {
                                if (e.button === 2) {
                                    e.preventDefault();
                                    setIsRightMouseDown(false);

                                    const duration = Date.now() - rightClickStart.current;

                                    // ✅ FAST right click only
                                    if (!rightMoved.current && duration < FAST_CLICK_TIME) {
                                        onRightClick?.(realR, realC, e);
                                    }

                                    onRightUp();
                                }
                            }}

                            onContextMenu={(e) => e.preventDefault()} // block browser menu
                        >
                            <div
                                className="absolute w-full h-full flex items-center justify-center"
                                onClick={() => handleClickSquare(realR, realC)}
                                onPointerDown={piece ? handlePointerDownBoard(realR, realC, piece) : undefined}
                            >
                                {!isFrom && piece && <PieceImage piece={piece} />}
                            </div>

                            {r === 7 && (
                                <span className="absolute bottom-0 right-0 text-black font-bold text-base sm:text-lg md:text-xl leading-none">
                  {boardLetters[c]}
                </span>
                            )}
                            {c === 0 && (
                                <span className="absolute left-0 top-0 text-black font-bold text-base sm:text-lg md:text-xl leading-none">
                  {boardNumbers[r]}
                </span>
                            )}
                            {/*⚫ Legal move indicator*/}
                            {isLegal && <span className="absolute w-3 h-3  rounded-full bg-black/40" />}
                        </div>
                    );
                })
            )}

            {draggedPiece && dragPos && <DragLayer piece={draggedPiece} x={dragPos.x} y={dragPos.y} />}
        </>
    );
};

export default BoardGrid;
