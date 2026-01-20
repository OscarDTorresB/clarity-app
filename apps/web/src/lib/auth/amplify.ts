import { Amplify } from "aws-amplify";

const domain = import.meta.env.VITE_COGNITO_DOMAIN;

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
      loginWith: {
        oauth: {
          domain,
          scopes: ["openid", "email", "profile"],
          redirectSignIn: [import.meta.env.VITE_COGNITO_REDIRECT_SIGNIN],
          redirectSignOut: [import.meta.env.VITE_COGNITO_REDIRECT_SIGNOUT],
          responseType: "code",
        },
      },
    },
  },
});