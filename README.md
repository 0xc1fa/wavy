# 🌊 Wavy

Wavy lets you create music directly in your browser, inspired by the visual representation of notes as ocean waves.

## 🎥 Demo

![demo-video](https://github.com/chanyatfu/wavy/assets/45863731/0270569c-99af-49a0-9be3-629cd99e0043)


## ⌨️ Functionalities
Wavy offers extensive functionalities, including:

- Note manipulation: creation, dragging, and deletion
- Multiple note selection
- Clipboard operations: copy, cut, and paste
- Undo and redo actions
- Zooming and scrolling capabilities


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
