import React, { useEffect } from 'react'
import { useState } from 'react';
import "./Home.css"
import ConnectWallet from "../utils/ConnectWallet";
import Board from '../components/Board/Board';
import Control from '../components/Control/Control';
import TakeBack from '../components/Control/bits/TakeBack';
import MovesList from '../components/Control/bits/MovesList';
import io from "socket.io-client"
import { useAppContext } from '../contexts/Context'
import { ethers } from 'ethers';
import ContractABI from "../abi/chessgameABI.json"
import { setupNewGame } from '../reducer/actions/game';

const socket = io.connect("http://localhost:3001");
socket.on("connect", () => {
    console.log(socket.id)
})

const Home = () => {

    const { appState: { status, movesList }, dispatch } = useAppContext();

    const [addrCreator, setAddrCreator] = useState('')
    const [createInputs, setCreateInputs] = useState({});
    const [joinInputs, setJoinInputs] = useState({});
    const [create, setCreate] = useState(false)
    const [join, setJoin] = useState(false)
    const [roomJoined, setroomJoined] = useState(false);
    const [wait, setWait] = useState(false);
    const [gameCount, setGameCount] = useState(1);
    const [userCoins, setUserCoins] = useState(0);
    const [buyTokensAmount, setBuyTokensAmount] = useState({});

    const [currentAccount, setCurrentAccount] = useState("");


    const mintContract = "0x517D5e49172db976b0957b83Be9Cbc7Ade7443c2"

    const updateUserCoins = async (e) => {
        // e.preventDefault()
        const { ethereum } = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(mintContract, ContractABI, signer);

            let userCoins = await contract.getBalance(currentAccount);
            console.log(userCoins);
            setUserCoins(Number(userCoins._hex) / 1e18);

        }
    }

    const buyTokens = async (e) => {
        e.preventDefault()
        const { ethereum } = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(mintContract, ContractABI, signer);
            console.log(buyTokensAmount.amount)
            await contract.buyTokens(currentAccount, buyTokensAmount.amount);

            let userCoins = await contract.getBalance(currentAccount);
            console.log(Number(userCoins._hex) / 1e18);
            setUserCoins(Number(userCoins._hex) / 1e18);
        }
    }

    const endGame = async (e) => {
        if (status.endsWith('wins')) {

            // e.preventDefault()
            const { ethereum } = window;
            if (ethereum) {
                let winnerColor = status.substring(0, 1) === "W" ? 0 : 1;
                console.group("status: ", status)
                console.group("status: ", status.substring(0,1));
                console.log("winner color: ", winnerColor)
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(mintContract, ContractABI, signer);
                let currentGameIdCreatorAddress = await contract.getCurrentGameIdCreatorAddress(currentAccount);
                console.log(currentGameIdCreatorAddress);
                // if(currentAccount === currentGameIdCreatorAddress){
                        // await contract.endGame(addrCreator, movesList, winnerColor);
                
            // }
                
                setTimeout(function () {
                    // updateUserCoins();
                    setroomJoined(false)
                    setWait(false)
                }, 3000)
            }
        }
        dispatch(setupNewGame());
    }

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
            console.log("Connected", currentAccount);
            
            
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(mintContract, ContractABI, signer);
            let userCoins = await contract.getBalance(currentAccount);
            setUserCoins(Number(userCoins._hex) / 1e18);
            console.log("user COins: ", userCoins);
            setCurrentAccount(accounts[0]);
            console.log("Connected", currentAccount);
            // await contract.newUser(currentAccount);

        } catch (error) {
            console.log(error);
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

    useEffect(() => {
        endGame();
    }, [status]);

    const activateCreate = () => {
        setCreate(true);
    }
    const activateJoin = () => {
        setJoin(true);
    }

    const handleBuyTokenChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setBuyTokensAmount(values => ({ ...values, [name]: value }))
        console.log(buyTokensAmount);
        console.log(event.target.value);
    }

    const handleCreateChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setCreateInputs(values => ({ ...values, [name]: value }))
        if (value === "unrated") {
            setCreateInputs(values => ({ ...values, coins: 0 }))
        }
    }
    const handleJoinChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setJoinInputs(values => ({ ...values, [name]: value }))
    }

    useEffect(() => {
        socket.on("recieve_game_data", (data, addr1) => {
            setCreateInputs({ "roomCode": data.roomCode, "mode": data.mode, "coins": data.coins })
            setAddrCreator(addr1);
            console.log("creator inputs: ", createInputs)
            console.log("creator's address: ", addr1);
        })

        socket.on("room_joined", (roomstatus) => {
            setroomJoined(!roomstatus);
            // updateUserCoins();

        })
    }, [socket])


    const funcCreate = async (e) => {
        e.preventDefault()
        if(currentAccount){
            console.log(createInputs);
            socket.emit("join_room", createInputs.roomCode);
            socket.emit("game_data", createInputs, currentAccount)
            setAddrCreator(currentAccount);
            // setroomJoined(true);
            setWait(true);
            // console.log(inputs)

            // const { ethereum } = window;
            // if (ethereum) {
            //     const provider = new ethers.providers.Web3Provider(ethereum);
            //     const signer = provider.getSigner();
            //     const contract = new ethers.Contract(mintContract, ContractABI, signer);


            // }
        }
        else{
            alert("connect your wallet")
        }
        
    }
    const funcJoin = async (e) => {
        e.preventDefault()
        socket.emit("join_room", joinInputs.roomCode);
        console.log(joinInputs)
        // setroomJoined(true);

        if (createInputs.roomCode === joinInputs.roomCode) {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(mintContract, ContractABI, signer);

                console.log(addrCreator, currentAccount, createInputs.coins, gameCount);
                await contract.startGame(addrCreator, currentAccount, createInputs.coins);
                // let userCoins = await contract.getBalance(currentAccount);
                // setUserCoins(Number(userCoins._hex) / 1e18);
                setGameCount(gameCount + 1);
                setroomJoined(true);
                socket.emit("room_joined", roomJoined, joinInputs.roomCode);
            }
        }
        else {
            console.log("no room matches")
        }
    }

    if (!roomJoined && wait) {
        return <div>
            <h1>Waiting...</h1>
            <h2>Room ID: {createInputs.roomCode}</h2>
        </div>
    }

    if (roomJoined) {
        return (

            <div className="App">
                <Board />
                <Control>
                    <MovesList />
                    <TakeBack />
                </Control>
            </div>

        );
    }
    return (
        <div>
            <nav className='nav'>
                <div className='heading' to="/" > decenter Chess </div>
                {currentAccount !== "" ?
                    <div className='tokens'>
                        <div>
                            <form className='tokenForm'>
                                <input type='number' name='amount' value={buyTokensAmount.amount || ''} onChange={handleBuyTokenChange} />
                                <input type="submit" className="tokenButton" onClick={buyTokens} value='buy Tokens' />
                            </form>
                        </div>
                    </div> : <div></div>}
                <div className='wallet'><div>
                    {currentAccount === '' ? <span className="wallet" to="/" onClick={connectWallet}> Connect Wallet</span> : <h3>{currentAccount}</h3>}
                </div></div>
            </nav>

            <div className='div'>
                <div className='create'>
                    <div className='contain'>
                        <button className='button' onClick={activateCreate}>Create game</button>
                        {create && (
                            <form>
                                <label> Create a Room ID :
                                    <input className='input'
                                        type='number'
                                        name='roomCode'
                                        value={createInputs.roomCode || ""}
                                        onChange={handleCreateChange}
                                    />
                                </label>
                                <label className='label' > Select Mode:
                                    <input
                                        type='radio'
                                        name='mode'
                                        value="unrated"
                                        onChange={handleCreateChange}
                                    />
                                    <label>unrated</label>
                                    <input
                                        type='radio'
                                        name='mode'
                                        value="rated"
                                        onChange={handleCreateChange}
                                    />
                                    <label>rated</label>
                                </label>
                                {createInputs.mode === "rated" && (
                                    <div>
                                        <label htmlFor="stake" className="players">Stake coins</label>
                                        <select name="coins" id="stake" value={createInputs.coins || 0} onChange={handleCreateChange}>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                            <option value="500">500</option>
                                            <option value="1000">1000</option>
                                            <option value="5000">5000</option>
                                            <option value="10000">10000</option>
                                        </select>
                                    </div>
                                )}
                                <input className='submit' type='submit' onClick={funcCreate} />
                            </form>
                        )}
                    </div>
                </div>
                <div className='join'>
                    <button className='button' onClick={activateJoin}>Join Game</button>
                    {join && (
                        <form>
                            <label> Enter the Room ID (number):
                                <input className='input'
                                    type='number'
                                    name='roomCode'
                                    value={joinInputs.roomCode || ""}
                                    onChange={handleJoinChange}
                                />
                            </label>
                            <input className='submit' type='submit' onClick={funcJoin} />
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Home