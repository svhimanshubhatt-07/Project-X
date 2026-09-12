import { tokenService } from '../storage/token.service';
import { handleApiError } from './apiErrorHandler';

class ApiClient {
  private baseUrl: string = '/api/v1';

  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const token = tokenService.getToken();
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    
    // In our mock-ready frontend, apiClient will provide standardized interface
    return { data: null } as any;
  }

  async post<T>(url: string, body?: any): Promise<T> {
    return { data: null } as any;
  }

  async put<T>(url: string, body?: any): Promise<T> {
    return { data: null } as any;
  }

  async delete<T>(url: string): Promise<T> {
    return { data: null } as any;
  }
}

export const apiClient = new ApiClient();
