import { requestType } from './endpionts';
import axios from 'axios';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
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

export const fetchData = async (
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
    toastInfo.info.show &&
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

    toastInfo.error.show &&
      toast.error(
        toastInfo.error.message ? toastInfo.error.message : 'Operation failed',
      );

    return { success: false };
  }
};
