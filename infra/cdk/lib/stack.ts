import { Stack, StackProps, RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CfnOutput } from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";

export class CoreStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /**
     * S3 bucket for frontend
     */
    const webBucket = new s3.Bucket(this, "WebBucket", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    /**
     * CloudFront distribution
     */
    const distribution = new cloudfront.Distribution(
      this,
      "WebDistribution",
      {
        defaultRootObject: "index.html",
        defaultBehavior: {
          origin: origins.S3BucketOrigin.withOriginAccessControl(webBucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
          },
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
          },
        ],
      }
    );

    /**
     * Static Frontend Deployment
     */
    new s3deploy.BucketDeployment(this, "WebDeploy", {
      sources: [s3deploy.Source.asset("../../apps/web/dist")],
      destinationBucket: webBucket,
      distribution,
      distributionPaths: ["/*"],
    });

    /**
     * Cognito User Pool
     */
    const userPool = new cognito.UserPool(this, "ClarityUserPool", {
      userPoolName: "clarity-users",
      standardAttributes: {
        email: { required: true, mutable: true },
        givenName: { required: true, mutable: true },
        familyName: { required: true, mutable: true },
      },
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      removalPolicy: RemovalPolicy.DESTROY,
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
    });

    const cloudfrontUrl = `https://${distribution.domainName}`;

    /**
     * User Pool Client
     */
    const userPoolClient = userPool.addClient("ClarityWebClient", {
      userPoolClientName: "clarity-web-client",
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.PROFILE,
        ],
        callbackUrls: [
          'http://localhost:5173/auth/callback',
          `${cloudfrontUrl}/auth/callback`
        ],
        logoutUrls: [
          'http://localhost:5173/',
          `${cloudfrontUrl}/`
        ],
      },
    });

    // --- Hosted UI Domain (Cognito managed) ---
    const stackName = Stack.of(this).stackName;
    const rawPrefix = `clarity-${stackName}-${this.node.addr}`;
    const domainPrefix = rawPrefix
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 63);

    const userPoolDomain = userPool.addDomain("ClarityDomain", {
      cognitoDomain: { domainPrefix },
    });

    /**
     * Util Output
     */
    this.exportValue(distribution.domainName, {
      name: "ClarityFrontendURL",
    });
    new CfnOutput(this, "CognitoUserPoolId", { value: userPool.userPoolId });
    new CfnOutput(this, "CognitoUserPoolClientId", { value: userPoolClient.userPoolClientId });
    new CfnOutput(this, "CognitoDomain", { value: userPoolDomain.domainName });
    new CfnOutput(this, "CognitoHostedUiUrl", {
      value:
        `https://${userPoolDomain.domainName}/login` +
        `?client_id=${userPoolClient.userPoolClientId}` +
        `&response_type=code` +
        `&scope=openid+email+profile` +
        `&redirect_uri=${encodeURIComponent(`${cloudfrontUrl}/auth/callback`)}`,
    });
  }
}
