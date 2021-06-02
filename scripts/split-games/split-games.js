const LineReader = require('linereader');
const fetch = require('node-fetch');
const {RateLimit} = require('async-sema');
const fs = require('fs');

const args = process.argv.slice(2);
const lr = new LineReader(args[0]);

const limit = RateLimit(1);

const prefixes = ['Site', 'White ', 'Black ', 'Result', 'WhiteElo', 'BlackElo', 'Termination'];

const unfilteredGames = [];
let filteredGames = [];
let gamesCollect = [];
let checkmates = [];

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
    const isBlack = args[1] == 'black';
    const parseRating = s => parseInt(s.slice(11, -2));
    const parseUsername = s => s.slice(8, -2);
    const checkTosViolation = user => fetch('https://lichess.org/api/user/' + user).map(res => res.json().tosViolation);
    const checkResult = (ratingStr, usernameStr, oppUsernameStr, resultStr) => [
      parseRating(ratingStr),
      game[3] == resultStr,
      checkTosViolation(parseUsername(usernameStr)) || checkTosViolation(oppUsernameStr)
    ];

    const [rating, isWin, hasViolator] = isBlack ?
      checkResult(game[5], game[2], game[1], '[Result "0-1"]') :
      checkResult(game[4], game[1], game[2], '[Result "1-0"]');

    if (!hasViolator) checkmates.push(isWin ? [rating, 1] : [rating, 0]);

    await limit();
  }

  const jsonString = JSON.stringify(checkmates);
  if (args[1] == 'black') {
    fs.writeFile('../../data/' + args[0].slice(0, -4) + '.js', 'const blackCheckmates = ' + jsonString, err => {
      console.log(err ? 'Success' : 'Error' + err);
    })
  } else {
    fs.writeFile('../../data/' + args[0].slice(0, -4) + '.js', 'const whiteCheckmates = ' + jsonString, err => {
      console.log(err ? 'Success' : 'Error' + err);
    })
  }
});