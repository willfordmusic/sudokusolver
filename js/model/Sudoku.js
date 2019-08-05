class Sudoku {
    constructor() {
        this.activeCell = 'x';
        this.isSolvable = true;

        this.cells = [];
        for (let i = 0; i < 9; i++) this.cells[i] = [];

        //Debug, load cells
        this.cells = [
            [4, 2, 7, 1, 9, 8, 3, 5, 6],
            [1, 6, 5, 7, 2, 3, 9, 4, 8],
            [9, 3, 8, 6, 4, 5, 1, 2, 7],
            [undefined, undefined, undefined, 4, undefined, 2, undefined, 9, 5],
            [8, undefined, 2, 5, undefined, 9, undefined, undefined, 3],
            [5, 9, undefined, 3, undefined, 6, undefined, undefined, 2],
            [undefined, 5, 9, 2, 6, 1, undefined, undefined, 4],
            [2, undefined, undefined, 8, 3, undefined, 5, undefined, 9],
            [undefined, 8, undefined, 9, 5, undefined, 2, undefined, 1],
        ];

        this.candidates = [];
        for (let i = 0; i < 9; i++) {
            this.candidates[i] = [];
            for (let j = 0; j < 9; j++) this.candidates[i][j] = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        }
    }

    // Solve the sudoku
    solve() {
        const startTime = performance.now();
        this.updateCells();
        for (let i = 0; i < 50 && !this.isSolved() && this.isSolvable; i++) {
            this.updateCandidates();

            this.soleCandidates();
            this.hiddenSingles();
        }

        this.clear();
        if (!this.isSolved()) {
            this.showCandidates();
            console.log('Sudoku could not be solved! :(');
        } else console.log(`Sudoku solved in ${Math.floor(performance.now() - startTime)}ms`);
    }

    // Returns bool if the sudoku is solved
    isSolved() {
        for (let x = 0; x < 9; x++) 
            for (let y = 0; y < 9; y++)
                if (this.cells[x][y] === undefined) return false;
        return true;
    }

    // Returns false if cell is not solved and solution if cell is solved
    solveCell(x, y) {
        if (this.cells[x][y] !== undefined) return this.cells[x][y];
        else {
            let cand = 0;
            for (let i = 1; i <= 9; i++) if (this.candidates[x][y][i] === 1) cand++;
            
            if (cand === 0) this.isSolvable = false;
            if (cand === 1) {
                for (let i = 1; i <= 9; i++) if (this.candidates[x][y][i] === 1) return i;
            } else return false;
        }
    }

    // Only one candidate is possible in a cell
    soleCandidates() {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                const sol = this.solveCell(x, y);
                if (sol !== false) { 
                    this.cells[x][y] = sol;
                    this.updateCandidates();
                }
            }
        }
    }

    // A candidate only appears in one cell of a row, column or box
    hiddenSingles() {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                for (let i = 1; i <= 9; i++) {
                    if (this.candidates[x][y][i] === 1 && this.cells[x][y] === undefined) {
                        let found = false;
                        let count;

                        // Check Horizontal Rows
                        if (!found) {
                            count = 0;
                            for (let j = 0; j < 9; j++) if (this.candidates[j][y][i] === 1 && this.cells[j][y] === undefined) count++;
                            if (count === 1) found = true;
                        }

                        // Check Vertical Rows
                        if (!found) {
                            count = 0;
                            for (let j = 0; j < 9; j++) if (this.candidates[x][j][i] === 1 && this.cells[x][j] === undefined) count++;
                            if (count === 1) found = true;
                        }

                        // Check Boxes
                        if (!found) {
                            count = 0;
                            for (let boxX = Math.floor(x / 3) * 3; boxX < Math.floor(x / 3) * 3 + 3; boxX++) {
                                for (let boxY = Math.floor(y / 3) * 3; boxY < Math.floor(y / 3) * 3 + 3; boxY++) {
                                    if (this.candidates[boxX][boxY][i] === 1 && this.cells[boxX][boxY] === undefined) count++;
                                }
                            }
                            if (count === 1) found = true;
                        }
                        
                        // Conclusion
                        if (found) { 
                            this.cells[x][y] = i;
                            this.updateCandidates();
                        }
                    }
                }
            }
        }
    }

    // The 2 remaining cells
    pointingPairs() {

    }

    // Generate all possible candidates
    updateCandidates() {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {

                // Reset candidates for this cell
                this.candidates[x][y] = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1];
                
                for (let i = 1; i <= 9; i++) {

                    // Check Horizontal and Vertical Rows
                    for (let j = 0; j < 9; j++) {
                        if (this.cells[j][y] === i || this.cells[x][j] === i) this.candidates[x][y][i] = 0; 
                    }

                    // Check Boxes
                    for (let boxX = Math.floor(x / 3) * 3; boxX < Math.floor(x / 3) * 3 + 3; boxX++) {
                        for (let boxY = Math.floor(y / 3) * 3; boxY < Math.floor(y / 3) * 3 + 3; boxY++) {
                            if (this.cells[boxX][boxY] === i) this.candidates[x][y][i] = 0;
                        }
                    }
                }
            }
        }
    }

    // Show the saved candidates
    showCandidates() {
        this.updateCells();
        this.updateCandidates();

        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                for (let i = 1; i <= 9; i++) {
                    if (this.candidates[x][y][i] == 1) $(`#${x}${y}-${i}`).removeClass('hidden');
                    else $(`#${x}${y}-${i}`).addClass('hidden');
                }
            }
        }
    }

    // Updates the cells member variable with what is seen in the UI
    updateCells() {
        for (let x = 0; x < 9; x++)
            for (let y = 0; y < 9; y++)
                if ($(`#${x}${y}`).text().length === 1) 
                    this.cells[x][y] = parseInt($(`#${x}${y}`).text());
    }

    // Sets the active cell
    setActiveCell(cell = 'x') {
        $('.cell').removeClass('active');
        $(`#${cell}`).addClass('active');
        this.activeCell = cell;
    }

    // Moves the active cell left, up, right or down
    moveActiveCell(key) {
        if (this.activeCell !== 'x') {
            const x = parseInt(this.activeCell[0]);
            const y = parseInt(this.activeCell[1]);
            if (key === 37) this.setActiveCell(`${Math.max(0, x - 1)}${y}`); //left
            if (key === 38) this.setActiveCell(`${x}${Math.max(0, y - 1)}`); //up
            if (key === 39) this.setActiveCell(`${Math.min(8, x + 1)}${y}`); //right
            if (key === 40) this.setActiveCell(`${x}${Math.min(8, y + 1)}`); //down
        }
    }

    // Sets the value of the active cell in the frontend
    setCell(cell, val = 'x') {
        if (val === 'x') this.insertCandidates(cell);
        else $(`#${cell}`).html(val);
    }

    // Clears content of a cell and fills it with a hidden candidate grid
    insertCandidates(cell) {
        const appendTo = $(`#${cell}`).empty();
        for (let j = 1; j <= 9; j++) 
            appendTo.append(`<div class="cand hidden" id="${cell}-${j}">${j}</div>`);
    }

    // Initialize and place a full sudoku with all of its nested elements
    clear() {
        const container = $('#sudoku');
        container.empty();

        for (let i = 0; i < 9; i++) {
            const box = $('<div class="box"></div>');
            for (let y = Math.floor(i / 3) * 3; y < Math.floor(i / 3) * 3 + 3; y++) {
                for (let x = i % 3 * 3; x < i % 3 * 3 + 3; x++) {
                    const cell = $(`<div class="cell grid" id="${x}${y}"></div>`);
                    if (this.cells[x][y] === undefined) 
                        for (let j = 1; j <= 9; j++) cell.append(`<div class="cand hidden" id="${x}${y}-${j}">${j}</div>`);
                    else cell.html(this.cells[x][y]);
                    box.append(cell);
                }
            }
            container.append(box);
        }
    }

    // Initialize the Sudoku
    init() {
        this.clear();

        // Add event listeners
        const self = this;

        $('#btn-clear').click((e) => { 
            e.preventDefault(); 
            this.cells = [];
            for (let i = 0; i < 9; i++) this.cells[i] = [];
            self.clear();
        });
        $('#btn-candidate').click((e) => { e.preventDefault(); self.showCandidates(); });
        $('#btn-solve').click((e) => { e.preventDefault(); self.solve(); });

        $(document).on('click', '.cell', (e) => self.setActiveCell(e.currentTarget.id));
        $(document).keydown((e) => {
            const key = e.keyCode;

            if (key === 49) self.setCell(self.activeCell, 1);
            if (key === 50) self.setCell(self.activeCell, 2);
            if (key === 51) self.setCell(self.activeCell, 3);
            if (key === 52) self.setCell(self.activeCell, 4);
            if (key === 53) self.setCell(self.activeCell, 5);
            if (key === 54) self.setCell(self.activeCell, 6);
            if (key === 55) self.setCell(self.activeCell, 7);
            if (key === 56) self.setCell(self.activeCell, 8);
            if (key === 57) self.setCell(self.activeCell, 9);

            if (key === 8 || key == 46) self.setCell(self.activeCell, 'x');
            if (key >= 37 && key <= 40) self.moveActiveCell(key);
        });
    }
}