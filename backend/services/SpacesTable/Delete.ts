// Lambda to added data to sdk
import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import { addCorsHeader } from '../Shared/Utils'

const TABLE_NAME = process.env.TABLE_NAME
const PRIMARY_KEY = process.env.PRIMARY_KEY

const dbClient = new DynamoDB.DocumentClient()

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: 'Hello from DynamoDB'
  }
  addCorsHeader(result)
  const spaceId = event.queryStringParameters?.[PRIMARY_KEY!]

  if (spaceId) {
    const deleteResult = await dbClient.delete({
      TableName: TABLE_NAME!,
      Key: {
        [PRIMARY_KEY!] : spaceId
      }
    }).promise()
    result.body = JSON.stringify(deleteResult)
  }
  return result
}