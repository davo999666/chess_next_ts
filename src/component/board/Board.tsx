"use client";
import React, {forwardRef, useEffect, useRef, useState,} from "react";
import {flipBoardView, initialBoard} from "@/utils/boardUtils";
import {PieceLetter} from "@/utils/pieceMap";
import {boardSize} from "@/utils/classNameSize";
import PiecePools from "@/component/PiecePools";
import {useHistory} from "@/context/HistoryContext";
import BoardGrid from "@/component/board/BoardGrid";
import {BoardHandle, useBoardHandlers} from "@/hooks/useBoardHandlers";


type BoardProps = {
    board?: (PieceLetter | null)[][];
    flipped?: boolean;
};

const Board = forwardRef<BoardHandle, BoardProps>(({ board = initialBoard, flipped = false }, ref) => {
    const [currentBoard, setCurrentBoard] = useState<(PieceLetter | null)[][]>(board);
    const [draggedPiece, setDraggedPiece] = useState<PieceLetter | null>(null);
    const [fromPos, setFromPos] = useState<[number, number] | "pool" | null>(null);
    const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
    const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
    const [selectedPoolPiece, setSelectedPoolPiece] = useState<PieceLetter | null>(null);
    const [boardFlipped, setBoardFlipped] = useState(flipped);
    const boardRef = useRef<HTMLDivElement>(null);
    const { addMove, moveBack: moveBackHistory, clearHistory, history } = useHistory();
    useBoardHandlers({ref, history, setCurrentBoard, clearHistory, moveBackHistory, setSelectedPoolPiece, setBoardFlipped,});
    const displayedBoard = boardFlipped ? flipBoardView(currentBoard) : currentBoard;

    const toRealPos = (r: number, c: number): [number, number] =>
        boardFlipped ? [7 - r, 7 - c] : [r, c];


    const handlePointerDownBoard = (r: number, c: number, piece: PieceLetter) => (e: React.PointerEvent) => {
        e.preventDefault();
        setDraggedPiece(piece);
        setFromPos([r, c]);

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });

    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!draggedPiece || !boardRef.current || !dragOffset) return;

        const rect = boardRef.current.getBoundingClientRect();
        setDragPos({
            x: e.clientX - rect.left - dragOffset.x,
            y: e.clientY - rect.top - dragOffset.y,
        });
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!draggedPiece || !boardRef.current) return;

        const rect = boardRef.current.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;

        const outside =
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom;

        if (outside) {
            setDraggedPiece(null);
            setFromPos(null);
            setDragPos(null);
            setDragOffset(null);
            return;
        }

        let c = Math.floor((relX / rect.width) * 8);
        let r = Math.floor((relY / rect.height) * 8);

        r = Math.max(0, Math.min(7, r));
        c = Math.max(0, Math.min(7, c));

        const [realR, realC] = toRealPos(r, c);
        const piece = draggedPiece;
        const from = fromPos || "pool";

        let captured: PieceLetter | null = null;

        setCurrentBoard(prev => {
            const newBoard = prev.map(row => [...row]);
            // remove piece from old position if not pool
            if (fromPos && fromPos !== "pool") newBoard[fromPos[0]][fromPos[1]] = null;

            // store captured piece before placing new piece
            captured = newBoard[realR][realC] || null;

            // place piece
            newBoard[realR][realC] = piece;
            return newBoard;
        });

        // Only add move if position changed or captured something
        const isMoveValid = from === "pool" || from[0] !== realR || from[1] !== realC || captured;

        if (isMoveValid) {
            addMove({ pieceFrom: piece, from, to: [realR, realC], captured });
        }

        setDraggedPiece(null);
        setFromPos(null);
        setDragPos(null);
        setDragOffset(null);
    };

// ======================
// CLICK TO PLACE POOL PIECE
// ======================
    const handleClickSquare = (r: number, c: number) => {
        if (!selectedPoolPiece) return;
        if(currentBoard[r][c] === selectedPoolPiece)return;
        setCurrentBoard(prev => {
            const newBoard = prev.map(row => [...row]);
            newBoard[r][c] = selectedPoolPiece;
            return newBoard;
        });
        addMove({ pieceFrom: selectedPoolPiece, from: "pool" as const, to: [r, c]});
    };

    return (
        <div className="w-full h-full flex flex-row gap-4 bg-blue-100">
            <div className="flex flex-row items-center">
            <div
                ref={boardRef}
                className={`relative grid grid-cols-8 grid-rows-8 ${boardSize}`}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                style={{ touchAction: "none" }}
            >
                <BoardGrid
                    displayedBoard={displayedBoard}
                    draggedPiece={draggedPiece}
                    dragPos={dragPos}
                    fromPos={fromPos}
                    boardFlipped={boardFlipped}
                    toRealPos={toRealPos}
                    handleClickSquare={handleClickSquare}
                    handlePointerDownBoard={handlePointerDownBoard}
                />
            </div>

            <PiecePools selectedPoolPiece={selectedPoolPiece} onSelectPiece={setSelectedPoolPiece}/>
            </div>
        </div>
    );
});

export default Board;
