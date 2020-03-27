class Heap {
  constructor () {
    this.heap = [];
    this.indexes = [];
  }

  insert (square) {
    if (! this.indexes.includes(square.index)) {
      this.indexes.push(square.index);
      this.heap.push(square);

      this.siftUp(this.heap.length - 1);
    }
  }

  remove () {
    this.swap(0, this.heap.length - 1);

    const square = this.heap.pop();
    this.siftDown();
    return square;
  }

  siftUp (i) {
    let par = Math.floor((i - 1) / 2);

    while (i > 0 && this.heap[i].f < this.heap[par].f) {
      this.swap(i, par);
      i = par;
      par = Math.floor((i - 1) / 2);
    }
  }

  siftDown (i = 0) {
    let l = i * 2 + 1;

    while (l < this.heap.length - 1) {
      const r = i * 2 + 2 < this.heap.length ? i * 2 + 2 : -1;
      let swp;
      if (r !== -1 && this.heap[r].f < this.heap[l].f) {
        swp = r;
      } else {
        swp = l;
      }

      if (this.heap[swp].f <= this.heap[i].f) {
        this.swap(i, swp);
        i = swp;
        l = i * 2 + 1;
      } else {
        return;
      }
    }
  }

  swap (i, j) {
    const tmp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = tmp;
  }
}
