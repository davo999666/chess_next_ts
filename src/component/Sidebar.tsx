"use client";
import React from "react";
import {BoardHandle} from "@/hooks/useBoardHandlers";


type SidebarProps = { boardRef: React.RefObject<BoardHandle | null>; };

const Sidebar: React.FC<SidebarProps> = ({ boardRef }) => {

    return (
        <div className="w-full h-screen bg-[#1e1e2f] text-white p-1 flex flex-col shadow-lg text-center">

            {/* Controls */}
            <div className="flex flex-col gap-2 mb-4">
                <button onClick={() => boardRef.current?.moveBack()}
                        className="px-4 py-2 bg-gray-600 rounded text-white">Move Back
                </button>
                <button onClick={() => boardRef.current?.flipBoard()}
                        className="px-4 py-2 bg-gray-600 rounded text-white">Flip Board
                </button>
                <button onClick={() => boardRef.current?.resetBoard()}
                        className="px-4 py-2 bg-gray-600 rounded text-white">Clear Board
                </button>
                <button onClick={() => boardRef.current?.getBoard()}
                        className="px-4 py-2 bg-gray-600 rounded text-white">Get Board
                </button>
            </div>

        </div>
    );
};

export default Sidebar;
