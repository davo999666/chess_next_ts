export const isWhite = (p: string | null | undefined): boolean =>
    !!p && p === p.toUpperCase();

export const isBlack = (p: string | null | undefined): boolean =>
    !!p && p === p.toLowerCase();

export const inBounds = (r: number, c: number): boolean =>
    r >= 0 && r < 8 && c >= 0 && c < 8;
