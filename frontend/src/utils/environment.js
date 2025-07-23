// Environment utility to handle feature flags
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development' || 
         process.env.REACT_APP_SHOW_DEV_FEATURES === 'true';
};

export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

export const getDefaultProvider = () => {
  return process.env.REACT_APP_DEFAULT_PROVIDER || 'gemini';
}; 