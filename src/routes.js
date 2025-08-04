import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Stats from './pages/Stats';
import Options from './pages/Options';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/stats" element={<Stats />} />
      <Route path="/options" element={<Options />} />
    </Routes>
  );
}
