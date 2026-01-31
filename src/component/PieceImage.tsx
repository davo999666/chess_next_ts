import React from "react";
import { pieceMap, PieceLetter } from "@/utils/pieceMap";
import { pieceSize } from "@/utils/classNameSize";

type PieceImageProps = {
    piece: PieceLetter | null;
    onPointerDown?: (e: React.PointerEvent<HTMLImageElement>) => void;
    style?: React.CSSProperties;
};

const PieceImage: React.FC<PieceImageProps> = ({ piece, onPointerDown }) => {
    if (!piece) return null;

    return (
        <img
            src={pieceMap[piece]}
            alt={piece}
            onPointerDown={onPointerDown}
            draggable={false} // stop browser drag ghost
            className={pieceSize}
        />
    );
};

export default PieceImage;
