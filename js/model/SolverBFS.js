class Queue {
    constructor() { this.data = []; }
    enqueue(x)  { this.data.push(x); }
    dequeue() { return this.data.shift(); }
    isEmpty() { return this.data.length === 0; }
}

class SolverBFS {
    constructor(sudoku) {
        this.sudoku = sudoku;
    }

    solve() {
        let solution;
        const queue = new Queue();
        queue.enqueue(new Sudoku(this.sudoku.cells));

        while (!queue.isEmpty() && solution === undefined) {
            const node = queue.dequeue();
            if (node.isSolved()) solution = node.cells;
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

        return solution;
    }

    getFirstEmptyCell(node) {
        for (let x = 0; x < 9; x++) {
            const pos = node.cells[x].indexOf(0);
            if (pos >= 0) return { x: x, y: pos };
        }
    }

    isSolvable(node) {
        node.updateCandidates();
        for (let x = 0; x < 9; x++)
            for (let y = 0; y < 9; y++)
                if (node.candidates[x][y].filter(i => i === 1).length === 0) return false;
        return true;
    }
}