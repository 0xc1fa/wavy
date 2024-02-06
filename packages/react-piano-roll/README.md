# react-piano-roll

## TODOs

- [x] auto scaling of grid and ruler
  - all other action react to grid
- [x] lock in after passing snap to one grid (left or right)
  - before lock in can move in detail
  - after lock in one can move in anchor point
  - if note is in grid line, only grid line are anchor points, else, both grid line and (note original points + grid width) are anchor points
- [ ] selection bar
- [x] Select notes when dragging not after dragging
- [ ] Change the staring and ending point of the midi editor
- [ ] Add loop area
- [ ] Add selected mode for velocity editor
- [ ] turn PianoRoll flex layout to grid layout
- [ ] fix range selection
- [ ] Refactor out constants
- [ ] Add notes boundary as anchor points
- [ ] New note size reactive to grid size

## Existing Problems and

- Cannot delete lyric (as it would also delete the note)
- Refactored PianoRollStore
- The scrollable area does not resize upon scaling

## Performance Refactor

### Lane Container

#### LaneGrids

- The span of the pianoroll
- ScaleX

#### Selection

- piano roll note (currently, maybe delete it later)
- selection tick
- scaleX
-

#### Note

- piano roll note
- scaleX (in the use of function call)

#### Selection Area

-
