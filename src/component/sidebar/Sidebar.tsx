"use client";
import React, { useState } from "react";
import { BoardHandle } from "@/hooks/useBoardHandlers";
import { SidebarSize } from "@/utils/classNameSize";

type SidebarProps = { boardRef: React.RefObject<BoardHandle | null> };

const Sidebar: React.FC<SidebarProps> = ({ boardRef }) => {
    // Track only the active state for the two buttons
    const [activeButtons, setActiveButtons] = useState<{ [key: string]: boolean }>({
        "Turn Board": false,
        "Show legal move": false,
    });

    // Group buttons into 3 sections
    const buttonGroups = [
        [
            { label: "Start", action: () => boardRef.current?.getBoard?.() },
            { label: "Move Back", action: () => boardRef.current?.moveBack() },
        ],
        [
            { label: "Turn Board", action: () => boardRef.current?.flipBoard() },
            { label: "Show legal move", action: () => boardRef.current?.switchLegalMoves() },
        ],
        [
            { label: "Clear Board Arrows", action: () => boardRef.current?.clearArrowBoard() },
            { label: "Clear Board", action: () => boardRef.current?.resetBoard() },
        ],
    ];

    const handleClick = (btn: { label: string; action: () => void }) => {
        btn.action();

        // Only toggle color for these two buttons
        if (btn.label === "Turn Board" || btn.label === "Show legal move") {
            setActiveButtons((prev) => ({
                ...prev,
                [btn.label]: !prev[btn.label],
            }));
        }
    };

    return (
        <div
            className={`${SidebarSize} bg-[#1e1e2f] 
        p-2 pt-3 text-white flex flex-col shadow-lg text-center rounded-lg
        overflow-y-auto`}
        >
            <div className="flex flex-col gap-4">
                {buttonGroups.map((group, groupIndex) => (
                    <div
                        key={groupIndex}
                        className="rounded-xl p-1 flex flex-col gap-3"
                    >
                        {group.map((btn) => {
                            const isActive = activeButtons[btn.label] ?? false;

                            const bgClass =
                                btn.label === "Turn Board" || btn.label === "Show legal move"
                                    ? isActive
                                        ? "bg-green-600 hover:bg-green-500 active:bg-green-700"
                                        : "bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700"
                                    : "bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700";

                            return (
                                <button
                                    key={btn.label}
                                    onClick={() => handleClick(btn)}
                                    className={`
                    px-4 py-3
                    text-white font-medium rounded-lg
                    shadow-md
                    transition transform duration-300
                    hover:scale-105
                    active:scale-95
                    ${bgClass}
                  `}
                                >
                                    {btn.label}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
