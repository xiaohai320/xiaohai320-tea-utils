import dayjs from 'dayjs'
const axios = require('axios');
const _ = require('lodash');

class HttpRequest {
  constructor(url, options = {}) {
    this.url = url;
    this.method = options.method || 'GET';
    this.headers = options.headers || {};
    this.body = options.body || null;
    this.retries = options.retries || 0;
    this.timeout = options.timeout || 0;
  }
}

class HttpClient {
  constructor(options = {}) {
    this.defaultOptions = options;
  }

  async send(request) {
    let response;
    for (let i = 0; i <= request.retries; i++) {
      try {
        const axiosConfig = {
          url: request.url,
          method: request.method,
          headers: request.headers,
          timeout: request.timeout,
          data: request.body,
        };

        // 合并默认配置
        Object.assign(axiosConfig, this.defaultOptions);

        response = await axios(axiosConfig);

        // 如果响应成功，则返回结果
        if (response.status >= 200 && response.status < 300) {
          return response.data;
        }
      } catch (error) {
        // 如果有重试次数并且尚未达到最大重试次数，则继续重试
        if (i < request.retries) continue;
        throw error;
      }
    }

    // 若所有重试均失败，则抛出最后的错误
    throw new Error(`Failed after ${request.retries} retries`);
  }

  async get(url, options = {}) {
    const req = new HttpRequest(url, { ...options, method: 'GET' });
    return this.send(req);
  }

  async post(url, body, options = {}) {
    const req = new HttpRequest(url, { ...options, method: 'POST', body });
    return this.send(req);
  }

  async put(url, body, options = {}) {
    const req = new HttpRequest(url, { ...options, method: 'PUT', body });
    return this.send(req);
  }

  async delete(url, options = {}) {
    const req = new HttpRequest(url, { ...options, method: 'DELETE' });
    return this.send(req);
  }
}
export const MobileCheck = (value) => /^[1][3,4,5,7,8][0-9]{9}$/.test(value)
export const EmailCheck = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(value)
export const ForTime = (value) => dayjs(value)
module.exports = HttpClient;