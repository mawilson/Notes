// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to delete an item
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Get the DynamoDB table name from environment variables
const tableName = process.env.TABLE_NAME;

/**
 * A simple example includes a HTTP post method to delete one item from a DynamoDB table.
 */
export const deleteNoteHandler = async (event) => {
    if (event.httpMethod !== 'DELETE') {
        throw new Error(`postMethod only accepts DELETE method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);
    
    // Get id from pathParameters from APIGateway because of `/{id}` at template.yaml
    const id = event.pathParameters.id;

    // Deletes an item
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#delete-property
    var params = {
        TableName : tableName,
        Key : { id: id }
    };

    let response = {};
    try {
        const data = await ddbDocClient.send(new DeleteCommand(params));
        //console.log("Success - item deleted", data);
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
