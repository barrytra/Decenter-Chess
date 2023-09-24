import { useEffect, useState } from "react";
import "./utils.css"
import { ethers } from "ethers";
import ABI from "../abi/chessgameABI.json"

export default function ConnectWallet() {

    const [currentAccount, setCurrentAccount] = useState("");

    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                alert("Get MetaMask!");
                return;
            }
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });
            console.log("Connected", accounts[0]);
            setCurrentAccount(accounts[0]);
            console.log("Connected", currentAccount);


        } catch (error) {
            console.log(error);
        }

        const mintContract = "0xA3A8F2B4DcCB6c9a9Ff60A205aD8A142B31a5c88"

        const { ethereum } = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(mintContract, ABI, signer);
            console.log("Connected", currentAccount);

            // await contract.newUser(currentAccount);
        }
    };

    const checkIfWalletIsConnected = async () => {
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
            const account = accounts[0];
            console.log("Found an authorized account:", account);
            setCurrentAccount(account);
        } else {
            console.log("No authorized account found");
        }

        //   const mintAddress = "0x5e74e338F76fa60fD91081010564080B8932DEe7"

        //   if (ethereum) {
        //       const provider = new ethers.providers.Web3Provider(ethereum);
        //       const signer = provider.getSigner();
        //       const contract = new ethers.Contract(mintAddress, ContractABI2, signer);

        //       await contract.newUser(currentAccount);
        //   }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);



    return (
        <div>
            {currentAccount === '' ? <span className="wallet" to="/" onClick={connectWallet}> Connect Wallet</span> : <h3>{currentAccount}</h3>}
        </div>
    )
}
