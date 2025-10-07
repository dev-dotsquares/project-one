export default () => ({
  node_env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || 'api/v1',

  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '3306', 10),
    username: process.env.DATABASE_USERNAME || 'hpbs_user',
    password: process.env.DATABASE_PASSWORD || 'hpbs_password',
    database: process.env.DATABASE_NAME || 'hpbs_pkh',
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    logging: process.env.DATABASE_LOGGING === 'true',
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || '0', 10),
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'your-access-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
    privateKeyPath: process.env.JWT_PRIVATE_KEY_PATH,
    publicKeyPath: process.env.JWT_PUBLIC_KEY_PATH,
  },

  s3: {
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION || 'us-east-1',
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    bucket: process.env.S3_BUCKET || 'hpbs-pkh',
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
  },

  smtp: {
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '1025', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    fromEmail: process.env.SMTP_FROM_EMAIL || 'noreply@hpbs.com',
    fromName: process.env.SMTP_FROM_NAME || 'HPBS PKH',
  },

  aiVoice: {
    apiUrl: process.env.AI_VOICE_API_URL || '',
    apiKey: process.env.AI_VOICE_API_KEY || '',
  },

  heygen: {
    apiUrl: process.env.HEYGEN_API_URL || 'https://api.heygen.com',
    apiKey: process.env.HEYGEN_API_KEY || '',
  },

  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
    passwordResetTokenExpiration: process.env.PASSWORD_RESET_TOKEN_EXPIRATION || '1h',
    uploadPresignedUrlExpiration: parseInt(process.env.UPLOAD_PRESIGNED_URL_EXPIRATION || '300', 10),
    downloadPresignedUrlExpiration: parseInt(process.env.DOWNLOAD_PRESIGNED_URL_EXPIRATION || '3600', 10),
  },

  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
    authLimit: parseInt(process.env.THROTTLE_AUTH_LIMIT || '5', 10),
    aiLimit: parseInt(process.env.THROTTLE_AI_LIMIT || '10', 10),
  },

  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },

  observability: {
    logLevel: process.env.LOG_LEVEL || 'info',
    logPretty: process.env.LOG_PRETTY === 'true',
  },

  features: {
    aiVoiceEnabled: process.env.FEATURE_AI_VOICE_ENABLED !== 'false',
    videoProgressTracking: process.env.FEATURE_VIDEO_PROGRESS_TRACKING !== 'false',
    analyticsEnabled: process.env.FEATURE_ANALYTICS_ENABLED !== 'false',
  },

  clamav: {
    host: process.env.CLAMAV_HOST || 'localhost',
    port: parseInt(process.env.CLAMAV_PORT || '3310', 10),
  },
});