import React from "react";
import {useHistory} from "@/context/HistoryContext";

const SidebarRight = () => {

    const { history } = useHistory();
    return (
        <div className="w-full h-screen bg-[#1e1e2f] p-1 text-white flex flex-col shadow-lg">

            {/*History*/}
            <div className="w-full h-[20vw] bg-[#1e1e2f] text-white flex flex-col shadow-lg">
                <div className="flex-1 bg-gray-100 text-black rounded shadow overflow-y-auto">
                    <h3 className="font-bold mb-2 text-lg text-center">History</h3>
                    <ul className="text-sm space-y-1">
                        {history.map((move, i) => (
                            <li key={i}>
                                {i + 1}. {move.pieceFrom}{" "}
                                {move.from === "pool" ? "Pool" : `${move.from[0]},${move.from[1]}`} →{" "}
                                {move.to === "removed" ? "Removed" : `${move.to[0]},${move.to[1]}`}{" "}
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