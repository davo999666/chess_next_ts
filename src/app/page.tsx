"use client";
import React, { useRef } from "react";
import Board, { BoardHandle } from "@/component/Board";
import Sidebar from "@/component/Sidebar";
import SidebarRight from "@/component/SidebarRight";

export default function Home() {
  const boardRef = useRef<BoardHandle>(null);

  return (
      <div className="flex min-h-screen">
        {/* Left sidebar */}
        <Sidebar boardRef={boardRef} />

        {/* Main board */}
        <main className="flex-1 p-4 flex justify-center items-start">
          <Board ref={boardRef} />
        </main>

        {/* Right sidebar */}
        <SidebarRight />
      </div>
  );
}
