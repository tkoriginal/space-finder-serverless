const spacesUrl = 'https://khdbfr661j.execute-api.us-east-1.amazonaws.com/prod'

export const config = {
  REGION: 'us-east-1',
  USER_POOL_ID: 'us-east-1_WQWZPmYSZ',
  APP_CLIENT_ID: '5ujrhr87c6f9tm3078l683leku',
  TEST_USER_NAME: 'tasknetus1',
  TEST_PASSWORD: 'Testtest11[[',
  IDENTITY_POOL_ID: 'us-east-1:5ea1969d-530f-457f-bf10-583e23202a63',
  SPACE_PHOTOS_BUCKET: 'spaces-photos-0e31d762a753',
  api: {
    baseUrl: spacesUrl,
    spacesUrl: `${spacesUrl}/spaces`
  }
}