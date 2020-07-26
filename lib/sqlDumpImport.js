const sqlDumpImport  = exports;
const async=require('async');
const fs=require('fs');

function arraySplit(str) {
		if (str.indexOf(';') === -1) {
			return;
		}
		str = str.trim()
		str = str.replace(/(?:\r\n|\r|\n)/g, ' ')
		str = str.replace(/\s\s+/g, ' ').trim()
		str = str.substring(0, str.length-1)
		let arr = str.split(';')
		return arr;
}


sqlDumpImport.importSqlDump=function (filePath,dbName,host,user,password){

  const dbmaster = require('../database/dbConnection').localConnect(dbName,host,user,password)

fs.readFile(filePath, 'utf8',async function(err,data){
    if(err){
        console.log(err);
        return;
	}
	let count=0;
    let result = arraySplit(data);
    if(!result){
        console.log('wrong .sql file .please check')
    }
        	async.eachSeries(result, function (vl, callback) {
				var  sql =vl;
				 dbmaster.query({ sql: sql }, function(
				  err,
				  rows1,
				  fields
				) {
				  if (err) {  
					console.log(err)
				  } else {
					  count=count+1;
					  console.log(count);
				  }
				  callback()
				});
		  }, function (err) {
			 console.log("done")
		  });

})
};

