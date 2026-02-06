import { isBlack, isWhite, inBounds } from "./constant";

// Types
export type PieceLetter = string; // e.g., "P", "p", "N", etc.
export type Square = [number, number] | [number, number, { enPassant: true; remove: [number, number] }?];

type Board = (PieceLetter | null)[];

interface LastMove {
    piece?: PieceLetter;
    fromPos?: [number, number];
    toPos?: [number, number];
}

// 🧠 Cache for last move
const cache = new Map<string, LastMove>();

export function setLastMove(move: LastMove) {
    cache.set("lastMove", move);
}

export function getLastMove(): LastMove | null {
    return cache.get("lastMove") || null;
}

/**
 * Return all pseudo-legal moves for a piece, ignoring check.
 */
export function pseudoMovesForPiece(
    board: Board[],
    r: number,
    c: number,
    p: PieceLetter
): Square[] {
    const moves: Square[] = [];
    const colorIsWhite = isWhite(p);
    const sign = colorIsWhite ? -1 : 1;
    const lastMove = getLastMove();

    const addIfValid = (nr: number, nc: number) => {
        if (!inBounds(nr, nc)) return;
        const target = board[nr][nc];
        if (!target || (colorIsWhite ? isBlack(target) : isWhite(target))) {
            moves.push([nr, nc]);
        }
    };

    switch (p.toUpperCase()) {
        case "P": {
            const startRow = colorIsWhite ? 6 : 1;
            const fwd1: [number, number] = [r + sign, c];
            const fwd2: [number, number] = [r + 2 * sign, c];

            // Forward 1
            if (inBounds(...fwd1) && !board[fwd1[0]][fwd1[1]]) moves.push(fwd1);

            // Forward 2 from start row
            if (
                r === startRow &&
                !board[fwd1[0]][fwd1[1]] &&
                inBounds(...fwd2) &&
                !board[fwd2[0]][fwd2[1]]
            ) {
                moves.push(fwd2);
            }

            // Diagonal captures
            const caps: [number, number][] = [
                [r + sign, c - 1],
                [r + sign, c + 1],
            ];
            for (const [nr, nc] of caps) {
                if (!inBounds(nr, nc)) continue;
                const t = board[nr][nc];
                if (t && (colorIsWhite ? isBlack(t) : isWhite(t))) moves.push([nr, nc]);
            }

            // En passant
            if (
                lastMove &&
                lastMove.piece?.toLowerCase() === "p" &&
                Array.isArray(lastMove.fromPos) &&
                Array.isArray(lastMove.toPos)
            ) {
                const [fr, fc] = lastMove.fromPos;
                const [tr, tc] = lastMove.toPos;

                if (Math.abs(fr - tr) === 2) {
                    // White en passant
                    if (colorIsWhite && r === 3 && tr === 3 && Math.abs(tc - c) === 1) {
                        moves.push([r - 1, tc, { enPassant: true, remove: [r, tc] }]);
                    }
                    // Black en passant
                    if (!colorIsWhite && r === 4 && tr === 4 && Math.abs(tc - c) === 1) {
                        moves.push([r + 1, tc, { enPassant: true, remove: [r, tc] }]);
                    }
                }
            }
            break;
        }

        case "N": {
            const deltas: [number, number][] = [
                [-2, -1], [-2, 1], [2, -1], [2, 1],
                [-1, -2], [-1, 2], [1, -2], [1, 2],
            ];
            for (const [dr, dc] of deltas) addIfValid(r + dr, c + dc);
            break;
        }

        case "B": {
            const dirs: [number, number][] = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
            for (const [dr, dc] of dirs) {
                let nr = r + dr, nc = c + dc;
                while (inBounds(nr, nc)) {
                    const t = board[nr][nc];
                    if (!t) moves.push([nr, nc]);
                    else {
                        if (colorIsWhite ? isBlack(t) : isWhite(t)) moves.push([nr, nc]);
                        break;
                    }
                    nr += dr; nc += dc;
                }
            }
            break;
        }

        case "R": {
            const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            for (const [dr, dc] of dirs) {
                let nr = r + dr, nc = c + dc;
                while (inBounds(nr, nc)) {
                    const t = board[nr][nc];
                    if (!t) moves.push([nr, nc]);
                    else {
                        if (colorIsWhite ? isBlack(t) : isWhite(t)) moves.push([nr, nc]);
                        break;
                    }
                    nr += dr; nc += dc;
                }
            }
            break;
        }

        case "Q": {
            // Combine rook + bishop moves
            moves.push(...pseudoMovesForPiece(board, r, c, colorIsWhite ? "R" : "r"));
            moves.push(...pseudoMovesForPiece(board, r, c, colorIsWhite ? "B" : "b"));
            break;
        }

        case "K": {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    addIfValid(r + dr, c + dc);
                }
            }
            break;
        }

        default:
            break;
    }

    return moves;
}
