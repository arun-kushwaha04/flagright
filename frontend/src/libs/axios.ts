import { requestType, backendBaseUrl } from './endpionts';
import axios from 'axios';
import { toast } from 'react-toastify';

export function getCookie(name: string) {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function setCookie(name: string, value: string) {
  document.cookie = name + '=' + (value || '');
}

const axiosInstance = axios.create({
  baseURL: backendBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

type toastInfoType = {
  success?: {
    show: boolean;
    message?: string | null;
  };
  error?: {
    show: boolean;
    message?: string | null;
  };
  info?: {
    show: boolean;
    message?: string | null;
  };
};

export const performAPICall = async (
  url: string,
  type: requestType,
  option = {},
  toastInfo: toastInfoType = {},
) => {
  if (!toastInfo.success) {
    toastInfo.success = {
      show: false,
      message: null,
    };
  }

  if (!toastInfo.info) {
    toastInfo.info = {
      show: false,
      message: null,
    };
  }

  if (!toastInfo.error) {
    toastInfo.error = {
      show: false,
      message: null,
    };
  }

  try {
    if (toastInfo.info.show)
      toast.info(
        toastInfo.info.message ? toastInfo.info.message : 'Intializing request',
      );

    let response;

    if (type === requestType.GET)
      response = await axiosInstance.get(url, option);
    else if (type === requestType.POST)
      response = await axiosInstance.post(url, option);
    else if (type === requestType.PUT)
      response = await axiosInstance.put(url, option);
    else response = await axiosInstance.delete(url, option);

    if (response.status === 301) return null;

    const data = response.data;

    if (data.success) {
      if (data.message && toastInfo.success.show)
        toast.success(
          toastInfo.success.message ? toastInfo.success.message : data.message,
        );
      console.log(response.headers['set-cookie']);
      setCookie('toast', response.headers.cookie);
    } else {
      throw new Error('Operation falied');
    }

    return data;
  } catch (err) {
    console.log(err);

    if (toastInfo.error.show)
      toast.error(
        toastInfo.error.message ? toastInfo.error.message : 'Operation failed',
      );

    return { success: false };
  }
};
