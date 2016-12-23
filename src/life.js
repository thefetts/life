class Life {
  constructor() {
    this.interval = null;
    this.grid = new Grid(this.generateCode);

    this.grid.build();
    this.initHandlers();
  }

  generateCode(grid) {
    let data = '',
      run = 0,
      runningState = true;

    grid.forEach(row => {
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

  autoPlay() {
    if (!this.interval) {
      this.interval = setInterval(() => {
        this.grid.nextGeneration();
      }, 50)
    }
  }

  stop() {
    clearInterval(this.interval);
    this.interval = null;
  }

  initHandlers() {
    ['stop', 'autoPlay'].forEach(action =>
      document.querySelector(`#${action}`).onclick = this[action].bind(this));
  }
}
