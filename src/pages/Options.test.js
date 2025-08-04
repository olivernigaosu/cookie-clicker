import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Options from './Options';
import { CookieProvider, CookieContext } from '../context/CookieContext';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '../utils/supabaseClient';

jest.mock('@supabase/auth-helpers-react', () => ({
  useUser: jest.fn(),
}));

jest.mock('../utils/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

let mockContext;

beforeAll(() => {
  // Mock URL.createObjectURL to prevent JSDOM error
  global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/fake-url');
});

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  jest.clearAllMocks();

  mockContext = {
    cookies: 10,
    allTimeCookies: 20,
    clickPower: 2,
    autoClickRate: 3,
    productionMultiplier: 1.5,
    shopItems: { click: { count: 1, cost: 100 }, multiplier: { count: 1, cost: 100 } },
    setCookies: jest.fn(),
    setAllTimeCookies: jest.fn(),
    setClickPower: jest.fn(),
    setAutoClickRate: jest.fn(),
    setProductionMultiplier: jest.fn(),
    setShopItems: jest.fn(),
    saveToSupabase: jest.fn(() => Promise.resolve({ success: true })),
    loadFromSupabase: jest.fn(() => Promise.resolve({ success: true })),
    clearSave: jest.fn(),
  };

  useUser.mockReturnValue(null);

  render(
    <CookieContext.Provider value={mockContext}>
      <Options />
    </CookieContext.Provider>
  );
});

test('signs in successfully', async () => {
  supabase.auth.signInWithPassword.mockResolvedValue({ error: null });

  fireEvent.change(screen.getByPlaceholderText(/email/i), {
    target: { value: 'test@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText(/password/i), {
    target: { value: 'password' },
  });
  fireEvent.click(screen.getByText(/sign in/i));

  await waitFor(() =>
    expect(screen.getByText(/signed in/i)).toBeInTheDocument()
  );
});

test('sign in failure shows error message', async () => {
  supabase.auth.signInWithPassword.mockResolvedValue({ error: { message: 'Invalid' } });

  fireEvent.change(screen.getByPlaceholderText(/email/i), {
    target: { value: 'bad@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText(/password/i), {
    target: { value: 'wrong' },
  });
  fireEvent.click(screen.getByText(/sign in/i));

  await waitFor(() =>
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
  );
});

test('sign up handles account exists error', async () => {
  supabase.auth.signUp.mockResolvedValue({
    error: { message: 'User already registered' },
  });

  fireEvent.click(screen.getByText(/sign up/i));

  await waitFor(() =>
    expect(screen.getByText(/account already exists/i)).toBeInTheDocument()
  );
});

test('signs out and clears save', async () => {
  useUser.mockReturnValue({ email: 'user@example.com' });
  supabase.auth.signOut.mockResolvedValue({ error: null });

  render(
    <CookieContext.Provider value={mockContext}>
      <Options />
    </CookieContext.Provider>
  );

  fireEvent.click(screen.getByText(/sign out/i));

  await waitFor(() =>
    expect(screen.getByText(/signed out/i)).toBeInTheDocument()
  );
  expect(mockContext.clearSave).toHaveBeenCalled();
});

test('saves to Supabase', async () => {
  fireEvent.click(screen.getByText(/save to supabase/i));

  await waitFor(() =>
    expect(screen.getByText(/game saved successfully/i)).toBeInTheDocument()
  );
  expect(mockContext.saveToSupabase).toHaveBeenCalled();
});

test('loads from Supabase', async () => {
  fireEvent.click(screen.getByText(/load from supabase/i));

  await waitFor(() =>
    expect(screen.getByText(/game loaded successfully/i)).toBeInTheDocument()
  );
  expect(mockContext.loadFromSupabase).toHaveBeenCalled();
});

test('exports save data to file', async () => {
  const link = document.createElement('a');
  jest.spyOn(link, 'click').mockImplementation(() => {});
  const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(link);

  fireEvent.click(screen.getByText(/export save to file/i));

  await screen.findByText(/export successful/i);
  expect(link.click).toHaveBeenCalled();

  // Clean up to avoid affecting other tests
  createElementSpy.mockRestore();
});



test('clears save after confirmation', async () => {
  fireEvent.click(screen.getByText(/clear save/i));

  await waitFor(() =>
    expect(screen.getByText(/confirm clear/i)).toBeInTheDocument()
  );

  fireEvent.click(screen.getByText(/confirm clear/i));

  await waitFor(() =>
    expect(screen.getByText(/save cleared/i)).toBeInTheDocument()
  );
  expect(mockContext.clearSave).toHaveBeenCalled();
});
