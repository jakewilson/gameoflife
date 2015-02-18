var     gridWidth  = 100,
        gridHeight = 100,
        cellWidth  = 4,
        cellHeight = 4,
        grid, // the grid
        context, // the drawing context
        stopStepping = false,
        aliveCells = []; // list for holding all cells that will be alive on the next time step

function Cell(x, y, alive, infected) {
        this.x = x;
        this.y = y;
        this.w = cellWidth;
        this.h = cellHeight;
        this.a = alive;
        this.i = infected;
        this.draw = function(ctx) {
                if (this.a) {
                        ctx.fillStyle = 'rgb(200, 200, 200)';
                } else {
                        ctx.fillStyle = 'rgb(0, 0, 0)';
                }
                ctx.fillRect(this.x * this.w, this.y * this.h, this.w, this.h);
        };
}

function Grid(w, h) {
        this.count = 0;
        this.w = w;
        this.h = h;
        this.init = function() {
                this.grid = [];
                for (var i = 0; i < h; i++) {
                        this.grid[i] = [];
                        for (var j = 0; j < w; j++) {
                                this.grid[i][j] = new Cell(j, i, false, false);
                        }
                }
                // turn on 70 random cells
                for (var i = 0; i < 70; i++)
                        this.grid[Math.floor(Math.random() * h)][Math.floor(Math.random() * w)].a = true;
        };

        this.draw = function(ctx) {
                for (var i = 0; i < h; i++) {
                        for (var j = 0; j < w; j++) {
                                this.grid[i][j].draw(ctx);
                        }
                }
        };

        this.step = function(ctx) {
                var nextGen = [], i, j;
                for (i = 0; i < h; i++) {
                        nextGen[i] = [];
                        for (j = 0; j < w; j++) {
                                if (next(this.grid[i][j])) {
                                        aliveCells.push(this.grid[i][j]);
                                }
                        }
                }
                console.log('done computing next');
                for (i = 0; i < h; i++) {
                        for (j = 0; j < w; j++) {
                            this.grid[i][j].a = nextGen[i][j];
                        }
                }
                this.draw(ctx);
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
                            nbrs += (grid.grid[i][j].a && (i != cell.y || j != cell.x)) ? 1 : 0;
                        }
                }
        }
        if (cell.a) {
            return nrbs === 2 || nbrs === 3;
        } else {
            return nbrs === 3;
        }
}

/**
 * Returns true if the index (i, j) is out of bounds.
 */
function outOfBounds(i, j) {
    return (i < 0 || i >= gridHeight) || (j < 0 || j >= gridWidth);
}

// Simulates one time step
function step() {
   grid.step(context);
}

// Contionuously steps until the user clicks 'stop'
function start() {
    stopStepping = false;
    var i = 0;
    while (i < 10) {
        setTimeout(step(), 200);
        i++;
    }
}

function stop() {
    stopStepping = true;
}

function init() {
        var canvas = document.createElement('canvas');
        canvas.width  = gridWidth * cellWidth;
        canvas.height  = gridHeight * cellHeight;
        document.body.appendChild(canvas);
        context = canvas.getContext('2d');
        grid = new Grid(gridWidth, gridHeight);
        grid.init();
        grid.draw(context);
        var i = 0;
}

init();
