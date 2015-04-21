var config = require("./config.js");
var Schema = require('./models/schema.js');
var async = require('async');
var connection = require('./util/util.js').getConnection();

if (config.tables.length === 0) {
  connection.query('select table_name from information_schema.tables where table_schema=\'' + config.db.database + '\'',
    function (err, rows) {
    if (err) throw err;
    var tables = rows.map(function(e){
      return e.table_name;
    });
    generate(tables);
  })
} else {
  generate(config.tables);
}

function generate(tables) {
  async.each(tables, function(table,cb) {
    var schema = new Schema(table);
    schema.generate(function (err) {
      if (err) console.error(err);
      cb();
    });
  }, function(){
    connection.end();
    process.exit(1);
  });
}
