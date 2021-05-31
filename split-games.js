const LineReader = require('linereader');
const fetch = require('node-fetch');

const lr = new LineReader('./blackkbn-2021-04.pgn')

const prefixes = ['Site', 'White ', 'Black ', 'Result', 'WhiteElo', 'BlackElo', 'Termination'];

const unfilteredGames = [];
let filteredGames = [];
let gamesCollect = [];

const checkmates = [];

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
lr.on('end', async function () {
  // Filters the games for Normal termination
  filteredGames = unfilteredGames.filter(thisGame => thisGame.includes('[Termination "Normal"]'));

  // Iterates through the games with normal termination
  for (game of filteredGames) {
    // Get Black's rating
    const rating = parseInt(game[5].slice(11, -2));

    // If black won (i.e. checkmated)
    if (game[3] == '[Result "0-1"]') {
      // Get username
      const user = game[2].slice(8, -2);

      // Check user for tosViolation
      fetch('https://lichess.org/api/user/' + user)
      .then(res => res.json())
      .then(json => {
        if (!json.tosViolation || false) {
          // Push [blackRating, 1] to the checkmates array if checkmated
          checkmates.push([rating, 1]);
        }
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      // Push [blackRating, 0] to the checkmates array if failed to checkmate
      checkmates.push([rating, 0]);
    }
  }
});