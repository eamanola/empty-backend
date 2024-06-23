const accessDenied = {
  message: 'Access denied',
  name: 'accessDenied',
  status: 403,
};

const paramError = {
  message: 'Invalid parameters',
  name: 'paramError',
  status: 400,
};

const createParamError = ({ message }) => ({
  ...paramError,
  message,
});

module.exports = {
  accessDenied,
  createParamError,
  paramError,
};
