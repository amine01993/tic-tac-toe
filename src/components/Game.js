import React from 'react'
import Board from './Board'
import { winning, minimax } from '../functions'

export default class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null)
                }
            ],
            stepNumber: 0,
            turn: 'X', // X human, O ai
            winner: null
        };
        // prop gameOption = PLAYER_COMPUTER

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(i) {
        // copy of the current history
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        // copy of a current board
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        // current player
        let currentPlayer = this.state.turn

        // if there is a winner already or if the target square is full then return
        if (this.state.winner || squares[i]) {
            return
        }

        // otherwise we fill the clicked square
        squares[i] = currentPlayer
        let gameOver = winning(squares, currentPlayer)
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X'

        if(!gameOver) {
            // when the gameOption is player vs com.
            // computer turn and we assume aiPlayer is 'O'
            const bestMove = minimax(squares, currentPlayer, 'X', 'O')
            console.log('bestMove', bestMove)
            squares[bestMove.index] = 'O'
            gameOver = winning(squares, currentPlayer)
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X'
        }
        
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            turn: currentPlayer,
            winner: gameOver ? (currentPlayer === 'X' ? 'O' : 'X') : null
        });
    }

    jumpTo(step) {
        // copy of the current history
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        // copy of a current board
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        // current player
        const currentPlayer = this.state.turn
        
        this.setState({
            stepNumber: step,
            turn: (step % 2) === 0 ? 'X' : 'O',
            winner: winning(squares, currentPlayer) ? currentPlayer : null
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (this.state.winner) {
            status = "Winner: " + this.state.winner;
        } 
        else {
            status = "Next player: " + this.state.turn;
        }

        return (
            <div className="game">
                <div className="game-board">
                <Board
                    squares={current.squares}
                    onClick={this.handleClick}
                />
                </div>
                <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}
