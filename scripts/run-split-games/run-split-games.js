const { execSync } = require("child_process");

const years = ['2014', '2015', '2016', '2017', '2018', '2019', '2020'];
const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

const incompatible2014 = ['01', '02', '03', '04', '05', '06'];
const incompatible2021 = ['05', '06', '07', '08', '09', '10', '11', '12'];

years.forEach(year => {
  months.forEach(month => {
    if (!(year == '2014' && incompatible2014.includes(month)) && !(year == '2021' && incompatible2021.includes(month))) {
      execSync(`wget https://cubox.dev/files/chess/black-${year}-${month}.pgn.xz`);
      execSync(`xz -d black-${year}-${month}.pgn.xz`);
      execSync(`node ../split-games/split-games.js blackkbn-${year}-${month}.pgn black`);

      execSync(`wget https://cubox.dev/files/chess/white-${year}-${month}.pgn.xz`);
      execSync(`xz -d white-${year}-${month}.pgn.xz`);
      execSync(`node ../split-games/split-games.js whitekbn-${year}-${month}.pgn white`);
    }
  })
});