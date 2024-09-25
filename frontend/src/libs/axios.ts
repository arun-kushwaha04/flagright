import { requestType, backendBaseUrl } from './endpionts';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export function getAuthStatus() {
  const authStatus = localStorage.getItem('authStatus');
  return authStatus ? true : false;
}
export function isUserAdmin() {
  const authStatus = localStorage.getItem('isAdmin');
  return authStatus ? true : false;
}
export function getUserId() {
  const userId = localStorage.getItem('userId');
  return userId ? parseInt(userId) : null;
}

export function setAuthStatus(userId: number, isAdmin: boolean) {
  localStorage.setItem('authStatus', 'true');
  localStorage.setItem('userId', userId.toString());
  if (isAdmin) localStorage.setItem('isAdmin', 'true');
  else localStorage.removeItem('isAdmin');
}
export function unsetAuthStatus() {
  localStorage.removeItem('authStatus');
  localStorage.removeItem('isAdmin');
  localStorage.removeItem('userId');
}

export function convertToUserReadableDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  const formattedDate = date.toLocaleDateString('en-US', options);

  return `${formattedDate}`;
}

const axiosInstance = axios.create({
  baseURL: backendBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*',
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
    } else {
      throw new Error('Operation falied');
    }

    return data;
  } catch (err) {
    console.log(err);
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError;
      if (axiosError.response) {
        if (axiosError.response.status === 401) {
          // handling token expired
          unsetAuthStatus();
          window.location.reload();
        }
      }
    }

    if (toastInfo.error.show)
      toast.error(
        toastInfo.error.message ? toastInfo.error.message : 'Operation failed',
      );

    return { success: false };
  }
};
