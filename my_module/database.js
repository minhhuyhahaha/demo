var mysql = require('mysql');
var con = mysql.createConnection({
    host: "mysql:3306",
    user: "crawler",
    password: "12345",
    database: "crawlerdb"
});
  
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    let sql = "CREATE TABLE IF NOT EXISTS `advertising` (`id` int(11) NOT NULL PRIMARY KEY,`url` text,`title` text,`content` text,`image` text,`info_estate` text,`info_project` text,`name` text,`address` text,`email` text,`phone` text,`area` text,`price` text,`area_size` text) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
    con.query(sql, (err, results, fields) => {
        if (err) throw err;
        console.log(results);
    });
});

function insert(data){
    con.query("REPLACE INTO advertising SET ?", data, (err, results, fields) => {
        if (err) throw err;
        console.log(results);
    });
}
exports.insert = insert;
