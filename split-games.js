const LineReader = require('linereader');

const lr = new LineReader('./blackkbn-2021-04.pgn')

const prefixes = ['Site', 'White ', 'Black ', 'Result', 'WhiteElo', 'BlackElo', 'Termination'];

const unfilteredGames = [];
let filteredGames = [];
let gamesCollect = [];

const checkmates = [];
const notCheckmates = [];

// On error in reading the file
lr.on('error', function (err) {
  console.log(err);
  lr.close();
});

// Each line
lr.on('line', function (lineno, line) {
  // Filters the line for the useful information
  if (prefixes.some(word => line.includes(word))) {
    // Collects a single game in an array
    gamesCollect.push(line);

    // Checks if it is the end of the single game PGN
    if (line.includes('Termination')) {
      // Adds game array to list of arrays
      unfilteredGames.push(gamesCollect);
      // Resets game collection array
      gamesCollect = [];
    }
  }
});

// If all lines have been read
lr.on('end', function () {
  // Filters the games for Normal termination
  filteredGames = unfilteredGames.filter(thisGame => thisGame.includes('[Termination "Normal"]'));

  // Iterates through the games with normal termination
  for (game of filteredGames) {
    if (game[3] == '[Result "1-0"]') {

    } else {
      const rating = parseInt(game[5].slice(11, -2));
      notCheckmates.push([rating, 0]);
    }
  }

});