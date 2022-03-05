import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Company from './Company';
import Employee from './Employee';
import Home from './Home';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/company/:id" element={<Company />} />
        <Route path="/employee/:id" element={<Employee />} />
      </Routes>
    </BrowserRouter>
  )
}