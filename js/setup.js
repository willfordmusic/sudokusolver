// World's hardest sudoku performance: ~654ms, ~11812 nodes
/*
const cells = [
    [8, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 7, 5, 0, 0, 0, 0, 9],
    [0, 3, 0, 0, 0, 0, 1, 8, 0],
    [0, 6, 0, 0, 0, 1, 0, 5, 0],
    [0, 0, 9, 0, 4, 0, 0, 0, 0],
    [0, 0, 0, 7, 5, 0, 0, 0, 0],
    [0, 0, 2, 0, 7, 0, 0, 0, 4],
    [0, 0, 0, 0, 0, 3, 6, 1, 0],
    [0, 0, 0, 0, 0, 0, 8, 0, 0],
];

const sudoku = new Sudoku(cells);
*/

const sudoku = new Sudoku();
sudoku.init();