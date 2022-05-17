import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "./Delete";

const event = {
  queryStringParameters: {
    spaceId: "daf1e268-70e7-4320-900f-c3dc03041dc7",
  },
};
console.log(
  handler(event as any, {} as any).then((response) => {
    const responseData = JSON.parse(response.body);
    console.log(responseData);
  })
);
