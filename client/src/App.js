import React from 'react'
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Home from "./pages/Home"

import {StateContextProvider} from './contexts/Context'

import Gamepage from "./pages/Gamepage"

function App() {

  

  return (
    <StateContextProvider >
    <Router>
      <Routes>
        <Route exact path='/' element={<Home/>} />
        <Route exact path='/game' element={<Gamepage/>}/>
      </Routes>
    </Router>
    </StateContextProvider >
  );
}

export default App;
