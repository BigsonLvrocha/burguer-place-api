const headers = {
  'Content-Type': 'application/vnd.api+json',
  Accept: 'application/vnd.api+json',
  'Accept-Encoding': 'gzip, deflate, sdch',
  'Accept-Language': 'en-US,en;q=0.8',
  'Cache-Control': 'max-age=0',
  'CloudFront-Forwarded-Proto': 'https',
  'CloudFront-Is-Desktop-Viewer': 'true',
  'CloudFront-Is-Mobile-Viewer': 'false',
  'CloudFront-Is-SmartTV-Viewer': 'false',
  'CloudFront-Is-Tablet-Viewer': 'false',
  'CloudFront-Viewer-Country': 'US',
  Host: '1234567890.execute-api.us-east-1.amazonaws.com',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Custom User Agent String',
  Via: '1.1 08f323deadbeefa7af34d5feb414ce27.cloudfront.net (CloudFront)',
  'X-Amz-Cf-Id': 'cDehVQoZnx43VYQb9j2-nvCh-9z396Uhbp027Y2JvkCPNLmGJHqlaA==',
  'X-Forwarded-For': '127.0.0.1, 127.0.0.2',
  'X-Forwarded-Port': '443',
  'X-Forwarded-Proto': 'https',
};

const multiValueHeaders = Object.keys(headers).reduce(
  (acc, key) => {
    return {
      ...acc,
      [key]: [headers[key]],
    };
  },
  {} as Record<string, string[]>,
);

const commonContext = {
  accountId: '123456789012',
  resourceId: '123456',
  stage: 'prod',
  requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
  requestTime: '09/Apr/2015:12:34:56 +0000',
  requestTimeEpoch: 1428582896000,
  identity: {
    cognitoIdentityPoolId: null,
    accountId: null,
    cognitoIdentityId: null,
    caller: null,
    accessKey: null,
    sourceIp: '127.0.0.1',
    cognitoAuthenticationType: null,
    cognitoAuthenticationProvider: null,
    userArn: null,
    userAgent: 'Custom User Agent String',
    user: null,
  },
  apiId: '1234567890',
  protocol: 'HTTP/1.1',
  resourcePath: '/{proxy+}',
};

export const buildHttpLambdaRequest = ({
  path,
  method,
  body,
}: {
  path: string;
  method: string;
  body: any;
}) => ({
  body: JSON.stringify(body),
  resource: '/{proxy+}',
  path,
  httpMethod: method,
  isBase64Encoded: false,
  queryStringParameters: {},
  pathParameters: {},
  stageVariables: {},
  headers,
  multiValueHeaders,
  requestContext: {
    ...commonContext,
    path: `/prod${path}`,
    httpMethod: method,
  },
});
