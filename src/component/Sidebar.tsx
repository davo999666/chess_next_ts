"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useHistory } from "@/context/HistoryContext";
import { BoardHandle } from "./Board";

type SidebarProps = { boardRef: React.RefObject<BoardHandle | null>; };

const Sidebar: React.FC<SidebarProps> = ({ boardRef }) => {
    const pathname = usePathname();
    const { history } = useHistory();

    return (
        <div className="w-full h-screen bg-[#1e1e2f] text-white p-1 flex flex-col shadow-lg text-center">
            <nav className="flex-1">
                <ul>
                    {["Game Board", "Learning Board", "Practice Board"].map((name) => (
                        <li key={name} className="mb-4">
                            <span className="block px-4 py-2 rounded hover:bg-[#444466]">{name}</span>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Controls */}
            <div className="flex flex-col gap-2 mb-4">
                <button onClick={() => boardRef.current?.resetBoard()} className="px-4 py-2 bg-indigo-600 rounded text-white">Clear Board</button>
                <button onClick={() => boardRef.current?.moveBack()} className="px-4 py-2 bg-gray-600 rounded text-white">Move Back</button>
                <button onClick={() => boardRef.current?.flipBoard()} className="px-4 py-2 bg-gray-600 rounded text-white">Flip Board</button>
            </div>

        </div>
    );
};

export default Sidebar;
