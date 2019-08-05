class Sudoku {
    constructor() {
        this.activeCell = 'x';

        this.cells = [];
        for (let i = 0; i < 9; i++) this.cells[i] = [];

        //Debug, load cells
        /*
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
        */

        this.cells = [
            [undefined, undefined, 4, undefined, 7, undefined, undefined, undefined, 3],
            [6, undefined, 9],
            [undefined, 2, undefined, 1],
            [undefined, undefined, undefined, undefined, 9, undefined, 2],
            [8, undefined, 6, undefined, 3, undefined, undefined, 4, 7],
            [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 5],
            [undefined, 5, undefined, undefined, undefined, 7, 3],
            [undefined, undefined, undefined, undefined, undefined, 2, undefined, 7],
            [undefined, 7, 2, 4, 1, undefined, 9, undefined, 6],
        ]; // ~37ms

        this.candidates = [];
        for (let i = 0; i < 9; i++) {
            this.candidates[i] = [];
            for (let j = 0; j < 9; j++) this.candidates[i][j] = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        }
    }

    // Solve the sudoku using a solver object
    solve() {
        new SolverAI(this).solve();
    }

    // Returns bool if the sudoku is solved
    isSolved() {
        for (let x = 0; x < 9; x++) 
            for (let y = 0; y < 9; y++)
                if (this.cells[x][y] === undefined) return false;
        return true;
    }

    // Generate all possible candidates
    updateCandidates() {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                this.candidates[x][y] = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1];
                
                for (let i = 1; i <= 9; i++) {

                    // Check Horizontal and Vertical Rows
                    let found = false;
                    for (let j = 0; j < 9 && !found; j++) if (this.cells[j][y] === i || this.cells[x][j] === i) found = true;

                    // Check Boxes
                    for (let dx = Math.floor(x / 3) * 3; dx < Math.floor(x / 3) * 3 + 3 && !found; dx++) 
                        for (let dy = Math.floor(y / 3) * 3; dy < Math.floor(y / 3) * 3 + 3 && !found; dy++) 
                            if (this.cells[dx][dy] === i) found = true;

                    if (found) this.candidates[x][y][i] = 0; 
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

            if (key === 49) self.setCell(1);
            if (key === 50) self.setCell(2);
            if (key === 51) self.setCell(3);
            if (key === 52) self.setCell(4);
            if (key === 53) self.setCell(5);
            if (key === 54) self.setCell(6);
            if (key === 55) self.setCell(7);
            if (key === 56) self.setCell(8);
            if (key === 57) self.setCell(9);
            if (key === 8 || key == 46) self.setCell();
            if (key >= 37 && key <= 40) self.moveActiveCell(key);
        });
    }
}