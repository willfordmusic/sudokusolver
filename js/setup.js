//Debug, load cells
const cells = [
    [6, undefined, undefined, undefined, 1, undefined, 5],
    [undefined, 1, 8, undefined, 3],
    [undefined, undefined, undefined, undefined, 4, 8, 2],
    [undefined, 9, undefined, undefined, undefined, 6],
    [5, undefined, 4, undefined, undefined, undefined, 3, undefined, 8],
    [undefined, undefined, undefined, 3, undefined, undefined, undefined, 2],
    [undefined, undefined, 2, 7, 9],
    [undefined, undefined, undefined, undefined, 5, undefined, 1, 3],
    [undefined, undefined, 7, undefined, 6, undefined, undefined, undefined, 2],
]; // Performance: ~790ms

const sudoku = new Sudoku(cells);
sudoku.init();