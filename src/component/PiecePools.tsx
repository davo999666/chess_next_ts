import React from "react";
import { PieceLetter, pieceMap } from "../utils/pieceMap";
import {itemSize, pieceSize} from "../utils/classNameSize";

const chessPieces: PieceLetter[] = [
    "K", "Q", "R", "B", "N", "P",
    "apple", "banana", "strawberry", "icecream"
];

const makeWhite = (p: PieceLetter) =>
    /^[KQRBNP]$/.test(p) ? p.toUpperCase() as PieceLetter : p;

const makeBlack = (p: PieceLetter) =>
    /^[KQRBNP]$/.test(p) ? p.toLowerCase() as PieceLetter : p;

type PiecePoolsProps = {
    selectedPoolPiece: PieceLetter | null;
    onSelectPiece: (piece: PieceLetter | null) => void;
};

const PiecePools: React.FC<PiecePoolsProps> = ({ selectedPoolPiece, onSelectPiece }) => {
    // Split fun items into two halves for white/black
    const funItems: PieceLetter[] = ["apple", "banana", "strawberry", "icecream"];
    const mid = Math.ceil(funItems.length / 2);
    const whiteFun = funItems.slice(0, mid) as PieceLetter[];
    const blackFun = funItems.slice(mid) as PieceLetter[];

    const renderPiece = (piece: PieceLetter, color?: string, isFunItem = false) => {
        const isSelected = selectedPoolPiece === piece;
        const key = color ? `${color}-${piece}` : piece;

        const src = pieceMap[piece]; // chess SVG or fun icon PNG

        return (
            <img
                key={key}
                src={src}
                alt={piece}
                draggable={false}
                className={isFunItem ? itemSize : pieceSize}
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
    };

    return (
        <div className="flex rounded shadow bg-gray-50">
            {/* White section */}
            <div className="flex flex-col items-center justify-center bg-gray-100 rounded">
                {chessPieces
                    .filter(p => /^[KQRBNP]$/.test(p))
                    .map(p => renderPiece(makeWhite(p as PieceLetter), "white"))}
                {whiteFun.map(p => renderPiece(p, "white", true))}
            </div>

            {/* Black section */}
            <div className="flex flex-col items-center justify-center bg-gray-200 rounded">
                {chessPieces
                    .filter(p => /^[KQRBNP]$/.test(p))
                    .map(p => renderPiece(makeBlack(p as PieceLetter), "black"))}
                {blackFun.map(p => renderPiece(p, "black", true))}
            </div>
        </div>
    );
};

export default PiecePools;
