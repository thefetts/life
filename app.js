class Life {
  constructor() {
    this.x = 30;
    this.y = 50;
    this.grid = [];
    this.interval = null;

    this.buildGrid();
    this.initHandlers();
  }

  buildGrid() {
    let queryString = window.location.search;

    if (queryString)
      this.decodeGrid(queryString.replace('?', ''));
    else
      this.resetGrid();

    this.displayGrid();
  }

  decodeGrid(data) {
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
  }

  displayGrid() {
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
    this.generateCode();
    this.resetGridHandlers();
  }

  generateCode() {
    let data = '',
      run = 0,
      runningState = true;

    this.grid.forEach(row => {
      row.forEach(state => {
        if (state === runningState) {
          if (++run > 35) {
            data += 'z0';
            run = 1;
          }
        } else {
          data += run.toString(36);
          run = 1;
          runningState = !runningState;
        }
      })
    });
    data += run.toString(36);

    const l = window.location;
    document.querySelector('#link').value = `${l.protocol}//${l.hostname}${`:${l.port}` || ''}${l.pathname}?${data}`;
  }

  resetGrid() {
    this.grid = this.generateGrid((x, y, grid) => grid[x][y] = false);
  }

  resetGridHandlers() {
    const that = this;
    document.querySelectorAll('.cell').forEach(cell =>
      cell.onclick = function () {
        const x = this.dataset.x,
          y = this.dataset.y;
        that.grid[x][y] = !that.grid[x][y];
        this.setAttribute('on', that.grid[x][y]);
        that.generateCode();
      });
  }

  nextGeneration() {
    const g = this.grid;
    this.grid = this.generateGrid((x, y, newGrid) => {
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
    this.displayGrid();
  }

  clear() {
    this.resetGrid();
    this.displayGrid();
  }

  randomize() {
    this.grid = this.generateGrid((x, y, grid) => {
      grid[x][y] = Math.random() < document.querySelector('#percent').value / 100;
    });
    this.displayGrid();
  }

  autoPlay() {
    if (!this.interval) {
      this.interval = setInterval(() => {
        this.nextGeneration();
      }, 50)
    }
  }

  stop() {
    clearInterval(this.interval);
    this.interval = null;
  }

  initHandlers() {
    document.querySelector('#nextGeneration').onclick = this.nextGeneration.bind(this);
    document.querySelector('#clear').onclick = this.clear.bind(this);
    document.querySelector('#randomize').onclick = this.randomize.bind(this);
    document.querySelector('#stop').onclick = this.stop.bind(this);
    document.querySelector('#autoPlay').onclick = this.autoPlay.bind(this);
  }

  generateGrid(fun) {
    const newGrid = [];
    for (let i = 0; i < this.x; i++) {
      newGrid[i] = [];
      for (let j = 0; j < this.y; j++) {
        fun(i, j, newGrid);
      }
    }
    return newGrid;
  }
}

(() => {
  new Life();
})();
