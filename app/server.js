var express = require('express');
var path = require('path');
var twilio = require('twilio');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ownersModal = require('./modal').owners;

var twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
var twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
var fromPhoneNum = process.env.FROM_PHONE_NUM;
var toPhoneNum = process.env.TO_PHONE_NUM;
var client = require('twilio')(twilioAccountSid, twilioAuthToken);

var app = express();
app.use(express.static(__dirname + '/public')); // starting static fileserver
app.use(cookieParser());

app.get('/incoming',
        function(req, res) {
            var cookies = req.cookies;
            var previousStep = 0;
            var responseMessage;            
            if (cookies.previousStep != null) {
                previousStep = parseInt(cookies.previousStep, 10);
            }
            var currentStep = previousStep + 1;

            switch (currentStep) {
            case 1:
                responseMessage = "Awesome! Thank you for reporting this lost item. Text back the 4 digit ID found on the item.";
                sendResponseText(responseMessage, currentStep, res);
                break;
            case 2:
                var backtrackId = req.query.Body.toUpperCase();
                doesOwnerBacktrackIdExist(backtrackId, function(doesExist) {
                    if (doesExist) {
                        responseMessage = "Time to return the item. Text back directions for the owner on where you are leaving the item.";
                        res.cookie('ownerBacktrackId', backtrackId);     
                    } else {
                        responseMessage = "Hmmm...the ID you entered does not exist. Try entering it again.";
                        currentStep = 1;
                    }

                    sendResponseText(responseMessage, currentStep, res);
                });
                break;
            case 3:
                var directions = req.query.Body;
                sendDirectionsToOwner(directions, cookies.ownerBacktrackId, function() {
                    responseMessage = "The owner has been notified. Thank you for using Backtrack! Goodbye!";
                    currentStep = 0;

                    sendResponseText(responseMessage, currentStep, res);
                });
                break;
            default:
                currentStep = 0;
                break;
            }            
        });

function doesOwnerBacktrackIdExist(ownerBacktrackId, done) {
    ownersModal.doesOwnerBacktrackIdExist(ownerBacktrackId, function(doesExist) {
        return done(doesExist);
    });
}

function sendResponseText(responseMessage, currentStep, expressRes) {
    var response = new twilio.TwimlResponse();
    response.sms(responseMessage);
    expressRes.cookie('previousStep', currentStep);
    expressRes.send(response.toString(), {
        'Content-Type':'text/xml'
    }, 200);
}

function sendDirectionsToOwner(directions, ownerBacktrackId, done) {
    ownersModal.getOwnerByBacktrackId(ownerBacktrackId, function(owner) {
        sendText(directions, owner.phone_num);

        done();
    });
}

function sendText(message, phone_num) {
    client.messages.create({
        body: "A lost item has been reported on Backtrack. Directions: " + message,
        to: phone_num,
        from: fromPhoneNum
    }, function(err, message) {
        if (err) {
            process.stdout.write('error: ' + err.message);
        } else {
            //                    process.stdout.write(message.sid);
        }
    });    
}

app.set('port', (process.env.PORT || 5000));
var server = app.listen(app.get('port'), function () {
    var host = server.address().address;
    var port = server.address().port;
    
    console.log('listening at: %s:%s', host, port);
});
