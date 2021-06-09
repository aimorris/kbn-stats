const fs = require('fs');

const years = ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021'];
const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

const incompatible2014 = ['01', '02', '03', '04', '05', '06'];
const incompatible2021 = ['05', '06', '07', '08', '09', '10', '11', '12'];

let cumulative = [];

years.forEach(year => {
  months.forEach(month => {
    if (!(year == '2014' && incompatible2014.includes(month)) && !(year == '2021' && incompatible2021.includes(month))) {
      const white = require(`../../data/whitekbn-${year}-${month}.js`);
      const black = require(`../../data/blackkbn-${year}-${month}.js`);
      cumulative = cumulative.concat(white);
      cumulative = cumulative.concat(black);
    }
  });
});

console.log(cumulative);
const jsonString = JSON.stringify(cumulative);
fs.writeFile('../../data/cumulative.js', 'const checkmates = ' + jsonString, err => {
  console.log(err ? 'Success' : 'Error' + err);
});