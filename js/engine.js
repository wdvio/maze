window.onload = () => {
  const game = new Game(30, 60);

  new KeyBindings(game);
};

class Game {
  constructor (h = 20, w = 20) {
    this.h = h;
    this.w = w;

    this.reset();
  }

  reset () {
    this.grid = new Grid(this.h, this.w);
    this.heap = new Heap();

    this.current = { row: 0, col: Math.floor(Math.random(0, 1) * this.w) };
    this.start = { row: this.current.row, col: this.current.col };
    this.end = { row: this.h - 1, col: Math.floor(Math.random(0, 1) * this.w) };

    // this.current = { row: 9, col: 0 };
    // this.start = { row: this.current.row, col: this.current.col };
    // this.end = { row: this.h - 1, col: this.w - 1 };

    this.grid.getSquare(this.start.row, this.start.col).setAs('start');
    this.grid.getSquare(this.end.row, this.end.col).setAs('end');
  }

  advance (instant = false) {
    const square = this.grid.getSquare(this.current.row, this.current.col);

    if (square.type === 'end') {
      let [r, c] = square.parent;

      while (this.grid.getSquare(r, c).parent) {
        let curr = this.grid.getSquare(r, c);

        View.setColor(curr.row, curr.col, 'current');

        [r, c] = curr.parent;
      }

      return;
    }

    if (square.type !== 'start') {
      square.setAs('visited');
    }

    for (const neighbor of this.grid.getNeighbors(this.current)) {
      neighbor.g = this.calculateManhattanDistance(neighbor.row, neighbor.col, this.start.row, this.start.col);
      neighbor.h = this.calculateManhattanDistance(neighbor.row, neighbor.col, this.end.row, this.end.col);

      // neighbor.g = this.calculateEuclideanDistance(neighbor.row, neighbor.col, this.start.row, this.start.col);
      // neighbor.h = this.calculateEuclideanDistance(neighbor.row, neighbor.col, this.end.row, this.end.col);

      neighbor.f = neighbor.g + neighbor.h;

      if (neighbor.parent === null) {
        neighbor.setParent(this.current.row, this.current.col);
      }

      this.heap.insert(neighbor);

      if (neighbor.type !== 'end') {
        View.setText(neighbor.row, neighbor.col, neighbor.f);
      }
    }

    if (this.heap.heap.length === 0) {
      return;
    }

    const nextSquare = this.heap.remove();
    this.current.row = nextSquare.row;
    this.current.col = nextSquare.col;

    if (nextSquare.type !== 'end') {
      nextSquare.setAs('current');
    }

    if (instant) {
      this.advance(true);
    }
  }

  calculateEuclideanDistance (fromRow, fromCol, toRow, toCol) {
    return (fromRow - toRow) ** 2 + (fromCol - toCol) ** 2;
  }

  calculateManhattanDistance (fromRow, fromCol, toRow, toCol) {
    return Math.abs(fromRow - toRow) + Math.abs(fromCol - toCol);
  }
}

class Square {
  constructor (index, row, col) {
    this.index = index;
    this.row = row;
    this.col = col;

    this.g = null;
    this.h = null;
    this.f = null;
    this.parent = null;

    this.setAs('open');
  }

  setAs (type) {
    const types = ['open', 'wall', 'start', 'end', 'visited', 'current'];

    if (types.includes(type)) {
      this.type = type;

      View.setColor(this.row, this.col, type);
    }
  }

  setParent (row, col) {
    this.parent = [row, col];
  }
}

class Grid {
  constructor (h, w, saturation = 35) {
    this.h = h;
    this.w = w;
    this.saturation = saturation;

    View.renderElements(h, w)

    this.grid = [];

    this.generateGrid();
    this.generateRandomWalls();
    // this.generateHardCodedWalls();
  }

  generateGrid () {
    for (let row = 0; row < this.h; row++) {
      this.grid.push([]);

      for (let col = 0; col < this.w; col++) {
        const index = (row * this.w) + col;

        this.grid[row].push(new Square(index, row, col));
      }
    }
  }

  generateRandomWalls () {
    for (let row = 0; row < this.h; row++) {
      for (let col = 0; col < this.w; col++) {
        if (Math.round(Math.random(0, 1) * 100) < this.saturation) {
          this.grid[row][col].setAs('wall');
        }
      }
    }
  }

  generateHardCodedWalls () {
    for (let row = 1; row < this.h - 1; row++) {
      this.grid[row][9].setAs('wall');
    }

    for (let row = 1; row < this.h; row++) {
      this.grid[row][18].setAs('wall');
    }
  }

  getNeighbors ({ row, col }) {
    const neighbors = [];

    for (let i = 0; i < 4; i++) {
      const newRow = row + [-1, 0, 1, 0][i];
      const newCol = col + [0, 1, 0, -1][i];

      if (newRow < 0 || newCol < 0 || newRow >= this.h || newCol >= this.w) {
        continue;
      }

      if (['open', 'end'].includes(this.grid[newRow][newCol].type)) {
        neighbors.push(this.grid[newRow][newCol]);
      }
    }

    return neighbors;
  }

  getSquare (row, col) {
    return this.grid[row][col];
  }
}

class View {
  static ref = document.getElementById('7d552c');

  static renderElements (h, w) {
    this.ref.innerHTML = null;

    for (let i = 0; i < h; i++) {
      const el = this.ref.appendChild(Object.assign(document.createElement('div'), { className: 'flex justify-between' }));

      for (let j = 0; j < w; j++) {
        el.appendChild(document.createElement('div'));
      }
    }
  }

  static setText (row, col, content) {
    this.ref.childNodes[row].childNodes[col].textContent = content;
  }

  static setColor (row, col, type) {
    this.ref.childNodes[row].childNodes[col].className = 'node';

    if (['open', 'wall', 'start', 'end', 'current', 'visited'].includes(type)) {
      this.ref.childNodes[row].childNodes[col].classList.add(type);
    }
  }
}

class KeyBindings {
  constructor (game) {
    document.onkeydown = e => {
      switch (e.keyCode) {
        case 65:
          game.advance();
          break;
        case 67:
          game.advance(true);
          break;
        case 82:
          game.reset();
          break;
      }
    };
  }
}