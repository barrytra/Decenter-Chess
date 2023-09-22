import React, { useContext, createContext, useEffect, useState } from 'react';
import { reducer } from '../reducer/reducer'
import { useReducer } from 'react'
import { initGameState } from '../constants';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const [account, setAccount] = useState('')


    const connect = async () => {
        if (typeof window.ethereum !== "undefined") {
            const { ethereum } = window;
            try {
                await ethereum.request({ method: "eth_requestAccounts" })
            } catch (error) {
                console.log(error)
            }

            const accounts = await ethereum.request({ method: "eth_accounts" })
            console.log(accounts)
            window.location.reload(false);
        } else {
            alert("Please install MetaMask");
        }
    }

    const Address = async () => {
        const { ethereum } = window;
        if (!ethereum) {
            console.log("Make sure you have metamask!");
            return;
        } else {
            console.log("We have the ethereum object", ethereum);
        }
        const accounts = await ethereum.request({ method: "eth_accounts" });
        const chain = await window.ethereum.request({ method: "eth_chainId" });
        let chainId = chain;
        console.log("chain ID:", chain);
        console.log("global Chain Id:", chainId);
        if (accounts.length !== 0) {
            setAccount(accounts[0]);
            console.log("Found an authorized account:", accounts);

        } else {
            console.log("No authorized account found");
        }
    }

    useEffect(() => {
        Address();
        console.log(account);
    }, [])

    const [appState, dispatch] = useReducer(reducer, initGameState);

    const providerState = {
        appState,
        dispatch
    }


    return (
        <StateContext.Provider
            value={{
                account,
                connect, 
                providerState
            }}
        >
            {children}
        </StateContext.Provider>
    )
}


export const useAppContext = () => useContext(StateContext);