// context/HistoryContext.tsx
"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { PieceLetter} from "@/utils/pieceMap";

export type Move = {
    pieceFrom: PieceLetter;
    from: [number, number] | "pool";
    to: [number, number] | "removed";
    captured?: PieceLetter | null;
};

type HistoryContextType = {
    history: Move[];
    addMove: (move: Move) => void;
    moveBack: () => void;
    clearHistory: () => void;
};

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [history, setHistory] = useState<Move[]>([]);

    const addMove = (move: Move) => {
        setHistory((prev) => {
            const lastMove = prev[prev.length - 1];

            // If the move doesn't change position, don't add
            if (JSON.stringify(move.from) === JSON.stringify(move.to)) {
                return prev;
            }

            const isSame =
                lastMove &&
                lastMove.pieceFrom === move.pieceFrom &&
                JSON.stringify(lastMove.from) === JSON.stringify(move.from) &&
                JSON.stringify(lastMove.to) === JSON.stringify(move.to) &&
                lastMove.captured === move.captured;

            if (isSame) return prev; // Don't add duplicate
            return [...prev, move];
        });

    };
    const moveBack = () => setHistory((prev) => prev.slice(0, -1));
    const clearHistory = () => setHistory([]);

    return (
        <HistoryContext.Provider value={{ history, addMove, moveBack, clearHistory }}>
            {children}
        </HistoryContext.Provider>
    );
};

export const useHistory = () => {
    const context = useContext(HistoryContext);
    if (!context) throw new Error("useHistory must be used within HistoryProvider");
    return context;
};
