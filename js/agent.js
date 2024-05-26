

class Agent {
    constructor() {
    }

    selectMove(gameManager) {
        var brain = new AgentBrain(gameManager);

        // Use the brain to simulate moves
        // brain.move(i) 
        // i = 0: up, 1: right, 2: down, 3: left
        // brain.reset() resets the brain to the current game board
        const availableMoves = [0, 1, 2, 3].filter(i => {
            const worked = brain.move(i)
            brain.reset();
            return worked;
        });
        let bestMove = -1;
        let bestScore = -Infinity;
        for (let i of availableMoves) {
            if (brain.move(i)) {
                let newScore = this.expectimax(brain.grid, 4, false);
                if (newScore > bestScore) {
                    bestScore = newScore;
                    bestMove = i;
                }
            }
            brain.reset();
        }
        // Any move will result in a loss.
        if (bestMove === -1) {
            return availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }
        return bestMove;
    };

    expectimax(grid, depth, isMax) {
        // Initializing the brain here will save the current state of the game so it can be reset.
        var brain = new AgentBrain({grid: grid});

        if (depth == 0) {
            return this.evaluateGrid(grid);
        }
        let bestScore = -Infinity;

        if (isMax) {
            for (let i = 0; i < 4; i++) {
                brain.move(i);
                let newScore = this.expectimax(brain.grid, depth - 1, false);
                bestScore = Math.max(bestScore, newScore);
                brain.reset();
            }
        } else {
            bestScore = 0;
            let emptyCells = grid.availableCells();
            for (let cell of emptyCells) {
                brain.addTile(cell, 2);
                let newScore = this.expectimax(brain.grid, depth - 1, true);
                bestScore += newScore;
                brain.reset();
            }
            bestScore /= emptyCells.length;
        }

        return bestScore;
    };
    
    evaluateGrid(grid) {
        return this.squareWeights(grid);
    };

    squareWeights(grid) {
        // calculate a score for the current grid configuration
        const cells = grid.cells;
        const bias = [[-16, -8, -4, -2], 
                      [4, 2, 0, -2], 
                      [4, 8, 16, 32], 
                      [256, 128, 64, 32]]
        let score = 0;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                score += (cells[i][j]?.value ?? 0) * bias[i][j];
            }
        }
        return score;
    }

    // logdiffs(grid) {
    //     // calculate a score for the current grid configuration
    //     const cells = [grid.cells[0].reverse(), grid.cells[1], grid.cells[2].reverse(), grid.cells[3]].flat();
    //     let score = 0;
    //     // adjacent cells should be descending.
    //     for (let i = 0; i < cells.length - 1; i++) {
    //         if (cells[i] && cells[i + 1]) {
    //             // find the number of times the cell is doubled to equal the other
    //             const difference = Math.log2(cells[i].value) - Math.log2(cells[i + 1].value)
    //             score += difference;
    //         }
    //     }

    //     return score;
    // }
}
