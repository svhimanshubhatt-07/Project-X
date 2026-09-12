import { ApiError } from '../../types/api.types';

export function handleApiError(error: any): ApiError {
  if (error?.response?.data) {
    return {
      message: error.response.data.message || 'An error occurred with the server request.',
      statusCode: error.response.status || 500,
      errors: error.response.data.errors,
    };
  }

  return {
    message: error?.message || 'Network error. Please check your connection.',
    statusCode: 0,
  };
}
