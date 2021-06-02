const LineReader = require('linereader');
const fetch = require('node-fetch');
const {RateLimit} = require('async-sema');
const fs = require('fs');

const args = process.argv.slice(2);
const lr = new LineReader(args[0]);

const limit = RateLimit(1);

const prefixes = ['Site', 'White ', 'Black ', 'Result', 'WhiteElo', 'BlackElo', 'Termination'];

const unfilteredGames = [];
let gamesCollect = [];
let checkmates = [];

lr.on('error', function (err) {
  console.log(err);
  lr.close();
});

lr.on('line', function (lineno, line) {
  if (prefixes.some(word => line.includes(word))) {
    gamesCollect.push(line);

    if (line.includes('Termination')) {
      unfilteredGames.push(gamesCollect);
      gamesCollect = [];
    }
  }
});

lr.on('end', async function () {
  const isBlack = args[1] == 'black';
  const filteredGames = unfilteredGames.filter(thisGame => thisGame.includes('[Termination "Normal"]'));

  for (game of filteredGames) {
    const parseRating = s => parseInt(s.slice(11, -2));
    const parseUsername = s => s.slice(8, -2);
    const parseGameId = s => s.slice(27, -2);
    const checkTosViolation = user => fetch('https://lichess.org/api/user/' + user).then(res => res.json()).then(userData => userData.tosViolation || userData.closed);
    const checkResign = (gameId) => fetch(`https://lichess.org/game/export/${gameId}?tags=false&clocks=false&literate=true`).then(res => res.text()).then(pgn => isBlack ? pgn.includes('White resigns') : pgn.includes('Black resigns'));
    const checkResult = async (ratingStr, usernameStr, resultStr) => {
      const isWin = game[3] == resultStr;
      const hasViolator = isWin ? await checkTosViolation(parseUsername(usernameStr)) : true;
      console.log(usernameStr);
      return [
        parseRating(ratingStr),
        isWin,
        isWin ? hasViolator : false,
        !hasViolator ? await checkResign(parseGameId(game[0])) : true
      ];
    }

    const [rating, isWin, hasViolator, resigned] = isBlack ?
      await checkResult(game[5], game[2], '[Result "0-1"]') :
      await checkResult(game[4], game[1], '[Result "1-0"]');

    if (!hasViolator) {
      checkmates.push(isWin && !resigned ? [rating, 1] : [rating, 0]);
      console.log(game[0], isWin && !resigned);
    }

    if (isWin) await limit();
  }

  const jsonString = JSON.stringify(checkmates);
  fs.writeFile(`../../data/${args[0].slice(0, -4)}.js`, `const ${isBlack ? 'black' : 'white'}Checkmates = ` + jsonString, err => {
    console.log(err ? 'Success' : 'Error' + err);
  })
});