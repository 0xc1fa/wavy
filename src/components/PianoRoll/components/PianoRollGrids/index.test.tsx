import { render, screen } from '@testing-library/react';
// import { screen, configure } from '@testing-library/react'

import PianoRollGrids from './old-index'

jest.mock('../../hooks/useTheme', () => () => ({
  grid: {
    primaryGridColor: 'blue',
    secondaryGridColor: 'lightblue'
  }
}));

jest.mock('../../hooks/usePianoRollTransform', () => () => ({
  laneLength: 100,
  canvasHeight: 200,
  pixelPerBeat: 50,
  pianoLaneScaleX: 1
}));

describe('PianoRollGrids', () => {
  test('renders correctly', () => {
    render(<PianoRollGrids />);
    const gridsElement = screen.getByLabelText('pianoroll-grids');
    // gridsElement.
    // expect(gridsElement).toBeInTheDocument();
    // expect(gridsElement).toHaveClass('grid');
    // expect(gridsElement).toHaveStyle('--lane-length: 100px');
  });
});
