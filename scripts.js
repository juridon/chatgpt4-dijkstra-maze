class Maze {
  constructor(element, width, height) {
    this.element = element;
    this.width = width;
    this.height = height;
    this.cells = [];
    this.start = { x: 1, y: 1 };
    this.end = { x: width - 3, y: height - 3 };
  }

  create() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.x = x;
        cell.dataset.y = y;

        if (x === this.start.x && y === this.start.y) {
          cell.classList.add('start');
        } else if (x === this.end.x && y === this.end.y) {
          cell.classList.add('end');
        }

        this.cells.push(cell);
        this.element.appendChild(cell);
      }
    }
  }


generate() {
  // 棒倒し法で迷路を生成
  for (let y = 1; y < this.height - 1; y += 2) {
    for (let x = 1; x < this.width - 1; x += 2) {
      const cell = this.getCell(x, y);
      cell.classList.remove('cell');

      const directions = [
        { dx: 0, dy: -2 },
        { dx: 2, dy: 0 },
        { dx: 0, dy: 2 },
        { dx: -2, dy: 0 },
      ];

      if (y === 1) {
        directions.splice(0, 1); // 上方向を削除
      } else if (y === this.height - 2) {
        directions.splice(2, 1); // 下方向を削除
      }

      if (x === 1) {
        directions.splice(3, 1); // 左方向を削除
      } else if (x === this.width - 2) {
        directions.splice(1, 1); // 右方向を削除
      }

      const dir = directions[Math.floor(Math.random() * directions.length)];
      this.getCell(x + dir.dx, y + dir.dy).classList.remove('cell');
      this.getCell(x + dir.dx / 2, y + dir.dy / 2).classList.remove('cell');
    }
  }
}


  getCell(x, y) {
    return this.cells[y * this.width + x];
  }

  setVisited(x, y) {
    this.getCell(x, y).classList.add('visited');
  }

  setPath(x, y) {
    this.getCell(x, y).classList.add('path');
  }
}


function solveMaze() {
  const dx = [0, 1, 0, -1];
  const dy = [-1, 0, 1, 0];

  const distance = Array.from({ length: maze.height }, () =>
    Array(maze.width).fill(Infinity)
  );

  distance[maze.start.y][maze.start.x] = 0;
  const queue = [maze.start];

  while (queue.length > 0) {
    queue.sort((a, b) => distance[a.y][a.x] - distance[b.y][b.x]);
    const current = queue.shift();
    const x = current.x;
    const y = current.y;

    if (x === maze.end.x && y === maze.end.y) {
      break;
    }

    if (maze.getCell(x, y).classList.contains('visited')) {
      continue;
    }

    maze.setVisited(x, y);

    for (let i = 0; i < 4; i++) {
      const nx = x + dx[i];
      const ny = y + dy[i];

      if (
        nx >= 0 &&
        nx < maze.width &&
        ny >= 0 &&
        ny < maze.height &&
        !maze.getCell(nx, ny).classList.contains('cell') &&
        distance[y][x] + 1 < distance[ny][nx]
      ) {
        distance[ny][nx] = distance[y][x] + 1;
        queue.push({ x: nx, y: ny });
      }
    }
  }

  if (distance[maze.end.y][maze.end.x] === Infinity) {
    console.log('経路が見つかりませんでした。');
    return;
  }

  let x = maze.end.x;
  let y = maze.end.y;

  while (x !== maze.start.x || y !== maze.start.y) {
    for (let i = 0; i < 4; i++) {
      const nx = x - dx[i];
      const ny = y - dy[i];

      if (
        nx >= 0 &&
        nx < maze.width &&
        ny >= 0 &&
        ny < maze.height &&
        distance[ny][nx] === distance[y][x] - 1
      ) {
        x = nx;
        y = ny;
        maze.setPath(x, y);
        break;
      }
    }
  }
}





const mazeElement = document.querySelector('#maze');
const maze = new Maze(mazeElement, 10, 10);
maze.create();
maze.generate();

const btn = document.getElementById('solve');
btn.addEventListener('click',solveMaze);
