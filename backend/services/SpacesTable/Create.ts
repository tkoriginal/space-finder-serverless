import { MissingFieldError } from './../Shared/InputValidator';
import { Space } from './../Shared/model';
// Lambda to added data to sdk
import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'

import { validateAsSpaceEntry } from '../Shared/InputValidator';
import { generateRandomId, getEventBody } from '../Shared/Utils';

const TABLE_NAME = process.env.TABLE_NAME

const dbClient = new DynamoDB.DocumentClient()

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: 'Hello from DynamoDB'
  }
  try {
    const item: Space = getEventBody(event)
    item.spaceId = generateRandomId()
    validateAsSpaceEntry(item)
    await dbClient.put({
      TableName: TABLE_NAME!,
      Item: item
    }).promise()

    result.body = JSON.stringify(`Created Item with id: ${item.spaceId}`)
  } catch (error) {  
    if (error instanceof MissingFieldError) {
      result.statusCode = 403
    } else {
      result.statusCode = 500
    }
    if (error instanceof Error) {
      result.body = error.message;
    }
  }

  return result
}