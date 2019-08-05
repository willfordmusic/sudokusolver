class SolverAI {
    constructor(sudoku) {
        this.sudoku = sudoku;
        this.isSolvable = true;
    }

    // Solve the sudoku
    solve() {
        const startTime = performance.now();
        this.sudoku.updateCells();
        for (let i = 0; i < 50 && !this.sudoku.isSolved() && this.isSolvable; i++) {
            this.sudoku.updateCandidates();

            this.soleCandidates();
            this.hiddenSingles();
        }

        this.sudoku.clear();
        if (!this.sudoku.isSolved()) {
            this.sudoku.showCandidates();
            console.log('Sudoku could not be solved! :(');
        } else console.log(`Sudoku solved in ${Math.floor(performance.now() - startTime)}ms`);
    }

    // Only one candidate is possible in a cell
    soleCandidates() {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (this.sudoku.cells[x][y] === undefined) {
                    const cand = this.sudoku.candidates[x][y].reduce((i, j) => i + j);

                    if (cand === 0) this.isSolvable = false;
                    if (cand === 1) this.sudoku.candidates[x][y].map((i, j) => {
                        if (i === 1) {
                            this.sudoku.cells[x][y] = j;
                            this.sudoku.updateCandidates();
                        }
                    });
                }
            }
        }
    }

    // A candidate only appears in one cell of a row, column or box
    hiddenSingles() {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (this.sudoku.cells[x][y] === undefined) {
                    for (let i = 1; i <= 9; i++) {
                        if (this.sudoku.candidates[x][y][i] === 1) {
                            let found = false;
                            let count;
    
                            // Check Horizontal Rows
                            if (!found) {
                                count = 0;
                                for (let j = 0; j < 9 && count < 3; j++) 
                                    if (this.sudoku.candidates[j][y][i] === 1 && this.sudoku.cells[j][y] === undefined) count++;
                                if (count === 1) found = true;
                            }
    
                            // Check Vertical Rows
                            if (!found) {
                                count = 0;
                                for (let j = 0; j < 9 && count < 3; j++) 
                                    if (this.sudoku.candidates[x][j][i] === 1 && this.sudoku.cells[x][j] === undefined) count++;
                                if (count === 1) found = true;
                            }
    
                            // Check Boxes
                            if (!found) {
                                count = 0;
                                for (let boxX = Math.floor(x / 3) * 3; boxX < Math.floor(x / 3) * 3 + 3 && count < 3; boxX++) {
                                    for (let boxY = Math.floor(y / 3) * 3; boxY < Math.floor(y / 3) * 3 + 3 && count < 3; boxY++) {
                                        if (this.sudoku.candidates[boxX][boxY][i] === 1 && this.sudoku.cells[boxX][boxY] === undefined) count++;
                                    }
                                }
                                if (count === 1) found = true;
                            }
                            
                            // Conclusion
                            if (found) { 
                                this.sudoku.cells[x][y] = i;
                                this.sudoku.updateCandidates();
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    // 
    pointingPairs() {

    }
}