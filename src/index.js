import React from 'react';
import ReactDOM from 'react-dom/client'; // Исправленный импорт
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <App />
  </Router>
);
