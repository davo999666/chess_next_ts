import React from "react";

interface Square  {
    r: number;
    c: number;
}

type MoveArrowsProps = {
    from: Square | null;
    legalMoves: [number, number][];
    flipped: boolean;
    isDrawing: boolean;
};

const MoveArrows: React.FC<MoveArrowsProps> = ({
                                                   from,
                                                   legalMoves,
                                                   flipped,
                                                   isDrawing,
                                               }) => {
    if (!from || !legalMoves?.length) return null;

    const squarePercent = 100 / 8; // 12.5%

    const toPercent = (r: number, c: number) => {
        if (flipped) {
            r = 7 - r;
            c = 7 - c;
        }
        return {
            x: (c + 0.5) * squarePercent,
            y: (r + 0.5) * squarePercent,
        };
    };

    const start = toPercent(from.r, from.c);
    const last = toPercent(
        legalMoves[legalMoves.length - 1][0],
        legalMoves[legalMoves.length - 1][1]
    );

    // Direction + distance (in % coords)
    const dx = last.x - start.x;
    const dy = last.y - start.y;
    const distance = Math.hypot(dx, dy);

    // ---- Tunables ----
    const circleRadiusPct = 5.5;
    const strokePct = 0.6;
    const startMarginPct = 0.2;
    const minMovePct = 0.3;
    // -------------------

    const shouldDrawLine = distance > minMovePct;

    const unitX = shouldDrawLine ? dx / distance : 0;
    const unitY = shouldDrawLine ? dy / distance : 0;

    const offset = circleRadiusPct + strokePct * 0.5 + startMarginPct;

    const startOffset = {
        x: start.x + unitX * offset,
        y: start.y + unitY * offset,
    };

    return (
        <svg
            className="absolute top-0 left-0 pointer-events-none"
            style={{ width: "100%", height: "100%", zIndex: 50 }}
        >
            <defs>
                <marker
                    id="arrowhead-green"
                    markerWidth="4"
                    markerHeight="4"
                    refX="2.8"
                    refY="2"
                    orient="auto"
                    markerUnits="strokeWidth"
                >
                    <path d="M0,0 L0,4 L4,2 z" fill="#00aa00" />
                </marker>
            </defs>

            {isDrawing && (
                <circle
                    cx={`${start.x}%`}
                    cy={`${start.y}%`}
                    r={`${circleRadiusPct}%`}
                    stroke="#00aa00"
                    strokeWidth={`${strokePct}%`}
                    fill="none"
                    opacity={0.9}
                    vectorEffect="non-scaling-stroke"
                />
            )}

            {shouldDrawLine && (
                <line
                    x1={`${startOffset.x}%`}
                    y1={`${startOffset.y}%`}
                    x2={`${last.x}%`}
                    y2={`${last.y}%`}
                    stroke="#00aa00"
                    strokeWidth="2%"
                    strokeLinecap="round"
                    markerEnd="url(#arrowhead-green)"
                    opacity={0.9}
                    vectorEffect="non-scaling-stroke"
                />
            )}
        </svg>
    );
};

export default MoveArrows;
