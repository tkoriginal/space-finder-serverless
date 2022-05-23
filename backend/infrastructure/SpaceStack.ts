import { AuthorizerWrapper } from "./auth/AuthorizerWrapper";
import { CfnOutput, Fn, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { join } from "path";
import {
  AuthorizationType,
  LambdaIntegration,
  MethodOptions,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

import { GenericTable } from "./GenericTable";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import lambdaPaths from "./LambdaPaths";
import { Bucket, HttpMethods } from "aws-cdk-lib/aws-s3";
import { WebAppDeployment } from "./WebAppDeployment";
export class SpaceStack extends Stack {
  private authorizer: AuthorizerWrapper;
  private api = new RestApi(this, "SpaceApi");
  private suffix: string;
  private spacesPhotosBucket: Bucket;

  private spaceTable = new GenericTable(this, {
    tableName: "SpacesTable",
    primaryKey: "spaceId",
    lambdaPaths: lambdaPaths,
    secondaryIndexes: ["location"],
  });

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);
    this.initializeSuffix();
    this.initializeSpacesPhotosBucket();
    this.authorizer = new AuthorizerWrapper(
      this,
      this.api,
      "SpaceUser",
      this.spacesPhotosBucket.bucketArn + "/*"
    );

    new WebAppDeployment(this, this.suffix)

    const s3ListPolicy = new PolicyStatement();
    s3ListPolicy.addActions("s3:ListAllMyBuckets");
    s3ListPolicy.addResources("*");

    const optionsWithAuthorizer: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: this.authorizer.authorizer.authorizerId,
      },
    };

    // Space API integration:
    const spaceResources = this.api.root.addResource("spaces");
    for (let lambdaPath of lambdaPaths) {
      spaceResources.addMethod(
        lambdaPath.method,
        this.spaceTable.lambdaOperations[lambdaPath.path].lambdaIntegration,
        optionsWithAuthorizer
      );
    }
  }

  private initializeSuffix() {
    const shortStackId = Fn.select(2, Fn.split("/", this.stackId));
    const Suffix = Fn.select(4, Fn.split("-", shortStackId));
    this.suffix = Suffix;
  }

  private initializeSpacesPhotosBucket() {
    this.spacesPhotosBucket = new Bucket(this, "spaces-photos", {
      bucketName: "spaces-photos-" + this.suffix,
      cors: [
        {
          allowedMethods: [HttpMethods.GET, HttpMethods.HEAD, HttpMethods.PUT],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
        },
      ],
    });
    new CfnOutput(this, "spaces-photos-bucket-name", {
      value: this.spacesPhotosBucket.bucketName,
    });
  }

}
