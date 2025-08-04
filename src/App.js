import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import NavBar from './components/NavBar';
import CookieRain from './components/CookieRain';


function App() {
  return (
    <>
      <CookieRain />
      <BrowserRouter>
        <NavBar />
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
