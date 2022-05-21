import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from "./Update";

const event = {
  queryStringParameters: {
    spaceId: '057d5b72-a263-4f67-921d-5028af49c036'
  },
  body: JSON.stringify({
    location: 'Torono'
  })
}
console.log(handler(event as any, {} as any).then(response => {
  const responesData = JSON.parse(response.body)
  console.log('123')
}))