// import { User, UserAttribute } from '../model/Model'


// export class AuthService {

//     public async login(userName: string, password: string):Promise<User | undefined> {
//         if (userName === 'user' && password === '1234') {
//             return {
//                 userName: userName,
//                 email: 'some@email.com'
//             }
//         } else {
//             return undefined
//         }
//     }

//     public async getUserAttributes(user: User):Promise<UserAttribute[]>{
//         const result: UserAttribute[] = [];
//         result.push({
//             Name: 'description',
//             Value: 'Best user ever!'
//         });
//         result.push({
//             Name: 'job',
//             Value: 'Engineer'
//         });
//         result.push({
//             Name: 'age',
//             Value: '25'
//         });
//         result.push({
//             Name: 'experience',
//             Value: '3 years'
//         });
//         return result
//     }
// }

import { config } from "./config";
import { Auth, Amplify } from "aws-amplify";
import { CognitoUser } from "@aws-amplify/auth";
import * as AWS from "aws-sdk";
import { Credentials } from "aws-sdk/lib/credentials";
import { User, UserAttribute } from "../model/Model";

Amplify.configure({
  Auth: {
    mandatorySignIn: false,
    region: config.REGION,
    userPoolId: config.USER_POOL_ID,
    userPoolWebClientId: config.APP_CLIENT_ID,
    authenticationFlowType: "USER_PASSWORD_AUTH",
    identityPoolId: config.IDENTITY_POOL_ID,
  },
});

export class AuthService {
  public async login(username: string, password: string): Promise<User | undefined> {
      try {
          const user = (await Auth.signIn(username, password)) as CognitoUser;
          return {
              cognitoUser: user,
              userName: user.getUsername()
          };
      } catch (error) {
          return undefined
      }
  }

  public async getAWSTemporaryCreds(user: CognitoUser) {
    // This will pull our pool
    const cognitoIdentityPool = `cognito-idp.${config.REGION}.amazonaws.com/${config.USER_POOL_ID}`;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials(
      {
        IdentityPoolId: config.IDENTITY_POOL_ID,
        Logins: {
          [cognitoIdentityPool]: user
            .getSignInUserSession()!
            .getIdToken()
            .getJwtToken(),
        },
      },
      {
        region: config.REGION,
      }
    );
    await this.refreshCredentials()
  }

  private async refreshCredentials(): Promise<void> {
    return new Promise((resolve, reject) => {
      (AWS.config.credentials as Credentials).refresh((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public async getUserAttributes(user: User):Promise<UserAttribute[]>{
           const attributes = await Auth.userAttributes(user.cognitoUser)
            return attributes
        }
}
