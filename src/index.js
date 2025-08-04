import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './utils/supabaseClient';
import { CookieProvider } from './context/CookieContext';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SessionContextProvider supabaseClient={supabase}>
    <CookieProvider supabaseClient={supabase}>
      <App />
    </CookieProvider>
  </SessionContextProvider>
);
