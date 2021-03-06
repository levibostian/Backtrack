var db = require('../db').db;

exports.doesOwnerBacktrackIdExist = function(ownerBacktrackId, done) {
    db.query('SELECT count(id) FROM owners WHERE backtrack_id=$1', [ownerBacktrackId], function(err, result) {
        if (err) {
            throw err;
        }

        return done(result.rows[0].count > 0);
    });
};

exports.getOwnerByBacktrackId = function(ownerBacktrackId, done) {
    db.query('SELECT * FROM owners WHERE backtrack_id=$1', [ownerBacktrackId], function(err, result) {
        if (err) {
            throw err;
        }

        return done(result.rows[0]);
    });
};
