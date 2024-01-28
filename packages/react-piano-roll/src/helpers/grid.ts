import { minGridPixel } from "@/constants";
import { ceilToNearestPowerOfTwo, floorToNearestPowerOfTwo } from "./number";

export function getNumOfGrid(pixelPerBeat: number, laneLength: number) {
  const numberOfBarGrids = Math.ceil(laneLength / (pixelPerBeat * 4));
  const numberOfQuarterGrids = Math.ceil(laneLength / pixelPerBeat);
  const numberOfQuaversGrids = Math.ceil(laneLength / pixelPerBeat);
  return {
    bar: numberOfBarGrids,
    quarter: numberOfQuarterGrids,
    quavers: numberOfQuaversGrids
  };
}

export function getGridSeparationFactor(pixelPerBeat: number, pianoLaneScaleX: number) {
  const barGridSeparationFactor = ceilToNearestPowerOfTwo(minGridPixel / (pianoLaneScaleX * pixelPerBeat * 4));
  const quarterGridSeparationFactor = ceilToNearestPowerOfTwo(minGridPixel / (pianoLaneScaleX * pixelPerBeat));
  const quaversGridSeparationFactor = floorToNearestPowerOfTwo((pianoLaneScaleX * pixelPerBeat) / minGridPixel);
  return {
    bar: barGridSeparationFactor,
    quarter: quarterGridSeparationFactor,
    quavers: quaversGridSeparationFactor
  };
}

export function getGridBaseSeparation(gridSeparationFactor: ReturnType<typeof getGridSeparationFactor>) {
  return {
    bar: 4,
    quarter: 1,
    quavers: 1 / gridSeparationFactor.quavers,
  }
}
