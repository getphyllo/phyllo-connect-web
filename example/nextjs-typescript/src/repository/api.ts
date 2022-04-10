import axios, { AxiosInstance } from "axios";
import { PHYLLO_ENVIRONMENTS } from "../config";

export class BaseApi {
  private api: AxiosInstance;
  private environment = process.env.NEXT_PUBLIC_ENV;

  constructor() {
    this.api = axios.create({
      baseURL: this.getApiUrl(),
      auth: {
        username: process.env.PHYLLO_CLIENT_ID ?? "",
        password: process.env.PHYLLO_SECRET_ID ?? "",
      },
    });
  }

  public getApiUrl = () => {
    if (this.environment == PHYLLO_ENVIRONMENTS.SANDBOX) {
      return "https://api.sandbox.getphyllo.com/v1";
    } else if (this.environment == PHYLLO_ENVIRONMENTS.PRODUCTION) {
      return "https://api.getphyllo.com/v1";
    }
  };

  public getRequest = async (url: string, params?: object) => {
    try {
      const response = await this.api.get(url, { params: params });
      return response.data;
    } catch (error) {
      throw error.response.data.error;
    }
  };

  public postRequest = async (url: string, data: object) => {
    try {
      const response = await this.api.post(url, { ...data });
      return response.data;
    } catch (error) {
      throw error.response.data.error;
    }
  };
}
