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
    * id: unique identifier string
    * name: content of the note
  * creates a new note with an ID of the body ID & note contents of the body name
* PUT /{noteId}
  * requires a JSON body with the following attributes defined
    * name: note contents
  * modifies the Note with the provided ID so that its note contents become the body name
  * does nothing if noteId not found
* DELETE /{noteId}
  * deletes the Note with noteId
  * does nothing if noteId not found
