import { AuthorizerWrapper } from './auth/AuthorizerWrapper';
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { join } from "path";
import { AuthorizationType, LambdaIntegration, MethodOptions, RestApi } from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

import { GenericTable } from "./GenericTable";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import lambdaPaths from "./LambdaPaths";

export class SpaceStack extends Stack {
  private authorizer: AuthorizerWrapper;
  private api = new RestApi(this, "SpaceApi");
  private spaceTable = new GenericTable(this, {
    tableName: 'SpacesTable',
    primaryKey: 'spaceId',
    lambdaPaths: lambdaPaths,
    secondaryIndexes: ['location']
  });

   
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);
    this.authorizer = new AuthorizerWrapper(this, this.api, 'SpaceUser')
    const helloLambadaNodeJs = new NodejsFunction(this, "NodeJsFunction", {
      entry: join(__dirname, "..", "services", "node-lambda", "hello.ts"),
      handler: "handler",
    });

    const s3ListPolicy = new PolicyStatement()
    s3ListPolicy.addActions('s3:ListAllMyBuckets')
    s3ListPolicy.addResources('*')

    helloLambadaNodeJs.addToRolePolicy(s3ListPolicy)

    const optionsWithAuthorizer: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: this.authorizer.authorizer.authorizerId
      }
    }
    // Hello API lambda integration
    const helloLambdaIntegration = new LambdaIntegration(helloLambadaNodeJs);
    const helloLambdaResource = this.api.root.addResource("hello");
    helloLambdaResource.addMethod("GET", helloLambdaIntegration, optionsWithAuthorizer);

    // Space API integration:
    const spaceResources = this.api.root.addResource('spaces');
    for (let lambdaPath of lambdaPaths) {
        spaceResources.addMethod(lambdaPath.method, this.spaceTable.lambdaOperations[lambdaPath.path].lambdaIntegration)
      }
  }
}
