var util = require('../util/util.js');
var config = require('../config.js');
var async = require('async');
var connection = require('../util/util.js').getConnection();
var Field = require('./field.js');

module.exports = function Schema(tableName) {
  var self = this;

  this.author = process.env.USER;
  this.tableName = tableName;
  this.modelName = util.getCamelCase(self.tableName, true);
  this.camelName = util.getCamelCase(self.tableName);
  this.fields = [];


  this.generate = function(callback) {
    init(function (err) {
      if (err) {
        return callback(err);
      }
      util.createCodeFile(self, function (err) {
        if (err) {
          return callback(err);
        }
        console.log('table ' + self.tableName + ' generate complate ');
        callback();
      });
    })
  };

  function init(callback) {
    async.parallel({
      tableInfo: function(cb){
        connection.query('select table_comment from information_schema.tables  where  table_name =\'' + self.tableName + '\'', cb)
      },
      fields: function (cb) {
        connection.query('show full fields from ' + config.db.database + '.' + self.tableName, cb)
      }
    }, function(err, result){
      if (err) {
        return callback(err);
      }
      self.comment = result.tableInfo[0][0].table_comment;
      for (var i = 0; i<result.fields[0].length; i++) {
        var row = result.fields[0][i];
        self.fields.push(new Field(row.Field,row.Type, row.Key, row.Comment, row.Null));
      }
      for (var j=0; j< self.fields.length; j++) {
        if (self.fields[j].isKey) {
          self.key = {column: self.fields[j].column, property: self.fields[j].property};
        }
      }
      callback()
    });
  }
};
