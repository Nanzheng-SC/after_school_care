import axios from 'axios';

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://jaimie-unthwarted-oversocially.ngrok-free.dev', // 使用环境变量配置的后端地址
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    'ngrok-skip-browser-warning': 'true', // 添加ngrok浏览器警告跳过
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 记录请求信息
    console.log('API请求信息:');
    console.log('URL:', (config.baseURL || '') + (config.url || ''));
    console.log('方法:', config.method);
    console.log('参数:', config.params || config.data || '无参数');
    console.log('请求头:', config.headers);
    console.log('-------------------');
    return config;
  },
  (error) => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    console.log('API响应信息:');
    console.log('状态码:', response.status);
    console.log('响应头:', response.headers);
    console.log('响应数据:', response.data);
    console.log('-------------------');
    return response;
  },
  (error) => {
    console.error('API请求错误详情:');
    console.error('错误信息:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应头:', error.response.headers);
      console.error('响应数据:', error.response.data);
    } else if (error.request) {
      console.error('请求已发送但没有收到响应');
    } else {
      console.error('请求配置错误:', error.message);
    }
    console.log('-------------------');
    return Promise.reject(error);
  }
);

export default request;