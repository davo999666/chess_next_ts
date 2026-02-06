import { useRef, useState } from "react";

export type Square = [number, number];

export const useArrowDrawing = () => {
    const [arrows, setArrows] = useState<Square[]>([]);
    const [storedArrows, setStoredArrows] = useState<Square[][]>([]);
    const lastPosRef = useRef<Square | null>(null);


    const handleRightEnter = (r: number, c: number) => {
        const newPos: Square = [r, c];
        const lastPos = lastPosRef.current;

        if (!lastPos || lastPos[0] !== r || lastPos[1] !== c) {
            setArrows((prev) => [...prev, [r, c]]);
            lastPosRef.current = newPos;
        }
    };

    const handleRightUp = () => {
        if (!arrows.length) return;
        setStoredArrows((prev) => {
            const idx = prev.findIndex((path) => {
                if (!path.length) return false;
                const startMatch = path[0][0] === arrows[0][0] && path[0][1] === arrows[0][1];
                const endMatch =
                    path[path.length - 1][0] === arrows[arrows.length - 1][0] &&
                    path[path.length - 1][1] === arrows[arrows.length - 1][1];
                const reverseStart =
                    path[0][0] === arrows[arrows.length - 1][0] &&
                    path[0][1] === arrows[arrows.length - 1][1];
                const reverseEnd =
                    path[path.length - 1][0] === arrows[0][0] &&
                    path[path.length - 1][1] === arrows[0][1];
                return (startMatch && endMatch) || (reverseStart && reverseEnd);
            });
            if (idx !== -1) return prev.filter((_, i) => i !== idx);
            return [...prev, arrows];
        });

        setArrows([]);
        lastPosRef.current = null;
    };

    return {
        arrows,
        storedArrows,
        setStoredArrows,
        handleRightEnter,
        handleRightUp
    };
};
