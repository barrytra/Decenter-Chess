import React, { useEffect } from 'react'
import { useState } from 'react';
import "./Home.css"
import ConnectWallet from "../utils/ConnectWallet";
import Board from '../components/Board/Board';
import Control from '../components/Control/Control';
import TakeBack from '../components/Control/bits/TakeBack';
import MovesList from '../components/Control/bits/MovesList';
import io from "socket.io-client"
const socket = io.connect("http://localhost:3001");
socket.on("connect", () => {
    console.log(socket.id)
})

const Home = () => {

    const [createInputs, setCreateInputs] = useState({});
    const [joinInputs, setJoinInputs] = useState({});
    const [create, setCreate] = useState(false)
    const [join, setJoin] = useState(false)
    const [roomJoined, setroomJoined] = useState(false);

    const activateCreate = () => {
        setCreate(true);
    }
    const activateJoin = () => {
        setJoin(true);
    }


    const handleCreateChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setCreateInputs(values => ({ ...values, [name]: value }))
    }
    const handleJoinChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setJoinInputs(values => ({ ...values, [name]: value }))
    }

    useEffect( () => {
        socket.on("recieve_game_data", (data) => {
            setCreateInputs(data)
        })
    }, [socket])
    
    const funcCreate = async (e) => {
        console.log(createInputs);
        socket.emit("join_room", createInputs.roomCode);
        socket.emit("game_data", (createInputs, createInputs.roomCode))
        setroomJoined(true);
    }
    const funcJoin = async (e) => {
        socket.emit("join_room", joinInputs.roomCode);
        console.log(joinInputs)
        setroomJoined(true);
    }

    if(roomJoined) {
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
                <heading className='heading' to="/" > decenter Chess </heading>
                <wallet className='wallet'><ConnectWallet /></wallet>
            </nav>

            <div className='div'>
                <create className='create'>
                    <div className='contain'>
                        <button className='button' onClick={activateCreate}>Create game</button>
                        {create && (
                            <form>
                                <label> Create a room code (number):
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
                                        <select name="coins" id="stake" value={createInputs.coins} onChange={handleCreateChange}>
                                            <option value="50">50</option>gameStartData
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
                </create>
                <join className='join'>
                    <button className='button' onClick={activateJoin}>Join Game</button>
                    {join && (
                        <form>
                            <label> Enter the room code (number):
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
                </join>
            </div>
        </div>
    )
}

export default Home