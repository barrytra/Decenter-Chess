import React from 'react'
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Home from "./pages/Home"
import { reducer } from './reducer/reducer'
import { useReducer } from 'react'
import { initGameState } from './constants';
import AppContext from './contexts/Context'

import Gamepage from "./pages/Gamepage"

function App() {

  const [appState, dispatch] = useReducer(reducer, initGameState);

  const providerState = {
    appState,
    dispatch
  }

  return (
    <AppContext.Provider value={providerState} >
    <Router>
      <Routes>
        <Route exact path='/' element={<Home/>} />
        <Route exact path='/game' element={<Gamepage/>}/>
      </Routes>
    </Router>
    </AppContext.Provider >
  );
}

export default App;
