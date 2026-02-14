import React from "react";
import { pieceMap, PieceLetter } from "../utils/pieceMap";
import { itemSize, pieceSize } from "../utils/classNameSize";

// list of fun items
const funItems: PieceLetter[] = ["apple", "banana", "strawberry", "icecream"];

type PieceImageProps = {
    piece: PieceLetter | null;
    onPointerDown?: (e: React.PointerEvent<HTMLImageElement>) => void;
    style?: React.CSSProperties;
};

const PieceImage: React.FC<PieceImageProps> = ({ piece, onPointerDown, style }) => {
    if (!piece) return null;

    const isFunItem = funItems.includes(piece); // check by alt/piece name

    return (
        <img
            src={pieceMap[piece]}
            alt={piece}
            onPointerDown={onPointerDown}
            draggable={false} // stop browser drag ghost
            className={isFunItem ? itemSize : pieceSize}
            style={style}
        />
    );
};

export default PieceImage;
