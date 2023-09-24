import './Pieces.css'
import Piece from './Piece'
import io from "socket.io-client"
import { useEffect, useRef, useState  } from 'react'
import { useAppContext }from '../../contexts/Context'
import { openPromotion } from '../../reducer/actions/popup'
import { getCastlingDirections } from '../../arbiter/getMoves'
import { updateCastling, detectStalemate, detectInsufficientMaterial, detectCheckmate, opponentMove} from '../../reducer/actions/game'

import { makeNewMove, clearCandidates } from '../../reducer/actions/move'
import arbiter from '../../arbiter/arbiter'
import { getNewMoveNotation } from '../../helper'

const socket = io.connect("http://localhost:3001");

socket.on("connect", () => {
    console.log(socket.id)
})

const Pieces = () => {

    const { appState , dispatch } = useAppContext();
    const currentPosition = appState.position[appState.position.length-1]
    const [toggle, setToggle] = useState(false)
    const ref = useRef()
    let opponent2, castleDirection2, piece2;


    const updateCastlingState = ({piece,file,rank}) => {
        const direction = getCastlingDirections({
            castleDirection:appState.castleDirection,
            piece,
            file,
            rank
        })
        if (direction){
            dispatch(updateCastling(direction))
        }
    }

    const openPromotionBox = ({rank,file,x,y}) => {
        dispatch(openPromotion({
            rank:Number(rank),
            file:Number(file),
            x,
            y
        }))
    }

    const calculateCoords = e => {
        const {top,left,width} = ref.current.getBoundingClientRect()
        const size = width / 8
        const y = Math.floor((e.clientX - left) / size) 
        const x = 7 - Math.floor((e.clientY - top) / size)

        return {x,y}
    }

    const move = e => {
        const {x,y} = calculateCoords(e)
        const [piece,rank,file] = e.dataTransfer.getData("text").split(',')
        piece2 = piece
        if(appState.candidateMoves.find(m => m[0] === x && m[1] === y)){
            const opponent = piece.startsWith('b') ? 'w' : 'b'
            opponent2 = opponent
            const castleDirection = appState.castleDirection[`${piece.startsWith('b') ? 'white' : 'black'}`]
             castleDirection2 = castleDirection
            if ((piece==='wp' && x === 7) || (piece==='bp' && x === 0)){
                openPromotionBox({rank,file,x,y})
                return
            }
            if (piece.endsWith('r') || piece.endsWith('k')){
                updateCastlingState({piece,file,rank})
            }
            const newPosition = arbiter.performMove({
                position:currentPosition,
                piece,rank,file,
                x,y
            })

            
            // console.log("newposition: ", newPosition);
            const newMove = getNewMoveNotation({
                piece,
                rank,
                file,
                x,
                y,
                position:currentPosition,
            })
            dispatch(makeNewMove({newPosition,newMove}))
            
            if (arbiter.insufficientMaterial(newPosition))
            dispatch(detectInsufficientMaterial())
        else if (arbiter.isStalemate(newPosition,opponent,castleDirection)){
            dispatch(detectStalemate())
        }
        else if (arbiter.isCheckMate(newPosition,opponent,castleDirection)){
            dispatch(detectCheckmate(piece[0]))
        }
        const temp = appState.turn === "w" ? "b" : "w";
        socket.emit("new-position", newPosition, temp, newMove)
        setToggle(!toggle);
        }
        dispatch(clearCandidates())
    }

    const onDrop = e => {
        e.preventDefault()
        
        move (e)
    }
    
    const onDragOver = e => {e.preventDefault()}

    
    useEffect( () => {
        socket.on("get-new-position", (newPosition, temp, moves) => {
            console.log(newPosition)
            console.log(moves)
            console.log("new-position: ", temp)
            dispatch(opponentMove(newPosition, temp, moves));
            // appState.turn =  appState.turn === 'w' ? 'b' : 'w';
            console.log(appState.turn)
    })
    },[])

    return <div 
        className='pieces' 
        ref={ref} 
        onDrop={onDrop} 
        onDragOver={onDragOver} > 
        {currentPosition.map((r,rank) => 
            r.map((f,file) => 
                currentPosition[rank][file]
                ?   <Piece 
                        key={rank+'-'+file} 
                        rank = {rank}
                        file = {file}
                        piece = {currentPosition[rank][file]}
                    />
                :   null
            )   
        )}
    </div>
}

export default Pieces