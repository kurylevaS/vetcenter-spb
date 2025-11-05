export interface IResponse<T> {
  message: string;
  success: boolean;
  data: T;
}

export interface IExampleResponse {
  id: number;
  date: number;
  email: string;
  name: string;
}

export interface IExampleRequest {
  email: string;
  code: string;
}
