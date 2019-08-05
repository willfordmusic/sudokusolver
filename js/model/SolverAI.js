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
            this.updateCandidates();

            this.singleCandidates();
            this.hiddenSingles();
        }

        this.sudoku.clear();
        if (!this.sudoku.isSolved()) {
            this.sudoku.showCandidates();
            console.log('Sudoku could not be solved! :(');
        } else console.log(`Sudoku solved in ${Math.floor(performance.now() - startTime)}ms`);
    }

    // Enhances the sudoku update candidates function
    updateCandidates() {
        this.sudoku.updateCandidates();
        //this.pointingPairs();
        //this.solveHidden();
    }

    // Only one candidate is present in a cell
    // AKA naked single
    singleCandidates() {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (this.sudoku.cells[x][y] === undefined) {
                    const cand = this.sudoku.candidates[x][y].reduce((i, j) => i + j); //.filter(i => i == 1).length

                    if (cand === 0) this.isSolvable = false;
                    if (cand === 1) this.sudoku.candidates[x][y].map((i, j) => {
                        if (i === 1) {
                            this.sudoku.cells[x][y] = j;
                            this.updateCandidates();
                        }
                    });
                }
            }
        }
    }

    // A candidate only appears in one cell of a row, column or box

    // GENERALIZED: 

    // If x amount of candidates only appear in x amount of cells of a row, column or box. 
    // then these candidates must go in these cells and all other candidates can be removed from these cells. 
    // AKA hidden singles, doubles, triples or quads
    solveHidden() {
        let pairs = getHorizontalPairs();
    }

    getHorizontalPairs() {
        for (let y = 0; y < 9; y++) {
            const checkCells = [];
            for (let x = 0; x < 9; x++) 
                if (this.isEmpty(x, y)) checkCells.push({x: x, y: y, cand: this.sudoku.candidates[x][y]});
            console.log(checkCells);
        }
    }

    // Checks if a cell at coordinate (x, y) is empty
    isEmpty(x, y) {
        return this.sudoku.cells[x][y] === undefined;
    }



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
                                this.updateCandidates();
                                break;
                            }
                        }
                    }
                }
            }
        }
    }



    // If a pair of candidates appears in only two empty cells in a row, column or box 
    // then these candidates must go in these cells and all other candidates can be 
    // removed from these cells. 
    hiddenPairs() {
        const rowColPairs = this.getRowColPairs();
        const boxPairs = this.getBoxPairs();


    }

    // If a pair of empty cells within a box in the same row or column share a candidate
    // that doesn't appear anywhere else in that box, then that candidate can be removed 
    // from any other cells in that row or column

    // OR

    // that doesn't appear anywhere else in that row or column, then that candidate can
    // be removed from any other cells in that box
    pointingPairs() {
        const pairs = this.getBoxPairs()

        // Check all pairs for pointing features
        // Check for each number if both contain it, and if the rest of the box only contains 2
        pairs.map((pair) => {

        });
    }

    // Find all eligible groups of 2 within a box to be checked
    getBoxPairs() {
        let emptycells = [];
        let pairs = [];
        for (let i = 0; i < 9; i++) emptycells[i] = [];

        // Find all empty cells per box
        this.sudoku.cells.map((i, x) => i.map((j, y) => {
            if (j === undefined) {
                const box = Math.floor(x / 3) + Math.floor(y / 3) * 3;
                emptycells[box].push({x: x, y: y});
            }
        }));

        // and find the pairs
        emptycells.map((box) => {
            box.map((cell, i) => {
                for (let j = i; j < box.length; j++) {
                    if (this.isPair(cell, box[j])) { 
                        pairs.push({x1: cell.x, y1: cell.y, x2: box[j].x, y2: box[j].y});
                    }
                }
            })
        });

        return pairs;
    }

    // Find all eligible groups of 2 within rows and columns to be checked
    getRowColPairs() {
        let emptycells = [];
        let pairs = [];

        this.sudoku.cells.map((i, x) => i.map((j, y) => {
            if (j === undefined) emptycells.push({x: x, y: y});
        }));

        emptycells.map((cell, i) => {
            for (let j = i; j < emptycells.length; j++) {
                if (this.isPair(cell, emptycells[j])) {
                    pairs.push({x1: cell.x, y1: cell.y, x2: emptycells[j].x, y2: emptycells[j].y});
                }
            }
        });

        return pairs;
    }

    // Return bool if the two cells provided are a pair
    isPair(cell1, cell2) {

        // Do they lie on either the same x or y axis? 
        if (cell1.x === cell2.x ? cell1.y !== cell2.y : cell1.y === cell2.y) { //XOR
            return true;
            // Do they share at least 2 candidates?

        } else return false;
    }
}