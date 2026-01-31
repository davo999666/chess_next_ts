import React from "react";
import { useHistory } from "@/context/HistoryContext";
import { letters, numbers } from "@/utils/boardUtils";

const SidebarRight = () => {
    const { history } = useHistory();

    // Convert [row, col] to chess notation
    const posToChess = (pos: [number, number] | "pool" | "removed") => {
        if (pos === "pool") return "Pool";
        if (pos === "removed") return "Removed";
        const [r, c] = pos;
        return `${letters[c]}${numbers[r]}`;
    };

    return (
        <div className="w-full h-screen bg-[#1e1e2f] p-1 text-white flex flex-col shadow-lg">
            {/*History*/}
            <div className="w-full h-[20vw] bg-[#1e1e2f] text-white flex flex-col shadow-lg">
                <div className="flex-1 bg-gray-100 text-black rounded shadow overflow-y-auto p-2">
                    <h3 className="font-bold mb-2 text-lg text-center">History</h3>
                    <ul className="text-sm space-y-1">
                        {history.map((move, i) => (
                            <li key={i}>
                                {i + 1}. {move.pieceFrom} {posToChess(move.from)} → {posToChess(move.to)}{" "}
                                {move.captured ? `x${move.captured}` : ""}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SidebarRight;
