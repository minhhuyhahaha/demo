var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql",
    database: "batdongsan"
});
  
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

function insert(data){
    con.query("REPLACE INTO advertising SET ?", data, (err, results, fields) => {
        if (err) throw err;
        console.log(results);
    });
}
exports.insert = insert;