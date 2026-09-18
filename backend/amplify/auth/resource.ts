import { defineAuth, secret } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
    phone: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
        scopes: ['email', 'profile', 'openid']
      },
      callbackUrls: [
        'saferoute://',
        'http://localhost:8081/'
      ],
      logoutUrls: [
        'saferoute://',
        'http://localhost:8081/'
      ],
    }
  },
  userAttributes: {
    "custom:trustedContactsCount": {
      dataType: 'Number',
      mutable: true,
    }
  }
});
