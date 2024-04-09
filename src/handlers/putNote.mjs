// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Get the DynamoDB table name from environment variables
const tableName = process.env.TABLE_NAME;

/**
 * A simple example includes a HTTP put method to update one item in a DynamoDB table.
 */
export const putNoteHandler = async (event) => {
    if (event.httpMethod !== 'PUT') {
        throw new Error(`postMethod only accepts PUT method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    // Get id and name from the body of the request
    const body = JSON.parse(event.body);
    
    // Get id from pathParameters from APIGateway because of `/{id}` at template.yaml
    const id = event.pathParameters.id;

    const name = body.name;

    // Creates a new item, or replaces an old item with a new item
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
    var params = {
        TableName : tableName,
        Item: { id : id, name: name }
    };

    let response = {};
    try {
        const data = await ddbDocClient.send(new PutCommand(params));
        //console.log("Success - item added or updated", data);
        response.statusCode = 200;
        response.body = JSON.stringify(data);
    } catch (err) {
        //console.log("Error", err.stack);
        response.statusCode = 500;
        response.body = JSON.stringify(err.stack);
    }

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
