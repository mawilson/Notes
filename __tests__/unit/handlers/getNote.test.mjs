// Import getNoteHandler function from getNote.mjs 
import { getNoteHandler } from '../../../src/handlers/getNote.mjs'; 
// Import dynamodb from aws-sdk 
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from "aws-sdk-client-mock";
 
// This includes all tests for getNoteHandler() 
describe('Test getNoteHandler', () => { 
    const ddbMock = mockClient(DynamoDBDocumentClient);
 
    beforeEach(() => {
        ddbMock.reset();
      });
 
    // This test invokes getNoteHandler() and compare the result  
    it('should get item by id', async () => { 
        const item = { id: 'id1' }; 
 
        // Return the specified value whenever the spied get function is called 
        ddbMock.on(GetCommand).resolves({
            Item: item,
        }); 
 
        const event = { 
            httpMethod: 'GET', 
            pathParameters: { 
                id: 'id1' 
            } 
        };
 
        // Invoke getNoteHandler() 
        const result = await getNoteHandler(event); 
 
        const expectedResult = { 
            statusCode: 200, 
            body: JSON.stringify(item) 
        }; 
 
        // Compare the result with the expected result 
        expect(result).toEqual(expectedResult); 
    }); 
}); 
 