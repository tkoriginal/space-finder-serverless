import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from "./Read";

const event: APIGatewayProxyEvent = {
  queryStringParameters: {
    location: 'Toronto'
  }
} as any; 
handler(event, {} as any).then(apiResult => {
  const items = JSON.parse(apiResult.body)
  console.log('123')
})