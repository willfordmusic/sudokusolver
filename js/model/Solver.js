class Queue {
    constructor() { this.data = []; }
    enqueue(x)  { this.data.push(x); }
    dequeue() { return this.data.shift(); }
    isEmpty() { return this.data.length === 0; }
}

class Solver {
    constructor(sudoku) {
        this.sudoku = sudoku;
        this.nodes = 0;
    }

    solve() {
        const queue = new Queue();
        queue.enqueue(new Sudoku(this.sudoku.cells));

        while (!queue.isEmpty() && this.nodes < 250000) {
            const node = queue.dequeue();
            if (this.isSolved(node)) return node.cells;
            if (!this.isSolvable(node)) continue;

            const cell = this.getEmptyCell(node);
            const cand = node.candidates[cell.x][cell.y];
            cand.map((c, i) => { if (c === 1) {
                this.nodes++;
                const child = new Sudoku(node.cells);
                child.cells[cell.x][cell.y] = i;
                queue.enqueue(child);
            }});
        }
    }

    isSolvable(node) {
        node.updateCandidates();
        for (let x = 0; x < 9; x++)
            for (let y = 0; y < 9; y++)
                if (node.candidates[x][y].filter(i => i === 1).length === 0) return false;
        return true;
    }

    
    // Returns bool if the sudoku is solved
    isSolved(node) {
        for (let x = 0; x < 9; x++) 
            for (let y = 0; y < 9; y++)
                if (node.cells[x][y] === 0) return false;
        return true;
    }

    // Returns the empty cell with the least amount of candidates on the board
    getEmptyCell(node) {
        let vals = [];
        for (let x = 0; x < 9; x++) {
            const indices = node.cells[x].map((e, i) => e === 0 ? i : '').filter(String);
            vals = vals.concat(indices.map((e) => { return { x: x, y: e, cand: node.candidates[x][e].filter((x) => x === 1).length }; }));
        }
        const best = vals.reduce((min, e) => e.cand < min.cand ? e : min, vals[0]);
        return { x: best.x, y: best.y };
    }
}