import React from 'react'
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Home from "./pages/Home"
import { useReducer } from 'react'
import { initGameState } from './constants';

import Gamepage from "./pages/Gamepage"

function App() {



  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Gamepage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
