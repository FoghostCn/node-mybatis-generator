var mysql = require('mysql');
var config = require("../config.js");
var connection = mysql.createConnection(config.db);
connection.connect();
var jade = require('jade');
var async = require('async');
var fs = require('fs');
var ejs = require('ejs');

exports.getCamelCase = function (name, UpperFirstChar) {
  if (UpperFirstChar) {
    name = name.charAt(0).toUpperCase() + name.substring(1);
  }
  return name.replace(/_[a-z]/g, function(m){
    return m.replace('_','').toUpperCase();
  });
};

exports.getConnection = function () {
  return connection;
};

exports.createCodeFile = function (schema, callback) {
  fs.readdir(config.path + '/templates', function (err,files) {
    files = files.filter(function (name) {
      return name.charAt(0) != '.';
    });
  async.each(files,
    function (file, cb) {
      ejs.renderFile(config.path + '/templates/' + file, {
        cache: true,
        schema: schema
      }, function (err, data) {
        if (err) return console.error(err);
        fs.writeFile(config.path + '/dist/' + file.replace('#model#', schema.modelName), data, cb)
      });
    }, callback)
  });
};