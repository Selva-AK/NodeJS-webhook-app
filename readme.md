Webhook App

Overview:
This Express web application receives data into the app server for an account and sends it across different platforms (destinations) using webhook URLs.

Modules:
1. Account Module:
   - Fields: email (unique, mandatory), account id (unique), account name (mandatory), app secret token (automatically generated), website (optional).
2. Destination Module:
   - Fields: URL (mandatory), HTTP method (mandatory), headers (mandatory, multiple values).
3. Data Handler Module:
   - Receives only JSON data in the POST method. Requires app secret token sent through the header (CL-X-TOKEN). Sends the data to the account's destinations.

API Endpoints:

1. Create an Account
   Method: POST
   URL: http://localhost:3000/api/accounts
   Headers:
     Content-Type: application/json
   Sample Request Body:
   {
     "email": "user@example.com",
     "name": "John Doe",
     "website": "http://example.com"
   }
   Sample Response Body:
   {
     "id": 1,
     "email": "user@example.com",
     "name": "John Doe",
     "secret_token": "generated_secret_token",
     "website": "http://example.com"
   }

2. Get Account Details
   Method: GET
   URL: http://localhost:3000/api/accounts/1
   Headers: None
   Sample Response Body:
   {
     "id": 1,
     "email": "user@example.com",
     "name": "John Doe",
     "secret_token": "generated_secret_token",
     "website": "http://example.com"
   }

3. Delete an Account
   Method: DELETE
   URL: http://localhost:3000/api/accounts/1
   Headers: None
   Sample Response: 204 No Content

4. Create a Destination for an Account
   Method: POST
   URL: http://localhost:3000/api/accounts/1/destinations
   Headers:
     Content-Type: application/json
   Sample Request Body:
   {
     "url": "http://webhook.site/your-webhook-url",
     "method": "POST",
     "headers": {
       "APP_ID": "1234APPID1234",
       "APP_SECTET": "enwdj3bshwer43bjhjs9ereuinkjcnsiurew8s",
       "ACTION": "user.update",
       "Content-Type": "application/json",
       "Accept": "*"
     }
   }
   Sample Response Body:
   {
     "id": 1,
     "account_id": 1,
     "url": "http://webhook.site/your-webhook-url",
     "method": "POST",
     "headers": {
       "APP_ID": "1234APPID1234",
       "APP_SECTET": "enwdj3bshwer43bjhjs9ereuinkjcnsiurew8s",
       "ACTION": "user.update",
       "Content-Type": "application/json",
       "Accept": "*"
     }
   }

5. Get All Destinations for an Account
   Method: GET
   URL: http://localhost:3000/api/accounts/1/destinations
   Headers: None
   Sample Response Body:
   [
     {
       "id": 1,
       "account_id": 1,
       "url": "http://webhook.site/your-webhook-url",
       "method": "POST",
       "headers": {
         "APP_ID": "1234APPID1234",
         "APP_SECTET": "enwdj3bshwer43bjhjs9ereuinkjcnsiurew8s",
         "ACTION": "user.update",
         "Content-Type": "application/json",
         "Accept": "*"
       }
     }
   ]

6. Delete a Destination
   Method: DELETE
   URL: http://localhost:3000/api/destinations/1
   Headers: None
   Sample Response: 204 No Content

7. Receive Data and Forward to Destinations
   Method: POST
   URL: http://localhost:3000/server/incoming_data
   Headers:
     Content-Type: application/json
     CL-X-TOKEN: generated_secret_token
   Sample Request Body:
   {
     "key": "value",
     "another_key": "another_value"
   }
   Sample Response Body:
   {
     "message": "Data forwarded to destinations"
   }

Common Error Responses:

1. Missing Secret Token
   Method: POST
   URL: http://localhost:3000/server/incoming_data
   Headers:
     Content-Type: application/json
   Sample Request Body:
   {
     "key": "value"
   }
   Sample Response Body:
   {
     "error": "Un Authenticate"
   }

2. Invalid Data for GET Method
   Method: POST
   URL: http://localhost:3000/server/incoming_data
   Headers:
     Content-Type: text/plain
     CL-X-TOKEN: generated_secret_token
   Sample Request Body:
   Invalid data
   Sample Response Body:
   {
     "error": "Invalid Data"
   }
