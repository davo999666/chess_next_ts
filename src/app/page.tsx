"use client";
import React, { useRef } from "react";
import Board from "@/component/board/Board";
import Sidebar from "@/component/sidebar/Sidebar";
import SidebarRight from "@/component/sidebar/SidebarRight";
import {BoardHandle} from "@/hooks/useBoardHandlers";

export default function Home() {
  const boardRef = useRef<BoardHandle>(null);

  return (
      <div className="flex min-h-screen flex-col md:flex-row overflow-hidden">
        {/* Left sidebar */}
        <Sidebar boardRef={boardRef} />

        {/* Main board */}
        <main>
          <Board ref={boardRef} />
        </main>

        {/* Right sidebar */}
        <SidebarRight />
      </div>
  );
}
