'use strict';

const endpointEnv = process.env.ENDPOINT_ENV || 'cf';

const ENV = {
  STAGE: 'production',
  BASE_URL: '/',
  DOMAIN_URL: 'instantmiso.com',
  ENDPOINT_ENV: endpointEnv,
  NODE_ENV: process.env.NODE_ENV || '',
  GENERATE_ERROR_PAGE: Boolean(process.env.GENERATE_ERROR_PAGE),
};

if (endpointEnv === 'api_gw') {
  ENV.BASE_STAGE = `/${ENV.STAGE}/`;
}

// for serverless.yml
const exporter = () => {
  return ENV;
};

module.exports = {
  ENV,
  exporter,
};
