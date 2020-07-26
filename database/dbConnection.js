    mysql = require('mysql');
    
var mysqlConnect = function(db,host,user,password) {
    var mysqlConnectOpts = {
        connectionLimit: 2000000, 
        waitForConnections: true,
        queueLimit: 150000, 
        acquireTimeout: 172800000,
        connectTimeout: 172800000,
        host: host,
        user: user,
        password: password,
        database: db,
        dateStrings: 'date',
        multipleStatements: false,
        rejectUnauthorized: true
    }
    var pool = mysql.createPool(mysqlConnectOpts);
    var connection = {
        query: function() {
            var queryArgs = Array.prototype.slice.call(arguments),
                events = [],
                eventNameIndex = {};
            pool.getConnection(function(err, conn) {
                if (err) {
                  
                    if (eventNameIndex.error) {
                        eventNameIndex.error();
                    }
                }
                if (conn) {
                    var q = conn.query.apply(conn, queryArgs);
                    q.on('end', function() {
                        conn.release();
                    
                    });
                    q.on('error', function(err) {
                      
                    });
                    events.forEach(function(args) {
                        q.on.apply(q, args);
                    });
                }
            });
            return {
                on: function(eventName, callback) {
                    events.push(Array.prototype.slice.call(arguments));
                    eventNameIndex[eventName] = callback;
                    return this;
                }
            };
        }
    };
    var oneMinute = 60000;
    connection.query('SELECT 1', function(err, rows, field) {
      
        function anotherQueryInAWhile(cb) {
            connection.query('SELECT 1', function(err, rows, field) {
             
            });
        }
        setTimeout(anotherQueryInAWhile, oneMinute);
    });

    return pool;
};
module.exports.localConnect = mysqlConnect;