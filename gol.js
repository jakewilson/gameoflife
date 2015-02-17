var     gridWidth  = 30,
        gridHeight = 20,
        cellWidth  = 8,
        cellHeight = 8,
        grid, // the grid
        context; // the drawing context

function Cell(x, y, alive, infected) {
        this.x = x;
        this.y = y;
        this.w = cellWidth;
        this.h = cellHeight;
        this.a = alive;
        this.i = infected;
        this.draw = function(ctx) {
                if (this.a) {
                        ctx.fillStyle = 'rgb(255, 255, 255)';
                } else {
                        ctx.fillStyle = 'rgb(0, 0, 0)';
                }
                ctx.fillRect(this.x, this.y, this.w, this.h);
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
                                this.grid[i][j] = new Cell(j * cellWidth, i * cellHeight, false, false);
                        }
                }
                // turn on 70 random cells
                for (var i = 0; i < 70; i++)
                        this.grid[Math.floor(Math.random() * h)][Math.floor(Math.random() * w)].a = true;
        };

        this.draw = function(ctx) {
                for (var i = 0; i < h; i++) {
                        for (var j = 0; j < w; j++) {
try {
                                this.grid[i][j].draw(ctx);
} catch (e) {
    debugger;
    console.log('got one');
}
                        }
                }
        };

        this.step = function(ctx) {
                var nextGen = [], i, j;
                for (i = 0; i < h; i++) {
                        nextGen[i] = [];
                        for (j = 0; j < w; j++) {
                                nextGen[i][j] = next(this.grid[i][j]);
                        }
                }
                for (i = 0; i < h; i++) {
                        nextGen[i] = [];
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
        var alive = 0;
        for (var i = cell.y - 1; i <= cell.y + 1; i++) {
                for (var j = cell.x - 1; j <= cell.x + 1; j++) {
                       if (!outOfBounds(i, j)) { 
                            alive += (grid.grid[i][j].a && (i != cell.y && j != cell.x)) ? 1 : 0;
                        }
                }
        }
        return alive == 2 || (alive == 3 && !cell.a);
}

/**
 * Returns true if the index (i, j) is out of bounds.
 */
function outOfBounds(i, j) {
    return (i < 0 || i >= gridHeight) || (j < 0 || j >= gridWidth);
}

function step() {
   grid.step(context);
}

function start() {
        var canvas = document.createElement('canvas');
        canvas.width  = 300;
        canvas.height = 300;
        document.body.appendChild(canvas);
        context = canvas.getContext('2d');
        grid = new Grid(gridWidth, gridHeight);
        grid.init();
        grid.draw(context);
        var i = 0;
        while (i++ < 10) {
//                grid.step(context);
        }
}

start();
