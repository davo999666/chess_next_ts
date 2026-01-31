import React from "react";
import { PieceLetter, pieceMap } from "@/utils/pieceMap";
import { pieceSize } from "@/utils/classNameSize";

const pieces: PieceLetter[] = ["K", "Q", "R", "B", "N", "P"];
const makeWhite = (p: PieceLetter) => p.toUpperCase() as PieceLetter;
const makeBlack = (p: PieceLetter) => p.toLowerCase() as PieceLetter;

type PiecePoolsProps = {
    selectedPoolPiece: PieceLetter | null;
    onSelectPiece: (piece: PieceLetter | null) => void;
};

const PiecePools: React.FC<PiecePoolsProps> = ({ selectedPoolPiece, onSelectPiece }) => {
    return (
        <div className="flex gap-4 p-2 rounded shadow bg-gray-50">
            {[
                { color: "white", make: makeWhite, bg: "bg-gray-100" },
                { color: "black", make: makeBlack, bg: "bg-gray-200" },
            ].map(({ color, make, bg }) => (
                <div
                    key={color}
                    className={`flex flex-col gap-2 items-center justify-center ${bg} p-2 rounded`}
                >
                    {pieces.map((p) => {
                        const piece = make(p);
                        const isSelected = selectedPoolPiece === piece;

                        return (
                            <img
                                key={piece}
                                src={pieceMap[piece]}
                                alt={piece}
                                draggable={false}
                                className={pieceSize}
                                style={{
                                    border: isSelected ? "2px solid red" : "2px solid transparent",
                                    borderRadius: 6,
                                    cursor: "pointer",
                                }}
                                onPointerDown={(e) => {
                                    e.preventDefault();
                                    onSelectPiece(isSelected ? null : piece);
                                }}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default PiecePools;
