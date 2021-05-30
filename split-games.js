const fs = require('fs');
const LineReader = require('linereader');

const lr = new LineReader('./kbn2021-04.txt')

const prefixes = ['Site', 'White ', 'Black ', 'Result', 'WhiteElo', 'BlackElo', 'Termination'];
const winner = ['[Result "1-0"]', '[Result "0-1"]']

const unfilteredGames = [];
let filteredGames = [];
let gamesCollect = [];

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
  // Filters the games for Normal termination, and a result of either 1-0 or 0-1
  filteredGames = unfilteredGames.filter(thisGame => thisGame.includes('[Termination "Normal"]')).filter(thisGame => winner.some(entry => thisGame.includes(entry)));
  console.log(filteredGames);
});