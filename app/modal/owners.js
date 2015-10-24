var db = require('../db').db;

exports.doesOwnerBacktrackIdExist = function(ownerBacktrackId) {
    db.query('SELECT count(id) FROM owners WHERE backtrack_id="$1"', [ownerBacktrackId], function(err, result) {
        if (err) {
            throw err;
        }

        return result.rows[0].count > 0;
    });
};

exports.getOwnerByBacktrackId = function(ownerBacktrackId) {
    db.query('SELECT * FROM owners WHERE backtrack_id="$1"', [ownerBacktrackId], function(err, result) {
        if (err) {
            throw err;
        }

        return result.rows[0];
    });
};
