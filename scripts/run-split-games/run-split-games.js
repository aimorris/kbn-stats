const { execSync } = require("child_process");

const years = ['2014', '2015', '2016', '2017', '2018', '2019'];
const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

const incompatible2014 = ['01', '02', '03', '04', '05', '06'];
const incompatible2019 = ['09', '10', '11', '12'];

years.forEach(year => {
  months.forEach(month => {
    if (!(year == '2014' && incompatible2014.includes(month)) && !(year == '2019' && incompatible2019.includes(month))) {
      execSync(`xz -dk /www/cubox/files/chess/blackkbn-${year}-${month}.pgn.xz`);
      execSync(`node ../scripts/split-games/split-games.js /www/cubox/files/chess/blackkbn-${year}-${month}.pgn black`);

      execSync(`xz -dk /www/cubox/files/chess/whitekbn-${year}-${month}.pgn.xz`);
      execSync(`node ../scripts/split-games/split-games.js /www/cubox/files/chess/whitekbn-${year}-${month}.pgn white`);
    }
  })
});