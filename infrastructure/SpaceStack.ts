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
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
export class SpaceStack extends Stack {
  private api = new RestApi(this, "SpaceApi");
  private spaceTable = new GenericTable("SpacesTable", "spaceId", this);

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const helloLambadaNodeJs = new NodejsFunction(this, "NodeJsFunction", {
      entry: join(__dirname, "..", "services", "node-lambda", "hello.ts"),
      handler: "handler",
    });
    
    const s3ListPolicy = new PolicyStatement()
    s3ListPolicy.addActions('s3:ListAllMyBuckets')
    s3ListPolicy.addResources('*')

    helloLambadaNodeJs.addToRolePolicy(s3ListPolicy)
    // Hello API lambda integration
    const helloLambdaIntegration = new LambdaIntegration(helloLambadaNodeJs);
    const helloLamdaResource = this.api.root.addResource("hello");
    helloLamdaResource.addMethod("GET", helloLambdaIntegration);
  }
}
