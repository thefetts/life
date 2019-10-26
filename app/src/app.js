(() => {
  const life = new Life();

  ['stop', 'autoPlay'].forEach(action =>
    document.querySelector(`#${action}`).onclick = life[action].bind(life));

  ['randomize', 'clear', 'nextGeneration'].forEach(action =>
    document.querySelector(`#${action}`).onclick = life.grid[action].bind(life.grid));
})();
