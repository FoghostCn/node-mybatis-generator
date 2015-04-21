var util = require('../util/util.js');

module.exports = function Field(column, type, key, comment, isNotNull) {
  var self = this;

  this.column = column.toLowerCase();
  this.type = type.toLowerCase().replace(/\(.+\)/g,'');
  this.isKey = key.toLowerCase() === "pri";
  this.isNotNull = isNotNull.toLowerCase() === 'no';
  this.comment = comment;
  this.property = util.getCamelCase(this.column);

  this.jdbcType = (function () {
    switch(self.type){
      case 'varchar':
      case 'text':
      default :
        return 'VARCHAR';
      case 'date':
      case 'datetime':
      case 'timestamp':
        return 'TIMESTAMP';
      case 'int':
        return 'INTEGER';
      case 'decimal':
        return 'DECIMAL';
    }
  })();

  this.javaType = (function () {
    switch (self.type) {
      case 'varchar':
      case 'text':
      default :
        return 'String';
      case 'date':
      case 'datetime':
      case 'timestamp':
        return 'Date';
      case 'int':
        return 'Integer';
      case 'decimal':
        return 'BigDecimal';
    }
  })();

  this.getter = (function(){
    return 'public ' + self.javaType + ' ' + util.getCamelCase('get_' + self.column) + '() {\n' +
      '        return ' + self.property + ';\n' + '    }';
  })();
  
  this.setter = (function () {
    return 'public void ' + util.getCamelCase('set_' + self.column) + '(' + self.javaType + ' ' + self.property + '){\n' +
        '        this.' + self.property + ' = ' + self.property +';\n    }';
  })()
};
