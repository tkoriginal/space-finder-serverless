import { Space } from "./../Shared/model";
// Lambda to added data to sdk
import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { addCorsHeader, getEventBody } from "../Shared/Utils";

const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;

const dbClient = new DynamoDB.DocumentClient();

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: "Hello from DynamoDB",
  };
  addCorsHeader(result)
  try {
    const requestBody = getEventBody(event);
    const spaceId = event.queryStringParameters?.[PRIMARY_KEY!];

    if (requestBody && spaceId) {
      const requestBodyKey = Object.keys(requestBody)[0] as keyof Space;
      const requestBodyValue = requestBody[requestBodyKey];

      const updateResult = await dbClient
        .update({
          TableName: TABLE_NAME!,
          Key: {
            [PRIMARY_KEY!]: spaceId,
          },
          UpdateExpression: "set #zzzNew = :new",
          ExpressionAttributeValues: {
            ":new": requestBodyValue,
          },
          ExpressionAttributeNames: {
            "#zzzNew": requestBodyKey,
          },
          ReturnValues: "UPDATED_NEW",
        })
        .promise();

      result.body = JSON.stringify(updateResult);
    }
  } catch (error) {
    if (error instanceof Error) {
      result.body = error.message
    }
  }
  return result;
}
