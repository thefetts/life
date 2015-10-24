function Life() {
	this.grid = [];

	this.x = 30;
	this.y = 50;

	this.init();
}

Life.prototype.init = function() {
	this.initHandlers();

	if(window.location.search) {
		this.grid = this.decodeGrid(window.location.search.replace('?',''));
		this.generateCode(this.grid);
	} else {
		this.grid = this.makeGrid(this.x, this.y);
	}
	this.displayGrid(this.grid);
};

Life.prototype.initHandlers = function() {
	var that = this;
	$('#grid').on('click', '.cell', function() {
		var ids = $(this).attr('id').split('-');
		var x = ids[1];
		var y = ids[2];
		that.grid[x][y] = !that.grid[x][y];
		$(this).attr('on', that.grid[x][y]);
		that.generateCode(that.grid);
	});

	$('#nextGeneration').click(function() {
		that.nextGeneration();
	});

	$('#autoPlay').click(function() {
		that.autoPlay();
	});

	$('#stop').click(function() {
		that.stop();
	});

	$('#randomize').click(function() {
		that.randomize();
	});

	$('#clear').click(function() {
		that.clear();
	});
};

Life.prototype.autoPlay = function() {
	if(!this.interval) {
		$('#status').text('Playing').removeClass('stopped');
		var that = this;
		this.interval = setInterval(function() {
			that.nextGeneration();
		}, 50);
		console.log(this.interval);
	}
};

Life.prototype.clear = function() {
	this.stop();
	this.grid = this.makeGrid(this.x, this.y);
	this.displayGrid(this.grid);
};

Life.prototype.decodeGrid = function(data) {
	var value = true;
	var grid = [];
	var counter = 0;
	var row = 0;
	var that = this;
	data.split('').forEach(function(digit) {
		var num = parseInt(digit, 36);
		for(var i = 0; i < num; i++) {
			if(counter === 0) {
				grid[row] = [];
			}

			grid[row][counter] = value;
			counter++;

			if(counter === that.y) {
				counter = 0;
				row++;
			}
		}
		value = value === false ? true : false;
	});

	return grid;
};

Life.prototype.displayGrid = function(grid) {
	var html = '';

	for(var i = 0; i < this.x; i++) {
		var row = grid[i] || [];
		html += '<div class="row" id="row'+i+'">';
		for(var j = 0; j < this.y; j++) {
			var cell = row[j] || 0;
			html += '<div class="cell" id="cell-'+i+'-'+j+'"'+(cell?' on="true"':'')+'></div>';
		}
		html += '</div>';
	}
	$('#grid').html(html);
	this.generateCode(this.grid);
};

Life.prototype.generateCode = function(grid) {
	var data = '';
	var run = 0;
	var value = true;
	for(var i in grid) {
		var row = grid[i];
		for(var j in row) {
			if(row[j] === value) {
				run++;

				if(run > 35) {
					data += 'z0';
					run = 1;
				}
			} else {
				data += run.toString(36);
				run = 1;
				value = value === true ? false : true;
			}
		}
	}
	data += run.toString(36);

	$('#link').val('http://jerryfallon.com/life?'+data);
};

Life.prototype.makeGrid = function(x, y) {
	var grid = [];
	for(var i = 0; i < x; i++) {
		grid[i] = [];
		for(var j = 0; j < y; j++) {
			grid[i][j] = false;
		}
	}
	return grid;
};

Life.prototype.nextGeneration = function() {
	var newGrid = [];

	for(var i = 0; i < this.grid.length; i++) {
		var row = this.grid[i];
		var newRow = [];

		for(var j = 0; j < row.length; j++) {
			var cell = row[j];
			var livingNeighbors = 0;

			// Check row above this one
			if(i > 0) {
				var previousRow = this.grid[i-1];
				if(j > 0 && previousRow[j-1]) {
					livingNeighbors++;
				}
				if(previousRow[j]) {
					livingNeighbors++;
				}
				if(j < row.length-1 && previousRow[j+1]) {
					livingNeighbors++;
				}
			}

			// Check our current row
			if(j > 0 && row[j-1]) {
				livingNeighbors++;
			}
			if(j < row.length-1 && row[j+1]) {
				livingNeighbors++;
			}

			// Check row below this one
			if(i < this.grid.length-1) {
				var nextRow = this.grid[i+1];
				if(j > 0 && nextRow[j-1]) {
					livingNeighbors++;
				}
				if(nextRow[j]) {
					livingNeighbors++;
				}
				if(j < row.length-1 && nextRow[j+1]) {
					livingNeighbors++;
				}
			}

			if(livingNeighbors === 2) {
				newRow[j] = cell;
			} else if(livingNeighbors === 3) {
				newRow[j] = true;
			} else {
				newRow[j] = false;
			}
		}
		newGrid[i] = newRow;
	}
	this.grid = newGrid;
	this.displayGrid(this.grid);
};

Life.prototype.makeRandomGrid = function(percent) {
	percent = percent/100;
	var grid = [];
	for(var i = 0; i < this.x; i++) {
		grid[i] = [];
		for(var j = 0; j < this.y; j++) {
			if(Math.random() <= percent) {
				grid[i][j] = true;
			} else {
				grid[i][j] = false;
			}
		}
	}
	return grid;
};

Life.prototype.randomize = function() {
	this.stop();
	var percent = $('#percent').val();
	this.grid = this.makeRandomGrid(percent);
	this.displayGrid(this.grid);
};

Life.prototype.stop = function() {
	if(this.interval) {
		$('#status').text('Stopped').addClass('stopped');
		clearInterval(this.interval);
		this.interval = undefined;
	}
};

$(document).ready(function() {
	var life = new Life();
});
