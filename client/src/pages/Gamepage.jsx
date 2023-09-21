import '../App.css';
import Board from '../components/Board/Board';

import Control from '../components/Control/Control';
import TakeBack from '../components/Control/bits/TakeBack';
import MovesList from '../components/Control/bits/MovesList';

function Gamepage() {

   

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

export default Gamepage;
