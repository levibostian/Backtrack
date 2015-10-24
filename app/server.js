var express = require('express');
var path = require('path');
var twilio = require('twilio');

var twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
var twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;

var fromPhoneNum = process.env.FROM_PHONE_NUM;
var toPhoneNum = process.env.TO_PHONE_NUM;

var client = require('twilio')(twilioAccountSid, twilioAuthToken);

var app = express();
app.use(express.static(__dirname + '/public')); // starting static fileserver

app.get('/incoming',
        function(req, res) {
            var previousStep = req.cookie.previousStep;
            var responseMessage = "";

            if (!previousStep) {
                responseMessage = "you're on step 1";
                previousStep = 0;
            } else {
                switch (previousStep) {
                case 1:
                    responseMessage = "you're on step 2";
                    break;
                case 2:
                    responseMessage = "you're on step 3. All done. Thanks!";
                    break;
                }
            }
            
            var response = new twilio.TwimlResponse();
            response.sms(responseMessage);
            res.cookie('previousStep', previousStep + 1);
            res.send(response.toString(), {
                'Content-Type':'text/xml'
            }, 200);
        });

app.get('/',
        function(req, res) {            
            client.messages.create({
                body: "hello there. works.",
                to: toPhoneNum,
                from: fromPhoneNum
            }, function(err, message) {
                if (err) {
                    process.stdout.write('error: ' + err.message);
                } else {
//                    process.stdout.write(message.sid);
                }
            });
            
            res.send('hello there');
         });


app.set('port', (process.env.PORT || 5000));
var server = app.listen(app.get('port'), function () {
    var host = server.address().address;
    var port = server.address().port;
    
    console.log('listening at: %s:%s', host, port);
});
