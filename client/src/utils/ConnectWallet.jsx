import { useEffect, useState } from "react";
import "./utils.css"
import { ethers } from "ethers";
import ABI from "../abi/chessgameABI.json"
import { useAppContext } from "../contexts/Context";

export default function ConnectWallet() {
    const { connect, account } = useAppContext();



    return (
        <div>
            {account === '' ? <span className="wallet" to="/" onClick={connect}> Connect Wallet</span> : <h3>{account}</h3>}
        </div>
    )
}
