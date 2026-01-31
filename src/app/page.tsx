"use client";
import React, { useRef } from "react";
import Board from "@/component/board/Board";
import Sidebar from "@/component/Sidebar";
import SidebarRight from "@/component/SidebarRight";
import {BoardHandle} from "@/hooks/useBoardHandlers";

export default function Home() {
  const boardRef = useRef<BoardHandle>(null);

  return (
      <div className="flex min-h-screen flex-col md:flex-row">
        {/* Left sidebar */}
        <Sidebar boardRef={boardRef} />

        {/* Main board */}
        <main className="flex-1 flex justify-center items-start">
          <Board ref={boardRef} />
        </main>

        {/* Right sidebar */}
        <SidebarRight />
      </div>
  );
}
