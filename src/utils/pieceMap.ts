// src/utils/pieceMap.ts

// Allowed letters: chess pieces (upper/lower) + fun items
export type PieceLetter =
    | "K" | "Q" | "R" | "B" | "N" | "P"
    | "k" | "q" | "r" | "b" | "n" | "p"
    | "apple" | "banana" | "strawberry" | "icecream";

// Mapping chess piece letters and items to images / emoji
export const pieceMap: Record<PieceLetter, string> = {
    // Chess pieces
    K: "https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg",
    k: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg",
    Q: "https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg",
    q: "https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg",
    R: "https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg",
    r: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg",
    B: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg",
    b: "https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg",
    N: "https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg",
    n: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg",
    P: "https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg",
    p: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg",

    // Fun item icons
    apple:   "https://cdn-icons-png.flaticon.com/128/415/415733.png",
    banana:  "https://cdn-icons-png.flaticon.com/128/2770/2770022.png",
    strawberry: "https://cdn-icons-png.flaticon.com/128/590/590685.png",
    icecream:  "https://cdn-icons-png.flaticon.com/128/3112/3112763.png",
};






