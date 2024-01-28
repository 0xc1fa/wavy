import styles from "./index.module.scss";

type VelocityRulerProps = React.HTMLAttributes<SVGSVGElement> & {
  height: number;
};
export default function VelocityRuler({ height }: VelocityRulerProps) {
  const markers = [
    1, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 120, 127,
  ];
  const closestPowerOf2 = (n: number) => {
    return Math.pow(2, Math.round(Math.log(n) / Math.log(2)));
  };
  const dividor = closestPowerOf2(Math.round(400 / height));

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 50 ${height}`}
      className={styles["container"]}
    >
      {markers.map((marker, index) => {
        if (index % dividor !== 0) {
          return <></>;
        }
        const markerHeight = height - height * (marker / 127);
        return (
          <g className={styles["marker"]} key={index}>
            <line
              y1={markerHeight}
              y2={markerHeight}
              x1={index % (2 * dividor) === 0 ? 42 : 46}
              x2={50}
            />
            <text x={35} y={markerHeight}>
              {marker}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
