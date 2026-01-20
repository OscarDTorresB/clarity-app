import { Stack, StackProps, RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";
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
          origin: new origins.S3StaticWebsiteOrigin(webBucket),
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
     * Util Output
     */
    this.exportValue(distribution.domainName, {
      name: "ClarityFrontendURL",
    });
  }
}