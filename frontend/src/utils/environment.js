// Environment utility to handle feature flags
export const isDevelopment = () => {
  // If REACT_APP_SHOW_DEV_FEATURES is explicitly set, use that value
  if (process.env.REACT_APP_SHOW_DEV_FEATURES !== undefined) {
    return process.env.REACT_APP_SHOW_DEV_FEATURES === 'true';
  }
  // Otherwise, default to showing dev features in development mode
  return process.env.NODE_ENV === 'development';
};

export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

export const getDefaultProvider = () => {
  return process.env.REACT_APP_DEFAULT_PROVIDER || 'gemini';
}; 