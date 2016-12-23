class Grid {
  constructor(cb) {
    this.x = 30;
    this.y = 50;
    this.grid = [];
    this.cb = cb;

    this.initHandlers();
  }

  initHandlers() {
    ['randomize', 'clear', 'nextGeneration'].forEach(action =>
      document.querySelector(`#${action}`).onclick = this[action].bind(this));
  }

  build() {
    let queryString = window.location.search;

    if (queryString)
      this.decode(queryString.substr(1));
    else
      this.clear();
  }

  clear() {
    this.generate((x, y, grid) => grid[x][y] = false);
  }

  decode(data) {
    let state = true,
      grid = [],
      counter = 0,
      row = 0;

    data.split('').forEach(digit => {
      const num = parseInt(digit, 36);
      for (let i = 0; i < num; i++) {
        if (counter === 0)
          grid[row] = [];

        grid[row][counter] = state;

        if (++counter === this.y) {
          counter = 0;
          row++;
        }
      }
      state = !state;
    });

    for (; row < this.x; row++) {
      grid[row] = [];
    }

    this.grid = grid;
    this.display();
  }

  display() {
    let html = '';

    for (let i = 0; i < this.x; i++) {
      const row = this.grid[i] || [];
      html += `<div class="row" id="row${i}">`;
      for (let j = 0; j < this.y; j++) {
        const cell = row[j] || 0;
        html += `<div class="cell" data-x="${i}" data-y="${j}" ${(cell ? 'on="true"' : '')}></div>`;
      }
      html += `</div>`;
    }
    document.querySelector('#grid').innerHTML = html;
    this.resetHandlers();
    this.cb(this.grid);
  }

  nextGeneration() {
    const g = this.grid;
    this.generate((x, y, newGrid) => {
      let neighbors = 0;
      const rowA = g[x - 1],
        rowB = g[x + 1];

      neighbors += (g[x][y - 1] || 0) + (g[x][y + 1] || 0);
      if (rowA)
        neighbors += (rowA[y - 1] || 0) + (rowA[y] || 0) + (rowA[y + 1] || 0);
      if (rowB)
        neighbors += (rowB[y - 1] || 0) + (rowB[y] || 0) + (rowB[y + 1] || 0);

      if (neighbors === 3)
        newGrid[x][y] = true;
      else if (neighbors === 2)
        newGrid[x][y] = g[x][y];
      else
        newGrid[x][y] = false;
    });
  }

  randomize() {
    this.generate((x, y, grid) => {
      grid[x][y] = Math.random() < document.querySelector('#percent').value / 100;
    });
  }

  generate(fun) {
    const newGrid = [];
    for (let i = 0; i < this.x; i++) {
      newGrid[i] = [];
      for (let j = 0; j < this.y; j++) {
        fun(i, j, newGrid);
      }
    }
    this.grid = newGrid;
    this.display();
  }

  resetHandlers() {
    const that = this;
    document.querySelectorAll('.cell').forEach(cell =>
      cell.onclick = function () {
        const x = this.dataset.x,
          y = this.dataset.y;
        that.grid[x][y] = !that.grid[x][y];
        this.setAttribute('on', that.grid[x][y]);
        this.cb(this.grid);
      });
  }
}
