// <!DOCTYPE html>
// <html>

// <head>
//   <meta charset="utf-8">
//   <script src="https://cdn.plot.ly/plotly-1.2.0.min.js"></script>
// </head>

// <body>
//   <div id="chart" style="width:100vw;height:100vh;"></div>
// </body>

// <script type="text/javascript" src="../data/blackkbn-2021-04.js"></script>
// <script type="text/javascript" src="../data/whitekbn-2021-04.js"></script>
// <script>
//   const intervalSize = 10;

//   let ratings = [];
//   let checkmatePercentages = [];

//   let totalCheckmatePercentage = [];

//   for (let i = 0; i < 3000; i += intervalSize) {
//     // Filter checkmates at rating of this interval
//     const checkmatesAtThisRating = whiteCheckmates.filter(x => x[0] > i && x[0] < i + intervalSize).flatMap(x => x[1]).concat(blackCheckmates.filter(x => x[0] > i && x[0] < i + intervalSize).flatMap(x => x[1]));
//     totalCheckmatePercentage = totalCheckmatePercentage.concat(checkmatesAtThisRating);

//     const percentage = checkmatesAtThisRating.reduce((a, b) => a + b, 0) / checkmatesAtThisRating.length;

//     ratings.push(`${i}-${i + intervalSize - 1}`);
//     checkmatePercentages.push(percentage*100);
//   }

//   const totalPercentage = totalCheckmatePercentage.reduce((a, b) => a + b, 0) / totalCheckmatePercentage.length;

//   const bars = [
//     {
//       x: ratings,
//       y: checkmatePercentages,
//       type: 'bar'
//     }
//   ];

//   const layout = {
//     title: `King-Bishop-Knight checkmate percentage vs Lichess rating for April 2021<br><sub>Total checkmate percentage for April 2021: ${Math.round(totalPercentage * 100 * 100)/100}%</sub>`,
//     xaxis: {
//       title: 'Lichess rating'
//     },
//     yaxis: {
//       title: 'Checkmate Percentage',
//       ticksuffix: '%'
//     },
//     margin: {
//       b: 100
//     }
//   };

//   Plotly.newPlot('chart', bars, layout);
// </script>
// <!-- <script>
//   let classical = [];
//   let fide = [];

//   let fitX = [];
//   let fitY = [];

//   const result = regression.linear(ratings[3]);
//   console.log(result);

//   for (const el of ratings[3]) {
//     classical.push(el[0]);
//     fide.push(el[1]);
//   }

//   for (const el of result['points']) {
//     fitX.push(el[0]);
//     fitY.push(el[1]);
//   }

//   chart = document.getElementById('chart');

//   const trace1 = {
//     x: classical,
//     y: fide,
//     mode: 'markers',
//     type: 'scatter'
//   }

//   const trace2 = {
//     x: fitX,
//     y: fitY,
//     mode: 'lines',
//     type: 'scatter'
//   }

//   var layout = {
//     title: 'FIDE rating vs Lichess classical rating',
//     xaxis: {
//       title: 'Lichess classical rating'
//     },
//     yaxis: {
//       title: 'FIDE rating'
//     }
//   };

// 	Plotly.newPlot('chart', [trace1, trace2], layout);
// </script> -->

// <style>
//   * {
//     margin: 0;
//   }
// </style>

// </html>

const fs = require('fs');

const years = ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021'];
const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

const incompatible2014 = ['01', '02', '03', '04', '05', '06'];
const incompatible2021 = ['06', '07', '08', '09', '10', '11', '12'];

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

years.forEach(year => {
  months.forEach(month => {
    if (!(year == '2014' && incompatible2014.includes(month)) && !(year == '2021' && incompatible2021.includes(month))) {
      fs.writeFile(`./site/${year}-${month}.html`, `<!DOCTYPE html>
      <html>
      
      <head>
        <meta charset="utf-8">
        <script src="https://cdn.plot.ly/plotly-1.2.0.min.js"></script>
      </head>
      
      <body>
        <div id="chart" style="width:100vw;height:100vh;"></div>
      </body>
      
      <script type="text/javascript" src="../data/blackkbn-${year}-${month}.js"></script>
      <script type="text/javascript" src="../data/whitekbn-${year}-${month}.js"></script>
      <script>
        const intervalSize = 10;
      
        let ratings = [];
        let checkmatePercentages = [];
      
        let totalCheckmatePercentage = [];
      
        for (let i = 0; i < 3000; i += intervalSize) {
          // Filter checkmates at rating of this interval
          const checkmatesAtThisRating = whiteCheckmates.filter(x => x[0] > i && x[0] < i + intervalSize).flatMap(x => x[1]).concat(blackCheckmates.filter(x => x[0] > i && x[0] < i + intervalSize).flatMap(x => x[1]));
          totalCheckmatePercentage = totalCheckmatePercentage.concat(checkmatesAtThisRating);
      
          const percentage = checkmatesAtThisRating.reduce((a, b) => a + b, 0) / checkmatesAtThisRating.length;
      
          ratings.push(\`\${i}-\${i + intervalSize - 1}\`);
          checkmatePercentages.push(percentage*100);
        }
      
        const totalPercentage = totalCheckmatePercentage.reduce((a, b) => a + b, 0) / totalCheckmatePercentage.length;
      
        const bars = [
          {
            x: ratings,
            y: checkmatePercentages,
            type: 'bar'
          }
        ];
      
        const layout = {
          title: \`King-Bishop-Knight checkmate percentage vs Lichess rating for ${monthNames[parseInt(month) - 1]} ${year}<br><sub>Total checkmate percentage for ${monthNames[parseInt(month) - 1]} ${year}: \${Math.round(totalPercentage * 100 * 100)/100}%</sub>\`,
          xaxis: {
            title: 'Lichess rating'
          },
          yaxis: {
            title: 'Checkmate Percentage',
            ticksuffix: '%'
          },
          margin: {
            b: 100
          }
        };
      
        Plotly.newPlot('chart', bars, layout);
      </script>
      <!-- <script>
        let classical = [];
        let fide = [];
      
        let fitX = [];
        let fitY = [];
      
        const result = regression.linear(ratings[3]);
        console.log(result);
      
        for (const el of ratings[3]) {
          classical.push(el[0]);
          fide.push(el[1]);
        }
      
        for (const el of result['points']) {
          fitX.push(el[0]);
          fitY.push(el[1]);
        }
      
        chart = document.getElementById('chart');
      
        const trace1 = {
          x: classical,
          y: fide,
          mode: 'markers',
          type: 'scatter'
        }
      
        const trace2 = {
          x: fitX,
          y: fitY,
          mode: 'lines',
          type: 'scatter'
        }
      
        var layout = {
          title: 'FIDE rating vs Lichess classical rating',
          xaxis: {
            title: 'Lichess classical rating'
          },
          yaxis: {
            title: 'FIDE rating'
          }
        };
      
        Plotly.newPlot('chart', [trace1, trace2], layout);
      </script> -->
      
      <style>
        * {
          margin: 0;
        }
      </style>
      
      </html>`, err => {
        if (err) return console.log(err);
        console.log('Done!');
      });
    }
  })
});