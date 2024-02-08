# react-piano-roll

## Bugs

- Selection marquee that drag outside the piano roll will make the piano roll extend and scroll
- A small gap appear when the piano roll is scrolled all the way to the bottom
- The color of selection marquee is too ugly
- The onclick animation of piano keyboard is not working
- No line between white key lane
- Range indicator overlap piano keyboard
- Note/selecton maquee does not follow overflow scroll (only follow when on move)
- 0 length note should extend first instead of trimming
- Make pianoroll lane overflow not the whole editor
- Sometime dragging marker in velocity editor will make other marker shift to the top
- check if the length is correct if editor staring tick not 0
- Velocity editor
  - Clicking on velocity editor should changed the selected note
  - Velocity editor should modified all selected note together
  - Or just dont show selection on velocity editor
  - But then need to lose selected when change note
  - Velocity editor should only change the current note in drag mode even if it have move to the range of another note


## TODOs

- [x] auto scaling of grid and ruler
  - all other action react to grid
- [x] lock in after passing snap to one grid (left or right)
  - before lock in can move in detail
  - after lock in one can move in anchor point
  - if note is in grid line, only grid line are anchor points, else, both grid line and (note original points + grid width) are anchor points
- [x] selection bar
- [x] Select notes when dragging not after dragging
- [ ] Add selected mode for velocity editor
- [ ] turn PianoRoll flex layout to grid layout
- [ ] fix range selection
- [ ] Refactor out constants
- [ ] Add notes boundary as anchor points
- [ ] New note size reactive to grid size

## Roadmap

### 1.0.0

- Clipboard
- Velocity Editor
- Horizontally scalable

### 1.1.0
- Time signature customization
- Key range customization

### 1.2.0
- Loop area