# React MIDI Editor

[![Code Climate maintainability](https://codeclimate.com/github/chanyatfu/react-midi-editor/badges/gpa.svg)](https://codeclimate.com/github/chanyatfu/react-midi-editor)

React MIDI Editor is a comprehensive component library for building a piano roll interface in React applications. It offers extensive functionalities, including:

- Note manipulation: creation, dragging, and deletion
- Multiple note selection
- Clipboard operations: copy, cut, and paste
- Undo and redo actions
- Zooming and scrolling capabilities

## Demo

![pianoroll](https://github.com/chanyatfu/react-piano-roll/assets/45863731/9500026e-d8c0-44e8-912f-6f35fce22082)

## Usage Examples

### Basic Usage

```tsx
import { PianoRoll } from "@midi-editor/react";

function App() {
  return (
    <>
      <PianoRoll />
    </>
  );
}

export default App;
```

### Advanced Usage with Multiple Instances

To manage multiple `PianoRoll` instances with separate states, utilize the `PianoRollProvider` component:

```tsx
import { PianoRoll, PianoRollProvider } from "@midi-editor/react";

function App() {
  return (
    <>
      <PianoRollProvider>
        <PianoRoll />
      </PianoRollProvider>
      <PianoRollProvider>
        <PianoRoll />
      </PianoRollProvider>
    <>
  )
}

export default App;
```

## Customizing the Theme

Customize the appearance by modifying the CSS variables in your stylesheet:

```css
body {
  --white: #d9d9db;
  --black: #232323;
  ...
  --playhead-color: #ff0000;
}
```

The full list of variables can be found in the [theme.module.css](https://github.com/chanyatfu/react-midi-editor/blob/main/packages/react-piano-roll/src/theme.module.css) file.

## Accessing the State

Interact with the `PianoRoll`'s state using the `usePianoRoll` hook:

```tsx
import { usePianoRoll } from "@midi-editor/react";

function App() {
  const { state, actions } = usePianoRoll();

  return (
    <>
      <PianoRoll />
      <button onClick={() => actions.undo()}>Undo</button>
      <button onClick={() => actions.redo()}>Redo</button>
    </>
  );
}
```

This README provides clear guidance on integrating and utilizing the React MIDI Editor library in your projects.
