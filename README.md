# ReactPianoRoll

This is a component library for pianoroll in React. Functionalities included:

- Note creation, dragging and deletion
- Multiple notes selection
- Copying, cutting, pasting
- Undo, redo
- Zooming
- Scrolling

## Demo

![pianoroll](https://github.com/chanyatfu/react-piano-roll/assets/45863731/9500026e-d8c0-44e8-912f-6f35fce22082)

## Examples

`import Pianoroll, { PianorollProvider } from 'react-piano-roll';`

Wrap your component with `<PianorollProvider />` and then use `<Pianoroll />` inside it.

Inside main.js:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { PianoRollProvider } from "react-piano-roll";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PianorollProvider>
      <App />
    </PianorollProvider>
  </React.StrictMode>
  ,
)
```

Inside App.tsx:

```tsx
import { PianoRoll } from "react-piano-roll";

function App() {
  return (
    <>
      <PianoRoll />
    <>
  )
}

export default App
```

Multiple hooks are provided to access the state of the pianoroll. A breif description of each hook is provided below. For more details, please refer to the source code.

a
