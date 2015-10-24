var pg = require('pg');

exports.query = function(queryString, values, callback) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        var handleError = function(err) {
            if (!err) {
                return false;
            } else {
                if (client) {
                    done(client); // remove client from connection pool.
                }
                
                return true;
            }
        };

        if (handleError(err)) {
            throw 'Error connecting to database. ' + err;
        } else {
            client.query(queryString, values, function(err, result) {
                done();
                callback(err, result);
            });
        }
    });
};
