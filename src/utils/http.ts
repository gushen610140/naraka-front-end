import axios from "axios";
import { devServerPath } from "./common.ts";

const http = axios.create({
  baseURL: devServerPath,
  timeout: 10000,
});

export function get<T>(url: string, params = {}): Promise<Result<T>> {
  return new Promise((resolve, reject) => {
    http
      .get(url, { params })
      .then((response) => {
        resolve(response.data as Result<T>);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function post<T>(url: string, data = {}) {
  return new Promise((resolve, reject) => {
    http
      .post(url, data)
      .then((response) => {
        resolve(response.data as Result<T>);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function put<T>(url: string, data = {}) {
  return new Promise((resolve, reject) => {
    http
      .put(url, data)
      .then((response) => {
        resolve(response.data as Result<T>);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function del<T>(url: string) {
  return new Promise((resolve, reject) => {
    http
      .delete(url)
      .then((response) => {
        resolve(response.data as Result<T>);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
