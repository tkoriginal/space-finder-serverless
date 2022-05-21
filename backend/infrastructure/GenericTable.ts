import { LambdaPath } from './LambdaPaths';
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { Stack } from "aws-cdk-lib";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { join } from "path";

export enum Access {
  READ,
  WRITE,
}

export interface TableProps {
  tableName: string;
  primaryKey: string;
  lambdaPaths: LambdaPath[];
  createLambdaPath?: string;
  readLambdaPath?: string;
  updateLambdaPath?: string;
  deleteLambdaPath?: string;
  secondaryIndexes?: string[];
}

export class GenericTable {
  private stack: Stack;
  private table: Table;
  private props: TableProps;
  public lambdaOperations: {
    [key: string]: {
      lambdaFunction: NodejsFunction;
      lambdaIntegration: LambdaIntegration;
    };
  };

  public constructor(stack: Stack, props: TableProps) {
    this.stack = stack;
    this.props = props;
    this.lambdaOperations = {}
    this.initialize();
  }

  private initialize() {
    this.createTable();
    this.addSecondaryIndexes();
    this.createLambdas();
    this.grantTableRights();
  }

  private createTable() {
    this.table = new Table(this.stack, this.props.tableName, {
      partitionKey: {
        name: this.props.primaryKey,
        type: AttributeType.STRING,
      },
      tableName: this.props.tableName,
    });
  }

  private addSecondaryIndexes() {
    if (this.props.secondaryIndexes?.length) {
      for (const secondaryIndex of this.props.secondaryIndexes) {
        this.table.addGlobalSecondaryIndex({
          indexName: secondaryIndex,
          partitionKey: {
            name: secondaryIndex,
            type: AttributeType.STRING,
          },
        });
      }
    }
  }

  private createLambdas() {
    for (let lambdaPath of this.props.lambdaPaths) {
      const lambdaFunction = this.createSingleLambda(lambdaPath.path);
      const lambdaIntegration = new LambdaIntegration(lambdaFunction);
      this.lambdaOperations[lambdaPath.path] = {
        lambdaFunction,
        lambdaIntegration,
      };
    }
  }

  private createSingleLambda(lambdaName: string): NodejsFunction {
    const lambdaId = this.props.tableName + "-" + lambdaName;
    return new NodejsFunction(this.stack, lambdaId, {
      entry: join(
        __dirname,
        "..",
        "services",
        this.props.tableName,
        `${lambdaName}.ts`
      ),
      handler: "handler",
      functionName: lambdaId,
      environment: {
        TABLE_NAME: this.props.tableName,
        PRIMARY_KEY: this.props.primaryKey,
      },
    });
  }
  private grantTableRights() {
    for (let lambdaPath of this.props.lambdaPaths) {
      for (let access of lambdaPath.access) {
        if (access === Access.READ) {
          this.table.grantReadData(
            this.lambdaOperations[lambdaPath.path].lambdaFunction
          );
        }
        if (access === Access.WRITE) {
          this.table.grantWriteData(
            this.lambdaOperations[lambdaPath.path].lambdaFunction
          );
        }
      }
    }
  }
}
