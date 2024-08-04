import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Router, Routes, Route} from 'react-router-dom';
import App from './App';
import Login from './Login';
import Signup from './Signup';
import './index.css'
import Home from './Home';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home/*" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
);

