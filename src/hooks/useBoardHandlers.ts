import React, { useImperativeHandle } from "react";
import { PieceLetter } from "@/utils/pieceMap";
import { Move } from "@/context/HistoryContext";
import {initialBoard, initialEmptyBoard} from "../utils/boardUtils"; // adjust type if needed


export type BoardHandle = {
    resetBoard: () => void;
    moveBack: () => void;
    flipBoard: () => void;
    getBoard:()=> void;
    clearArrowBoard: () => void;
    switchLegalMoves:()=> void;
};

type Params = {
    ref: React.Ref<any>;
    history: Move[];
    setCurrentBoard: React.Dispatch<React.SetStateAction<(PieceLetter | null)[][]>>;
    clearHistory: () => void;
    moveBackHistory: () => void;
    setSelectedPoolPiece: (v: PieceLetter | null) => void;
    setBoardFlipped: React.Dispatch<React.SetStateAction<boolean>>;
    setStoredArrows: React.Dispatch<React.SetStateAction<[number, number][][]>>;
    setCircles: React.Dispatch<React.SetStateAction<{ r: number; c: number; color: string }[]>>;
    setSwitchLegalMoves: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useBoardHandlers({
                                     ref,
                                     history,
                                     setCurrentBoard,
                                     clearHistory,
                                     moveBackHistory,
                                     setSelectedPoolPiece,
                                     setBoardFlipped,
                                     setStoredArrows,
                                     setCircles,
                                     setSwitchLegalMoves
}
                                     : Params) {
    useImperativeHandle(ref, () => ({
        resetBoard: () => {
            setCurrentBoard(initialEmptyBoard);
            clearHistory();
            setSelectedPoolPiece(null);
        },

        moveBack: () => {
            if (!history.length) return;
            const lastMove = history[history.length - 1];

            setCurrentBoard(prev => {
                const newBoard = prev.map(r => [...r]);
                const { from, to, pieceFrom, captured } = lastMove;

                if (to !== "removed") {
                    const [tr, tc] = to as [number, number];
                    newBoard[tr][tc] = captured || null;
                }

                if (from !== "pool") {
                    const [fr, fc] = from as [number, number];
                    newBoard[fr][fc] = pieceFrom;
                }

                return newBoard;
            });

            moveBackHistory();
        },

        flipBoard: () => {
            setBoardFlipped(prev => !prev);
        },
        getBoard:()=>{
            setCurrentBoard(initialBoard)
        },
        clearArrowBoard: () => {
            setStoredArrows([]);
            setCircles([]);
        },
        switchLegalMoves:()=>{
            setSwitchLegalMoves(prev => !prev)
        }
    }));
}
