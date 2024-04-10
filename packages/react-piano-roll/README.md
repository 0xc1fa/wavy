# react-piano-roll

## Bugs

- Range indicator overlap piano keyboard
- A small gap appear when the piano roll is scrolled all the way to the bottom
- The onclick animation of piano keyboard is not working
- the length is correct but staring bar is not correct if editor staring tick not 0
- No line between white key lane
- Note/selecton maquee does not follow overflow scroll (only follow when on move)
- Make pianoroll lane overflow not the whole editor
- Add mini map to show the whole piano roll and where you are now
- very small note should be able to adapt to both trimming and extending

## TO-DOs

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
- [ ] Add notes boundary as anchor points

## Roadmap

### 1.0.0

- Clipboard
- Velocity Editor
- Horizontally scalable

### 1.1.0

- Customizable theme

### 1.2.0

- Time signature customization
- Key range customization

### 1.3.0

- Loop area
