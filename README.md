# Notes
A simple AWS-based, serverless note-taking app

## Installation
The application leverages the AWS SAM CLI to build & deploy the appropriate AWS resources & roles. To use the AWS SAM CLI, follow these steps:
[Install the AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html).

Once properly installed & configured with appropriate AWS credentials, you can build the application with
``sam build``. This will parse the contents of the AWS SAM template file (template.yam) & generate a build suitable for deployment to AWS.

In order to then deploy this build to AWS, run
``sam deploy``, which will deploy using the values defined in (samconfig.toml). Optionally you may run ``sam deploy --guided`` to manually specify deployment options.

After deploying, the output will point you in the direction of your API root path, at which point you can navigate there & begin fiddling.

## Use
The API specifies the following endpoints:
* GET /
  * retrieves all Notes
* GET /{noteId}
  * retrieves the Note with noteId
  * returns nothing if not found
* POST /
  * requires a JSON body with the following attributes defined
    * name: content of the note
  * creates a new note with note contents of the body name
* PUT /{noteId}
  * requires a JSON body with the following attributes defined
    * name: note contents
  * modifies the Note with the provided ID so that its note contents become the body name
  * does nothing if noteId not found
* DELETE /{noteId}
  * deletes the Note with noteId
  * does nothing if noteId not found
 
 The GET endpoints are unauthenticated.
 The POST, PUT, & DELETE endpoints all expect an OAUTH2 bearer token. This can be done via Postman following the instructions here: https://learning.postman.com/docs/sending-requests/authorization/oauth-20/
  * Grant type: Authorization Code
  * Callback URL remains default (for browser testing)
  * Auth URL: https://notes-authority.auth.us-east-1.amazoncognito.com/oauth2/authorize
  * Access Token URL: https://notes-authority.auth.us-east-1.amazoncognito.com/oauth2/token
  * Client ID: This will be generated by your cloud build, & can be found within the AWS console at Amazon Cognito -> User Pools -> notes-app-NotesUserpool -> App Integration tab -> App Client List, under Client ID
  * Client Secret: leave blank
  * Scope: There are three custom scopes defined for the app, one for POST, one for PUT, one for DELETE. You can grant all of them by specifying each separated by a space, or test granting individuals & verifying they only work on the appropriate endpoint
    * NotesUserPoolResourceServer/post NotesUserPoolResourceServer/put NotesUserPoolResourceServer/delete
  * Client authentication: Send credentials in body
    * Sending as basic auth header may work, but for me was resulting in 400 errors
With all of this properly input, hit 'Get New Access Token'. This should prompt the browser to take you to the notes-authority domain, where the standard Cognito authorization workflow should help you get an account set up & signed in. Finally, once logged in, a token will be generated, & you can then use this in your requests as the authorization.

Without a valid token generated through the above process, the POST, PUT, & DELETE endpoints will respond with a 401 Unauthorized when requested.
