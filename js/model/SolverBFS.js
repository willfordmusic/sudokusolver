class Queue {
    constructor() { this.data = []; }
    enqueue(x)  { this.data.push(x); }
    dequeue() { return this.data.shift(); }
    isEmpty() { return this.data.length === 0; }
}

class SolverBFS {
    constructor(sudoku) {
        this.sudoku = sudoku;
        this.solution;
    }

    solve() {
        const startTime = performance.now();
        this.sudoku.updateCells();

        this.BFS();

        if (this.solution === undefined) {
            this.sudoku.showCandidates();
            console.log('Sudoku could not be solved! :(');
        } else {
            this.sudoku = this.solution;
            this.sudoku.clear();
            console.log(`Sudoku solved in ${Math.floor(performance.now() - startTime)}ms`);
        }
    }

    getFirstEmptyCell(node) {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (node.isEmpty(x, y)) return { x: x, y: y };
            }
        }
    }

    isSolved(node) {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (node.isEmpty(x, y)) return false;
            }
        }
        return true;
    }

    isSolvable(node) {
        node.updateCandidates();
        for (let x = 0; x < 9; x++)
            for (let y = 0; y < 9; y++)
                if (node.candidates[x][y].filter(i => i === 1).length === 0) return false;
        return true;
    }

    BFS() {
        const queue = new Queue();
        queue.enqueue(new Sudoku(this.sudoku.cells));

        while (!queue.isEmpty() && this.solution === undefined) {
            const node = queue.dequeue();
            if (this.isSolved(node)) this.solution = node;
            else {
                const cell = this.getFirstEmptyCell(node);
                const cand = node.getCandidates(cell.x, cell.y);
                cand.map((c, i) => {
                    if (c == 1) {
                        const child = new Sudoku(node.cells);
                        child.cells[cell.x][cell.y] = i;
                        if (this.isSolvable(child)) queue.enqueue(child);
                    }
                });
            }
        }
    }
}