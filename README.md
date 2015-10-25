# BackTrack SMS Recovery service.
Everyone loses stuff. Your wallet, your keys, your bike, your dog, etc. BackTrack SMS service is a service to coordinate the communication between you and the finder of your lost items.

Made with <3 by [Levi Bostian](http://levibostian.com) for [Startup Games 2015](http://www.iowajpec.org/event/the-startup-games/) fall.

## Why BackTrack?

* Secure. Your personal information is never given to the finder of the item. We take care of communication between finder and owner.
* Raise chances of getting your item back. When someone finds your item, it is a pain for them to get item back. Find your information on the item, if it even is, contact you, coordinate where and how to meet, etc. BackTrack allows the finder to leave the item somewhere and send you the directions on where it is located. 

# Installing
BackTrack uses Twilio for SMS communication and Google Sheets for the customer data (yeah, not as secure, I know. For the situation, it was better then a DB.)

1. Create environment variables:  
* TWILIO_AUTH_TOKEN and TWILIO_ACCOUNT_SID with Twilio creds. Also, TO_PHONE_NUM: "+1112223333" with the Twilio phone number you created.
* GOOGLE_SHEET_ID with the public ID to the Google sheet. To obtain this, create a Google Sheet, create a shareable link, go to File > Publish to web, and then finally grab the ID from the URL in your shareable link. 
2. `$> npm install`
3. `$> npm start`

BackTrack does include `pg` as a dependency, has code included for creating a database, and modals for querying the database. The source code was setup working to query PG instead of a Google Sheet so you can use Postgres no problem.
