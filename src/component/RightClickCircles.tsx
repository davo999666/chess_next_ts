type Circle = {
    r: number;
    c: number;
    color: string;
};

interface RightClickCirclesProps {
    circles: Circle[];
}

export default function RightClickCircles({ circles }: RightClickCirclesProps) {
    const squarePercent = 100 / 8;
    const radiusPct = 5.5;
    const strokePct = 0.6;

    return (
        <>
            {circles.map((circle, i) => {
                const x = (circle.c + 0.5) * squarePercent;
                const y = (circle.r + 0.5) * squarePercent;

                return (
                    <svg
                        key={i}
                        className="absolute top-0 left-0 pointer-events-none"
                        style={{ width: "100%", height: "100%", zIndex: 60 }}
                    >
                        <circle
                            cx={`${x}%`}
                            cy={`${y}%`}
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
