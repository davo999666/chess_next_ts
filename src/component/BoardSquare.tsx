import React from "react";
import { PieceLetter } from "@/utils/pieceMap";
import PieceImage from "@/component/PieceImage";
import { letters, numbers } from "@/utils/boardUtils";

type Props = {
    r: number; c: number; piece: PieceLetter | null; isDark: boolean; isFrom: boolean; realR: number;
    realC: number; selectedPoolPiece: PieceLetter | null; onClickSquare: (r: number, c: number) => void;
    onPointerDownPiece: (r: number, c: number, piece: PieceLetter) => (e: React.PointerEvent) => void;
};

const BoardSquare: React.FC<Props> = ({r, c, piece, isDark, isFrom, realR, realC, selectedPoolPiece, onClickSquare, onPointerDownPiece,}) => {
    return (
        <div
            className={`relative flex items-center justify-center w-full h-full ${
                isDark ? "bg-[#b58863]" : "bg-[#f0d9b5]"
            }`}
        >
            <div
                className="absolute w-[80%] h-[80%] flex items-center justify-center"
                style={{ top: "10%", left: "10%" }}
                onClick={() => onClickSquare(realR, realC)}
                onPointerDown={piece && !selectedPoolPiece ? onPointerDownPiece(realR, realC, piece) : undefined}
            >
                {!isFrom && piece && <PieceImage piece={piece} />}
            </div>

            {r === 7 && (
                <span className="absolute bottom-1 right-1 text-black font-bold text-lg">{letters[c]}</span>
            )}
            {c === 0 && (
                <span className="absolute left-1 top-1 text-black font-bold text-lg">{numbers[r]}</span>
            )}
        </div>
    );
};

export default BoardSquare;
