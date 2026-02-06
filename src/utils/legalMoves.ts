// utils/legalMoves.ts
import { isBlack, isWhite, inBounds } from "./constant";
import type { PieceLetter, Square } from "./pseudoMovesForPiece";

// Return pseudo-legal moves for a piece (ignoring turns and checks)
export function getLegalMovesForPiece(
    piece: PieceLetter,
    from: [number, number],
    board: (PieceLetter | null)[][]
): Square[] {
    const [r, c] = from;
    const moves: Square[] = [];
    const colorIsWhite = isWhite(piece);
    const sign = colorIsWhite ? -1 : 1;

    const addIfValid = (nr: number, nc: number) => {
        if (!inBounds(nr, nc)) return;
        const target = board[nr][nc];
        if (!target || (colorIsWhite ? isBlack(target) : isWhite(target))) {
            moves.push([nr, nc]);
        }
    };

    switch (piece.toUpperCase()) {
        case "P": {
            const startRow = colorIsWhite ? 6 : 1;
            const fwd1: [number, number] = [r + sign, c];
            const fwd2: [number, number] = [r + 2 * sign, c];

            if (inBounds(...fwd1) && !board[fwd1[0]][fwd1[1]]) moves.push(fwd1);
            if (r === startRow && !board[fwd1[0]][fwd1[1]] && inBounds(...fwd2) && !board[fwd2[0]][fwd2[1]])
                moves.push(fwd2);

            for (const [nr, nc] of [[r + sign, c - 1], [r + sign, c + 1]]) {
                if (!inBounds(nr, nc)) continue;
                const t = board[nr][nc];
                if (t && (colorIsWhite ? isBlack(t) : isWhite(t))) moves.push([nr, nc]);
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
            const dirs: [number, number][] = [[-1,-1],[-1,1],[1,-1],[1,1]];
            for (const [dr, dc] of dirs) {
                let nr = r + dr, nc = c + dc;
                while (inBounds(nr,nc)) {
                    const t = board[nr][nc];
                    if (!t) moves.push([nr,nc]);
                    else {
                        if (colorIsWhite ? isBlack(t) : isWhite(t)) moves.push([nr,nc]);
                        break;
                    }
                    nr += dr; nc += dc;
                }
            }
            break;
        }

        case "R": {
            const dirs: [number, number][] = [[-1,0],[1,0],[0,-1],[0,1]];
            for (const [dr, dc] of dirs) {
                let nr = r + dr, nc = c + dc;
                while (inBounds(nr,nc)) {
                    const t = board[nr][nc];
                    if (!t) moves.push([nr,nc]);
                    else {
                        if (colorIsWhite ? isBlack(t) : isWhite(t)) moves.push([nr,nc]);
                        break;
                    }
                    nr += dr; nc += dc;
                }
            }
            break;
        }

        case "Q": {
            moves.push(...getLegalMovesForPiece(colorIsWhite ? "R" : "r", [r,c], board));
            moves.push(...getLegalMovesForPiece(colorIsWhite ? "B" : "b", [r,c], board));
            break;
        }

        case "K": {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr===0 && dc===0) continue;
                    addIfValid(r + dr, c + dc);
                }
            }
            break;
        }
    }

    return moves;
}
