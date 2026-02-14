// utils/boardUtils.ts

// Type for a single piece or empty square
import { PieceLetter} from "@/utils/pieceMap";

// Type for the board: 8x8 array
export type Board = (PieceLetter | null)[][];

export const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
export const numbers = ["8", "7", "6", "5", "4", "3", "2", "1"];

// Initial chessboard with pieces
export const initialBoard: Board = [
    ["r","n","b","q","k","b","n","r"],
    ["p","p","p","p","p","p","p","p"],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    ["P","P","P","P","P","P","P","P"],
    ["R","N","B","Q","K","B","N","R"],
];

// Empty board
export const initialEmptyBoard: Board = Array(8).fill(null).map(() => Array(8).fill(null));



// Flip board view horizontally and vertically
export const flipBoardView = (board: Board): Board => {
    return board
        .map(row => [...row])   // copy each row
        .reverse()              // flip vertically
        .map(row => row.reverse()); // flip horizontally
};

// Map coordinates based on flipped board
export function mapCoords(
    r: number,
    c: number,
    boardSize: number,
    flipped: boolean
): { r: number; c: number } {
    if (!flipped) return { r, c };
    return {
        r: boardSize - 1 - r,
        c: boardSize - 1 - c
    };
}
