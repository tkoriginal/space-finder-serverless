import { CognitoUser } from '@aws-amplify/auth';
import { config } from './config';
import { AuthService } from './AuthService'

const authService = new AuthService()

authService.login(config.TEST_USER_NAME, config.TEST_PASSWORD).then(data => {
  console.log(data)
})