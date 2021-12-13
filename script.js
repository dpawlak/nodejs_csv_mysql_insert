const fs = require('fs');
const fastcsv = require('fast-csv');
const mysql = require('mysql');

let stream = fs.createReadStream('dec-bulk.csv');
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function(data) {
    csvData.push(data);
  })
  .on("end", function() {
    csvData.shift();
    const connection = mysql.createConnection({
      // host:localhost,
      user:'root',
      password:'',
      database:'daniel_pawlak_data_collection'
    });

    // open the connection
connection.connect(error => {
  if (error) {
    console.error(error);
  } else {
    let query =
      "INSERT INTO pole_count (id, fielder, date, count) VALUES ?";
    connection.query(query, [csvData], (error, response) => {
      console.log(error || response);
    });
  }
});
  })
  stream.pipe(csvStream);
