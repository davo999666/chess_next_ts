type Circle = {
    r: number;
    c: number;
    color: string;
};

interface RightClickCirclesProps {
    circles: Circle[];
    boardFlipped?: boolean; // new
}

export default function RightClickCircles({ circles, boardFlipped = false }: RightClickCirclesProps) {
    const squarePercent = 100 / 8;
    const radiusPct = 5.5;
    const strokePct = 0.6;

    const toPercent = (r: number, c: number) => {
        if (boardFlipped) {
            r = 7 - r;
            c = 7 - c;
        }
        return {
            x: (c + 0.5) * squarePercent,
            y: (r + 0.5) * squarePercent,
        };
    };

    return (
        <>
            {circles.map((circle, i) => {
                const pos = toPercent(circle.r, circle.c);
                return (
                    <svg
                        key={i}
                        data-testid={`right-click-circle-${circle.r}-${circle.c}`}
                        className="absolute top-0 left-0 pointer-events-none"
                        style={{ width: "100%", height: "100%", zIndex: 60 }}
                    >
                        <circle
                            cx={`${pos.x}%`}
                            cy={`${pos.y}%`}
                            r={`${radiusPct}%`}
                            stroke={circle.color}
                            strokeWidth={`${strokePct}%`}
                            fill="none"
                            opacity={0.9}
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                );
            })}
        </>
    );
}
