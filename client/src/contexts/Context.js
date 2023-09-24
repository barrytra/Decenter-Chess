import React, { useContext, createContext, useEffect, useState } from 'react';
import { reducer } from '../reducer/reducer'
import { useReducer } from 'react'
import { initGameState } from '../constants';
import { ethers } from 'ethers';
import ContractABI from "../abi/chessgameABI.json"

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    

    const [appState, dispatch] = useReducer(reducer, initGameState);

    const providerState = {
        appState,
        dispatch
    }


    return (
        <StateContext.Provider
            value={ providerState}
        >
            {children}
        </StateContext.Provider>
    )
}


export const useAppContext = () => useContext(StateContext);