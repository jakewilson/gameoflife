var     gridWidth  = 200,
        gridHeight = 100,
        cellWidth  = 5,
        cellHeight = 5,
        alivePercentage = 0,
        canvas,
        grid, // the grid
        context, // the drawing context
        running = false,
        isMouseDown = false,
        state = {
            ALIVE: 0,
            DEAD:  1
        },
        fillStyles = ['rgb(200, 200, 200)', 'rgb(0, 0, 0)'],
        intervalID, // the id for the drawing interval
        waitTime, // time in between draws in milliseconds
        aliveCells = []; // list for holding all cells that will be alive on the next time step

function Cell(x, y, alive) {
        this.x = x;
        this.y = y;
        this.w = cellWidth;
        this.h = cellHeight;
        this.a = alive;
        this.draw = function() {
                context.fillStyle = fillStyles[this.a];
                context.fillRect(this.x * this.w, this.y * this.h, this.w, this.h);
        };
        this.toggle = function() {
            this.a = this.a === state.ALIVE ? state.DEAD : state.ALIVE;
        }
}

function Grid(w, h, ctx) {
        this.count = 0;
        this.w = w;
        this.h = h;
        this.ctx = ctx;
        this.me = this;
        this.init = function() {
                this.grid = [];
                for (var i = 0; i < this.h; i++) {
                        this.grid[i] = [];
                        for (var j = 0; j < this.w; j++) {
                                this.grid[i][j] = new Cell(j, i, state.DEAD);
                        }
                }
                // turns on 'alivePercentage' percent of cells
                for (var i = 0; i < Math.floor(this.w * this.h * (alivePercentage / 100.0)); i++)
                        this.grid[Math.floor(Math.random() * h)][Math.floor(Math.random() * w)].a = state.ALIVE;
        };

        this.draw = function() {
                for (var i = 0; i < grid.h; i++) {
                        for (var j = 0; j < grid.w; j++) {
                                grid.grid[i][j].draw(ctx);
                        }
                }
        };

        // moves the grid forward one time step
        this.step = function() {
                var nextGen = [], i, j;
                for (i = 0; i < grid.h; i++) {
                        nextGen[i] = [];
                        for (j = 0; j < grid.w; j++) {
                                if ((nextGen[i][j] = next(grid.grid[i][j]))) {
                                        aliveCells.push(grid.grid[i][j]);
                                }
                        }
                }
                for (i = 0; i < grid.h; i++) {
                        for (j = 0; j < grid.w; j++) {
                            grid.grid[i][j].a = nextGen[i][j];
                        }
                }
               grid.draw();
        };

}

/**
 * Returns the state of a cell in the next generation
 */
function next(cell) {
        var nbrs = 0;
        for (var i = cell.y - 1; i <= cell.y + 1; i++) {
                for (var j = cell.x - 1; j <= cell.x + 1; j++) {
                       if (!outOfBounds(i, j)) { 
                            nbrs += ((grid.grid[i][j].a === state.ALIVE) && (i != cell.y || j != cell.x)) ? 1 : 0;
                        }
                }
        }
        if (cell.a === state.ALIVE) {
            return (nbrs === 2 || nbrs === 3) ? state.ALIVE : state.DEAD;
        } else {
            return (nbrs === 3) ? state.ALIVE : state.DEAD;
        }
}

/**
 * Returns true if the index (i, j) is out of bounds.
 */
function outOfBounds(i, j) {
    return (i < 0 || i >= gridHeight) || (j < 0 || j >= gridWidth);
}

function step() {
    grid.step();
}

function toggle() {
    running = !running;
    if (running) {
        intervalID = setInterval(grid.step, waitTime);
        document.getElementById('toggle').innerHTML = 'Stop';
    } else {
        clearInterval(intervalID);
        document.getElementById('toggle').innerHTML = 'Start';
    }
}

function mousedown(e) {
    var canvasX = e.pageX - canvas.offsetLeft, canvasY = e.pageY - canvas.offsetTop;
    var cellY = Math.floor(canvasY / cellHeight), cellX = Math.floor(canvasX / cellWidth);
    cell = grid.grid[cellY][cellX];
    isMouseDown = true;
    cell.toggle();
    cell.draw();
}

function mouseup(e) {
    isMouseDown = false;
}

function mousemove(e) {
    if (isMouseDown) {
        mousedown(e);
    }
}

function init() {
        canvas = document.getElementById('canvas');
        canvas.width  = gridWidth * cellWidth;
        canvas.height = gridHeight * cellHeight;
        canvas.addEventListener('mousedown', mousedown, false);
        canvas.addEventListener('mouseup', mouseup, false);
        canvas.addEventListener('mouseout', mouseup, false);
        canvas.addEventListener('mousemove', mousemove, false);
        context = canvas.getContext('2d');
        waitTime = 500;
        grid = new Grid(gridWidth, gridHeight, context);
        grid.init();
        grid.draw();
}
