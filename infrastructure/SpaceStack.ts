import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  Function as LambdaFunction,
  Runtime,
  Code,
} from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

import { GenericTable } from "./GenericTable";
export class SpaceStack extends Stack {
  private api = new RestApi(this, "SpaceApi");
  private spaceTable = new GenericTable("SpacesTable", "spaceId", this);

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const helloLambda = new LambdaFunction(this, "HelloLambda", {
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset(join(__dirname, "..", "services", "hello")),
      handler: "hello.main",
    });

    const helloLambadaNodeJs = new NodejsFunction(this, "NodeJsFunction", {
      entry: join(__dirname, "..", "services", "node-lambda", "hello.ts"),
      handler: "handler",
    });
    // Hello API lambda integration
    const helloLambdaIntegration = new LambdaIntegration(helloLambda);
    const helloLamdaResource = this.api.root.addResource("hello");
    helloLamdaResource.addMethod("GET", helloLambdaIntegration);
  }
}
