class Sudoku {
    constructor(cells) {
        this.activeCell = 'x';

        this.candidates = [];
        for (let i = 0; i < 9; i++) {
            this.candidates.push([]);
            for (let j = 0; j < 9; j++) this.candidates[i].push([0, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
        }

        if (cells === undefined) {
            this.cells = [];
            for (let i = 0; i < 9; i++) this.cells.push([0, 0, 0, 0, 0, 0, 0, 0, 0]);
        } else this.cells = JSON.parse(JSON.stringify(cells));
    }

    // Solve the sudoku using a solver object
    solve() {
        const startTime = performance.now();
        this.updateCells();
        const solution = new SolverBFS(this).solve();

        if (solution === undefined) {
            this.showCandidates();
            $('#message').text('Sudoku could not be solved! :(');
        } else {
            this.cells = solution;
            this.clear();
            $('#message').text(`Sudoku solved in ${Math.floor(performance.now() - startTime)}ms`);
        }
    }

    // Returns bool if the sudoku is solved
    isSolved() {
        for (let x = 0; x < 9; x++) 
            for (let y = 0; y < 9; y++)
                if (this.cells[x][y] === 0) return false;
        return true;
    }

    // Generate all possible candidates
    updateCandidates() {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                this.candidates[x][y] = this.getCandidates(x, y);
            }
        }
    }

    // Generates candidates for a cell on coordinate (x, y)
    getCandidates(x, y) {
        let cand;
        if (this.cells[x][y] === 0) {
            cand = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1];
                
            for (let i = 1; i <= 9; i++) {
    
                // Check Horizontal and Vertical Rows
                let found = false;
                for (let j = 0; j < 9 && !found; j++) if (this.cells[j][y] === i || this.cells[x][j] === i) found = true;
    
                // Check Boxes
                for (let dx = Math.floor(x / 3) * 3; dx < Math.floor(x / 3) * 3 + 3 && !found; dx++) 
                    for (let dy = Math.floor(y / 3) * 3; dy < Math.floor(y / 3) * 3 + 3 && !found; dy++) 
                        if (this.cells[dx][dy] === i) found = true;
    
                if (found) cand[i] = 0; 
            }
        } else {
            cand = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            cand[this.cells[x][y]] = 1;
        }

        return cand;
    }

    // Updates the cells member variable with what is seen in the UI
    updateCells() {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if ($(`#${x}${y}`).text().length === 1) 
                    this.cells[x][y] = parseInt($(`#${x}${y}`).text());
                else this.cells[x][y] = 0;
            }
        }
    }

    // FRONTEND FUNCTIONS

    // Show the saved candidates
    showCandidates() {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                for (let i = 1; i <= 9; i++) {
                    if (this.candidates[x][y][i] == 1) $(`#${x}${y}-${i}`).removeClass('hidden');
                    else $(`#${x}${y}-${i}`).addClass('hidden');
                }
            }
        }
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
    setCell(val = 'x') {
        if (val === 'x') this.insertCandidates(this.activeCell);
        else $(`#${this.activeCell}`).html(val);
    }

    // Clears content of a cell and fills it with a hidden candidate grid
    insertCandidates(cell) {
        const appendTo = $(`#${cell}`).empty();
        for (let j = 1; j <= 9; j++) appendTo.append(`<div class="cand hidden" id="${cell}-${j}">${j}</div>`);
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
                    if (this.cells[x][y] === 0) 
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
        $('#btn-candidate').click((e) => { 
            e.preventDefault(); 
            self.updateCells();
            self.updateCandidates();
            self.showCandidates();
        });
        $('#btn-solve').click((e) => { 
            e.preventDefault();
            self.solve();
        });

        $(document).on('click', '.cell', (e) => self.setActiveCell(e.currentTarget.id));
        $(document).keydown((e) => {
            const key = e.keyCode;

            if (key === 49) self.setCell(1);
            if (key === 50) self.setCell(2);
            if (key === 51) self.setCell(3);
            if (key === 52) self.setCell(4);
            if (key === 53) self.setCell(5);
            if (key === 54) self.setCell(6);
            if (key === 55) self.setCell(7);
            if (key === 56) self.setCell(8);
            if (key === 57) self.setCell(9);
            if (key === 8 || key === 46 || key === 32) self.setCell();
            if (key >= 37 && key <= 40) self.moveActiveCell(key);
        });
    }
}