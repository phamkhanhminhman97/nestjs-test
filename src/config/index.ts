/* eslint-disable import/no-default-export */

export function hasShowDebugInfo() {
  return ['development', 'staging', 'production'].includes(process.env.NODE_ENV);
}

export function hasShowDebugInfoDB() {
  return ['staging'].includes(process.env.NODE_ENV);
}

export function displayAppName() {
  return process.env.APP_NAME || 'LTO-local';
}

export default () => ({
  appName: displayAppName(),
  appEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 3210,
  jwt: {
    secret: process.env.JWT_SECRET_KEY,
    expireTime: process.env.EXPIRE_TIME,
  },
  facebook: {
    id: process.env.FACEBOOK_APP_ID,
    secret: process.env.FACEBOOK_APP_SECRET,
  },
  google: {
    id: process.env.GOOGLE_ID,
  },
  apple: {
    id: process.env.APPLE_ID,
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    bucket: process.env.S3_BUCKET,
    cdn: process.env.CDN,
    region: process.env.S3_REGION,
  },
  awsSES: {
    accessKeyId: process.env.AWS_ACCESS_KEY_SES,
    secretAccessKey: process.env.AWS_SECRET_KEY_SES,
    region: process.env.SES_REGION,
    emailSender: process.env.SES_SENDER,
  },
  sentry: {
    dns: process.env.SENTRY_DNS,
  },
  cache: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    ttl: '60000',
  },
  predict: {
    elasticURL: process.env.ELASTICSEARCH,
    elasticNameIndex: process.env.ELASTIC_NAME_INDEX,
    elasticUser: process.env.ELASTIC_USER,
    elasticPassword: process.env.ELASTIC_PASSWORD,
    googleApiKey: process.env.GOOGLE_API_KEY,
  },
});
