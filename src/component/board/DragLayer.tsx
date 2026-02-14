import React from "react";
import { PieceLetter } from "@/utils/pieceMap";
import PieceImage from "../../component/PieceImage";

type Props = {
    piece: PieceLetter;
    x: number;
    y: number;
};

const DragLayer: React.FC<Props> = ({ piece, x, y }) => {
    return (
        <div
            className="absolute pointer-events-none"
            style={{ left: x, top: y }}

        >
            <PieceImage piece={piece}  />

        </div>
    );
};

export default DragLayer;
