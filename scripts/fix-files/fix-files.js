const fs = require('fs');

const years = ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021'];
const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

const incompatible2014 = ['01', '02', '03', '04', '05', '06'];
const incompatible2021 = ['05', '06', '07', '08', '09', '10', '11', '12'];

years.forEach(year => {
  months.forEach(month => {
    if (!(year == '2014' && incompatible2014.includes(month)) && !(year == '2021' && incompatible2021.includes(month))) {
      fs.appendFile(`../../data/whitekbn-${year}-${month}.js`, '; module.exports = whiteCheckmates;', function (err) {
        if (err) throw err;
        console.log('Saved!');
      });

      fs.appendFile(`../../data/blackkbn-${year}-${month}.js`, '; module.exports = blackCheckmates;', function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
    }
  });
});