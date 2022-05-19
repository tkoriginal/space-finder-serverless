import { config } from './config';
import { AuthService } from './AuthService'
import * as AWS from 'aws-sdk'

async function run() {
  const authService = new AuthService()
  
  const user = await authService.login(config.TEST_USER_NAME, config.TEST_PASSWORD)
  await authService.getAWSTemporaryCreds(user)
  const someCreds = AWS.config.credentials
  const a = 5
}

run()