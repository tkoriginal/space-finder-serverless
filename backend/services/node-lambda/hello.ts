import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3 } from 'aws-sdk'

const s3Client = new S3()

export async function handler(event: APIGatewayProxyEvent, context: any): Promise<APIGatewayProxyResult> {
  if (isAuthorized(event)) {
    return {
      statusCode: 200,
      body: 'You are authorized'
    }
  }
  return {
    statusCode: 401,
    body: 'You are not authorized'
  }
}

function isAuthorized(event: APIGatewayProxyEvent) {
  const groups: string = event.requestContext.authorizer?.claims['cognito:groups']
  console.log({event})
  console.log({groups})
  if (groups) {
    return (groups).includes('admin')
  } 
  return false
}