const AUTH_PREFIX = 'bearer ';

const extractToken = (authorizationHeader) => {
  const token = (
    authorizationHeader
    && authorizationHeader.toLowerCase().startsWith(AUTH_PREFIX)
  )
    ? authorizationHeader.substring(AUTH_PREFIX.length)
    : null;

  return token;
};

module.exports = {
  extractToken,
};
