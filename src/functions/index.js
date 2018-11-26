
/**
 * A Minimax algorithm can be best defined as a recursive function that does the following things:
 * 
 * 1. return a value if a terminal state is found (+10, 0, -10)
 * 2. go through available spots on the board
 * 3. call the minimax function on each available spot (recursion)
 * 4. evaluate returning values from function calls
 * 5. and return the best value    
 */

// returns list of the indexes of empty spots on the board
function emptyIndexies(board){
    let arr = []
    board.forEach(function callback(val, index) {
        if(val == null) arr.push(index)
    })
    return arr
}

// winning combinations using the board indexies
function winning(board, player) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for(let i = 0; i < lines.length; i++) {
        let line = lines[i]
        if ( board[line[0]] === player && 
            board[line[1]] === player && 
            board[line[2]] === player ) {
            return true;
        }
    }
    
    return false;
}

//
function draw(board) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // if one cell is empty return false
    for(let i = 0; i < board.length; i++) {
        if ( board[i] === null ) {
            return false
        }
    }

    // if one of the players won return false
    for(let i = 0; i < lines.length; i++) {
        let line = lines[i]
        if ( board[line[0]] === board[line[1]] && 
            board[line[1]] === board[line[2]] ) {
            return false
        }
    }

    return true
}

// the main minimax function
function minimax(newBoard, player, huPlayer, aiPlayer){
  
    //available spots
    var availSpots = emptyIndexies(newBoard);
    
    // checks for the terminal states such as win, lose, and tie 
    //and returning a value accordingly
    if (winning(newBoard, huPlayer)){
        return {score: -10};
    }
    else if (winning(newBoard, aiPlayer)){
        return {score: 10};
    }
    else if (availSpots.length === 0){
        return {score: 0};
    }

    // an array to collect all the objects
    var moves = [];

    // loop through available spots
    for (var i = 0; i < availSpots.length; i++){
        //create an object for each and store the index of that spot 
        let move = {};
        move.index = availSpots[i];

        // set the empty spot to the current player
        newBoard[availSpots[i]] = player;

        // collect the score resulted from calling minimax 
        //on the opponent of the current player
        let result = minimax(
            newBoard, player === aiPlayer ? huPlayer : aiPlayer, 
            huPlayer, aiPlayer
        )
        move.score = result.score

        // reset the spot to empty
        newBoard[availSpots[i]] = null;

        // push the object to the array
        moves.push(move);
    }

    let bestMove, bestScore = null;
    if(player === aiPlayer){
        // if it is the computer's turn loop over the moves 
        //and choose the move with the highest score
        for(let i = 0; i < moves.length; i++){
            if(bestScore === null || moves[i].score > bestScore ||
                (moves[i].score === bestScore && randomBool())){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    else{
        // else loop over the moves and choose the move with the lowest score
        for(let i = 0; i < moves.length; i++){
            if(bestScore === null || moves[i].score < bestScore ||
                (moves[i].score === bestScore && randomBool())){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    // return the chosen move (object) from the moves array
    return moves[bestMove];
}

function randomBool() {
    return Math.random() < .5
}

export { winning, minimax, draw }