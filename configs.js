const dotenv = require('dotenv');

module.exports = async ({ options, resolveConfigurationProperty }) => {
  // Load env vars into Serverless environment
  // You can do more complicated env var resolution with dotenv here
  const envVars = dotenv.config({ path: '.env' }).parsed;
  return Object.assign(
    {},
    envVars, // `dotenv` environment variables
  );
};
