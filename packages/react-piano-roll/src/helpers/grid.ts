import { basePixelsPerBeat, minGridPixel, ticksPerBeat } from "@/constants";
import { ceilToNearestPowerOfTwo, floorToNearestPowerOfTwo } from "./number";

export function getNumOfGrid(pixelPerBeat: number, laneLength: number) {
  const numberOfBarGrids = Math.ceil(laneLength / (pixelPerBeat * 4));
  const numberOfHalfBarGrids = Math.ceil(laneLength / (pixelPerBeat * 2));
  const numberOfQuarterGrids = Math.ceil(laneLength / pixelPerBeat);
  const numberOfQuaversGrids = Math.ceil(laneLength / pixelPerBeat);
  return {
    bar: numberOfBarGrids,
    halfBar: numberOfHalfBarGrids,
    quarter: numberOfQuarterGrids,
    quavers: numberOfQuaversGrids,
  };
}

export function getGridSeparationFactor(pixelPerBeat: number, pianoLaneScaleX: number) {
  const barGridSeparationFactor = ceilToNearestPowerOfTwo(minGridPixel / (pianoLaneScaleX * pixelPerBeat * 4));
  const halfBarGridSeparationFactor = ceilToNearestPowerOfTwo(minGridPixel / (pianoLaneScaleX * pixelPerBeat * 2));
  const quarterGridSeparationFactor = ceilToNearestPowerOfTwo(minGridPixel / (pianoLaneScaleX * pixelPerBeat));
  const quaversGridSeparationFactor = floorToNearestPowerOfTwo((pianoLaneScaleX * pixelPerBeat) / minGridPixel);
  return {
    bar: barGridSeparationFactor,
    halfBar: halfBarGridSeparationFactor,
    quarter: quarterGridSeparationFactor,
    quavers: quaversGridSeparationFactor,
  };
}

export function getGridBaseSeparation(gridSeparationFactor: ReturnType<typeof getGridSeparationFactor>) {
  return {
    bar: 4,
    halfBar: 2,
    quarter: 1,
    quavers: 1 / gridSeparationFactor.quavers,
  };
}

export function getTickInGrid(pianoLaneScaleX: number) {
  let pixelsPerBeat = basePixelsPerBeat * pianoLaneScaleX;
  let ticksInGrid = ticksPerBeat;
  if (pixelsPerBeat < minGridPixel) {
    while (pixelsPerBeat < minGridPixel) {
      pixelsPerBeat *= 2;
      ticksInGrid *= 2;
    }
  } else if (pixelsPerBeat / 2 >= minGridPixel) {
    while (pixelsPerBeat / 2 >= minGridPixel) {
      pixelsPerBeat /= 2;
      ticksInGrid /= 2;
    }
  }
  return ticksInGrid
}

export function getNearestGridTick(ticks: number, pianoLaneScaleX: number) {
  const ticksInGrid = getTickInGrid(pianoLaneScaleX);
  const upperGridTick = Math.ceil(ticks / ticksInGrid) * ticksInGrid;
  const lowerGridTick = Math.floor(ticks / ticksInGrid) * ticksInGrid;
  const upperGridTickDiff = upperGridTick - ticks;
  const lowerGridTickDiff = ticks - lowerGridTick;

  return upperGridTickDiff < lowerGridTickDiff ? upperGridTick : lowerGridTick;
}

export function getNearestGridTickWithOffset(ticks: number, pianoLaneScaleX: number, offset: number) {
  const ticksInGrid = getTickInGrid(pianoLaneScaleX);
  let upperGridTick;
  let lowerGridTick;
  const gridTickAnchor = Math.floor(ticks / ticksInGrid) * ticksInGrid + offset;
  if (ticks < gridTickAnchor) {
    upperGridTick = gridTickAnchor;
    lowerGridTick = gridTickAnchor - ticksInGrid;
  } else {
    upperGridTick = gridTickAnchor + ticksInGrid;
    lowerGridTick = gridTickAnchor;
  }
  const upperGridTickDiff = upperGridTick - ticks;
  const lowerGridTickDiff = ticks - lowerGridTick;

  return upperGridTickDiff < lowerGridTickDiff ? upperGridTick : lowerGridTick;
}

export function getNearestAnchor(ticks: number, pianoLaneScaleX: number, offset: number) {
  const ticksInGrid = getTickInGrid(pianoLaneScaleX);
  const nearestGridTick = getNearestGridTick(ticks, pianoLaneScaleX);
  const nearestGridTickWithOffset = getNearestGridTickWithOffset(ticks, pianoLaneScaleX, offset);
  const nearestGridTickDiff = Math.abs(nearestGridTick - ticks);
  const nearestGridTickWithOffsetDiff = Math.abs(nearestGridTickWithOffset - ticks);
  const anchor = nearestGridTickDiff < nearestGridTickWithOffsetDiff ? nearestGridTick : nearestGridTickWithOffset;

  return {
    anchor: anchor,
    proximity: Math.abs(anchor - ticks) / ticksInGrid < 0.4 ? true : false,
  }
}

export function getGridOffsetOfTick(ticks: number, pianoLaneScaleX: number) {
  const ticksInGrid = getTickInGrid(pianoLaneScaleX);
  const offset = ticks - Math.floor(ticks / ticksInGrid) * ticksInGrid;
  return offset;
}

