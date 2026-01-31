"use client";
import React from "react";
import { BoardHandle } from "@/hooks/useBoardHandlers";

type SidebarProps = { boardRef: React.RefObject<BoardHandle | null>; };

const Sidebar: React.FC<SidebarProps> = ({ boardRef }) => {
    const buttons = [
        { label: "Move Back", action: () => boardRef.current?.moveBack() },
        { label: "Flip Board", action: () => boardRef.current?.flipBoard() },
        { label: "Clear Board", action: () => boardRef.current?.resetBoard() },
        { label: "Get Board", action: () => boardRef.current?.getBoard?.() },
    ];

    return (
        <div className="w-full h-[40dvh] md:w-full md:h-screen bg-[#1e1e2f] p-1 pt-3 text-white flex flex-col shadow-lg text-center rounded-lg">
            <div className="flex flex-col gap-3">
                {buttons.map((btn) => (
                    <button
                        key={btn.label}
                        onClick={btn.action}
                        className="
              px-4 py-3
              bg-indigo-600 text-white font-medium rounded-lg
              shadow-md
              transition transform duration-150
              hover:bg-indigo-500
              active:scale-95 active:bg-indigo-700
            "
                    >
                        {btn.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
