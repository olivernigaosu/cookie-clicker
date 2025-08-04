import React from 'react';
import { render, screen, act } from '@testing-library/react';
import ClickEffect from './ClickEffect';

jest.useFakeTimers();

test('renders ClickEffect and hides after 800ms', () => {
  const onDoneMock = jest.fn();

  render(<ClickEffect x={100} y={100} amount={50} onDone={onDoneMock} />);

  // Check if the text is initially rendered
  expect(screen.getByText('+50')).toBeInTheDocument();

  // Fast-forward time to trigger the hide
  act(() => {
    jest.advanceTimersByTime(800);
  });

  // Check if onDone was called
  expect(onDoneMock).toHaveBeenCalled();
});
