import React, { useEffect, useRef } from "react";
import { useHistory } from "@/context/HistoryContext";
import { letters, numbers } from "@/utils/boardUtils";
import {SidebarSize, SidebarSizeRight} from "@/utils/classNameSize";

const SidebarRight = () => {
    const { history } = useHistory();
    const bottomRef = useRef<HTMLDivElement | null>(null);

    // Convert [row, col] to chess notation
    const posToChess = (pos: [number, number] | "pool" | "removed") => {
        if (pos === "pool") return "Pool";
        if (pos === "removed") return "Removed";
        const [r, c] = pos;
        return `${letters[c]}${numbers[r]}`;
    };

    // Auto-scroll when history updates
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    return (
        <div className={`${SidebarSizeRight} bg-[#1e1e2f] p-1 pt-2 text-white flex flex-col rounded-lg`}>
            <div className="w-full h-[30vw] md:h-[20vw] bg-[#1e1e2f] text-white flex flex-col rounded-lg">
                <div className="flex-1 bg-gray-100 text-black rounded shadow overflow-y-auto p-2">
                    <h3 className="font-bold mb-2 text-lg text-center">History</h3>

                    <ul className="text-sm space-y-1">
                        {history.map((move, i) => (
                            <li key={i}>
                                {i + 1}.{" "}
                                {move.pieceFrom.toUpperCase() !== "P"
                                    ? move.pieceFrom.toUpperCase()
                                    : ""}
                                {posToChess(move.from).toLowerCase()}
                                {move.captured ? " x " : " → "}
                                {posToChess(move.to).toLowerCase()}
                            </li>
                        ))}
                    </ul>

                    {/* Scroll target */}
                    <div ref={bottomRef} />
                </div>
            </div>
        </div>
    );
};

export default SidebarRight;
