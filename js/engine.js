window.onload = () => {
  const game = new Game(30, 30);

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
    this.isGameOver = false;

    this.current = { row: 0, col: Math.floor(Math.random(0, 1) * this.w) };
    this.start = this.current;
    this.end = { row: this.h - 1, col: Math.floor(Math.random(0, 1) * this.w) };

    this.grid.getSquare(this.start.row, this.start.col).setStart();
    this.grid.getSquare(this.end.row, this.end.col).setEnd();
  }

  advance (instant = false) {
    if (this.isGameOver) {
      return;
    }

    const square = this.grid.getSquare(this.current.row, this.current.col);

    if (! square.isStart) {
      square.setVisited();
    }

    const neighbors = this.grid.explore(this.current);

    if (neighbors.length === 0 && this.heap.heap.length === 0) {
      this.isGameOver = true;
      return;
    }

    for (const neighbor of neighbors) {
      neighbor.g = this.calculateManhattanDistance(neighbor.row, neighbor.col, this.start.row, this.start.col);
      neighbor.h = this.calculateManhattanDistance(neighbor.row, neighbor.col, this.end.row, this.end.col);
      neighbor.f = neighbor.g + neighbor.h;

      if (neighbor.parent === null) {
        neighbor.setParent(this.current.row, this.current.col);
      }

      this.heap.insert(neighbor);

      if (! neighbor.isEnd) {
        View.setText(neighbor.row, neighbor.col, neighbor.f);
      }
    }

    const nextSquare = this.heap.remove();

    this.current.row = nextSquare.row;
    this.current.col = nextSquare.col;

    if (nextSquare.isEnd) {
      let [r, c] = nextSquare.parent;

      while (this.grid.getSquare(r, c).parent) {
        let curr = this.grid.getSquare(r, c);

        View.setColor(curr.row, curr.col, 'current');

        [r, c] = curr.parent;
      }

      this.isGameOver = true;

      return;
    }

    nextSquare.setCurrent();

    if (instant) {
      this.advance(true);
    }
  }

  calculateManhattanDistance (fromRow, fromCol, toRow, toCol) {
    return Math.abs(fromRow - toRow) + Math.abs(fromCol - toCol);
  }
}

class Square {
  constructor (index, row, col) {
    this.f = null;
    this.index = index;

    this.row = row;
    this.col = col;

    this.isStart = false;
    this.isEnd = false;
    this.isWall = false;
    this.isVisited = false;

    this.g = null;
    this.h = null;
    this.parent = null;
  }

  setParent (row, col) {
    this.parent = [row, col];
  }

  setOpen () {
    this.isWall = false;
    this.isVisited = false;

    View.setColor(this.row, this.col);
  }

  setWall () {
    this.isWall = true;

    View.setColor(this.row, this.col, 'wall');
  }

  setVisited () {
    this.isVisited = true;

    View.setColor(this.row, this.col, 'visited');
  }

  setStart () {
    this.setOpen();
    this.isStart = true;
    this.isVisited = true;

    View.setColor(this.row, this.col, 'start');
  }

  setEnd () {
    this.setOpen();
    this.isEnd = true;

    View.setColor(this.row, this.col, 'end');
  }

  setCurrent () {
    View.setColor(this.row, this.col, 'current');
  }
}

class Grid {
  constructor (h, w, saturation = 25) {
    this.h = h;
    this.w = w;
    this.saturation = saturation;

    View.renderElements(h, w)

    this.grid = [];

    this.setOpenSquares();
    this.generateRandomWalls();
  }

  setOpenSquares () {
    for (let row = 0; row < this.h; row++) {
      this.grid.push([]);

      for (let col = 0; col < this.w; col++) {
        const index = (row * this.w) + col;

        this.grid[row].push(new Square(index, row, col));
        this.grid[row][col].setOpen();
      }
    }
  }

  generateRandomWalls () {
    for (let row = 0; row < this.h; row++) {
      for (let col = 0; col < this.w; col++) {
        if (Math.round(Math.random(0, 1) * 100) < this.saturation) {
          this.grid[row][col].setWall();
        }
      }
    }
  }

  explore ({ row, col }) {
    const neighbors = [];

    for (let i = 0; i < 4; i++) {
      const newRow = row + [-1, 0, 1, 0][i];
      const newCol = col + [0, 1, 0, -1][i];

      if (newRow < 0 || newCol < 0 || newRow >= this.h || newCol >= this.w) {
        continue;
      }

      if (this.grid[newRow][newCol].isWall) {
        continue;
      }

      if (this.grid[newRow][newCol].isVisited) {
        continue;
      }

      neighbors.push(this.grid[newRow][newCol]);
    }

    return neighbors;
  }

  getSquare (row, col) {
    return this.grid[row][col];
  }
}

class View {
  static ref = document.getElementById('ae01c4af-9296-4976-9a53-c7b881ebd683');

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

    if (type && ['wall', 'start', 'end', 'current', 'visited'].includes(type)) {
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