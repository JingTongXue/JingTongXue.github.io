//极简的sqlite cli控制台
const sqlite = require('sqlite');
const repl = require('repl');

var dbFile = process.argv[2];

async function main(){
  var db = await sqlite.open(dbFile);
  repl.start({
    prompt: 'sqlite3> ',
    eval: async function(sql, context, filename, callback) {
      sql = sql.trim();//输入内容
      if (!sql) {
        callback(null);
        return
      }
      var result = await db.all(sql);
      callback(null, result);
    }
  })
}

main()