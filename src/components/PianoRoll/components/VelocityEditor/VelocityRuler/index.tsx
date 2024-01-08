

type VelocityRulerProps = React.HTMLAttributes<SVGSVGElement> & {
  height: number
}
export default function VelocityRuler({ height }: VelocityRulerProps) {
  const markers = [1, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 120, 127]
  const markerHeight = markers.map(marker => height * (marker / 127))

  return (
    <svg width="100%" height="100%" viewBox={`0 0 50 ${height}`} style={{ zIndex: 10 }} preserveAspectRatio="none">
      {markers.map((marker, index) => {
        const markerHeight = height - (height * (marker / 127))
        return (
          <g key={index}>
            <line y1={markerHeight} y2={markerHeight} x1={40} x2={50} strokeWidth={1} stroke="white" />
            <text x={10} y={markerHeight} textAnchor="middle" fill="white" fontSize="10px">{marker}</text>
          </g>
        )
      })}
    </svg>
  )
}