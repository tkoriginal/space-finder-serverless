import { CfnOutput } from 'aws-cdk-lib';
import { CognitoUserPoolsAuthorizer, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Mfa, UserPool, UserPoolClient, CfnUserPoolGroup } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';
import { IdentityPoolWrapper } from './IdentityPoolWrapper'



export class AuthorizerWrapper {
  private scope: Construct
  private api: RestApi
  private id: string
  private photoBucketArn: string

  private userPool: UserPool
  private userPoolClient: UserPoolClient;
  public authorizer: CognitoUserPoolsAuthorizer;
  private identityPoolWrapper: IdentityPoolWrapper;

  constructor(scope: Construct, api: RestApi, id: string, photoBucketArn: string) {
    this.scope = scope;
    this.api = api;
    this.id = id;
    this.photoBucketArn = photoBucketArn;
    this.initialize();
  }

  private initialize() {
    this.createUserPool()
    this.addUserPoolClient()
    this.createAuthorizer()
    this.initializeIdentityPoolWrapper()
    this.createAdminGroup()
  }

  private createUserPool() {
    this.userPool = new UserPool(this.scope, `${this.id}Pool`, {
      userPoolName: `${this.id}Pool`,
      selfSignUpEnabled: true,
      signInAliases: {
        username: true,
        email: true
      },
    })

    new CfnOutput(this.scope, 'UserPoolId', {
      value: this.userPool.userPoolId
    })
  }

  private addUserPoolClient() {
    this.userPoolClient = this.userPool.addClient(`${this.id}Pool-client`, {
      userPoolClientName: `${this.id}Pool-client`,
      authFlows: {
        adminUserPassword: true,
        custom: true,
        userPassword: true,
        userSrp: true
      },
      generateSecret: false
    });
    new CfnOutput(this.scope, 'UserPoolClientId', {
      value: this.userPoolClient.userPoolClientId
    })
  }

  private createAuthorizer() {
    this.authorizer = new CognitoUserPoolsAuthorizer(this.scope, `${this.id}Authorizer`, {
      cognitoUserPools: [this.userPool],
      authorizerName: `${this.id}Authorizer`,
      identitySource: 'method.request.header.Authorization',
    })
    this.authorizer._attachToApi(this.api)
  }

  private initializeIdentityPoolWrapper() {
    this.identityPoolWrapper = new IdentityPoolWrapper(this.scope, this.userPool, this.userPoolClient, this.photoBucketArn)
  }

  private createAdminGroup() {
    new CfnUserPoolGroup(this.scope, 'admin', {
      groupName: 'admin',
      userPoolId: this.userPool.userPoolId,
      roleArn: this.identityPoolWrapper.adminRole.roleArn
    })
  }

}