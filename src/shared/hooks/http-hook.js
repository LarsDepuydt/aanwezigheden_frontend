import { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";

import axiosRoot from "./axios-root";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "get", body = null, headers = {}) => {
      setIsLoading(true);

      const source = axios.CancelToken.source();
      activeHttpRequests.current.push(source);

      try {
        let response;
        if (method === "get") {
          response = await axiosRoot[method](url, {
            headers: headers,
            params: body,
            cancelToken: source.token,
          });
        } else {
          response = await axiosRoot[method](url, body, {
            headers: headers,
            cancelToken: source.token,
          });
        }

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== source
        );

        setIsLoading(false);
        return response.data;
      } catch (err) {
        if (err.message) {
          setError(err.message);
        }
        if (err.response) {
          setError(err.response.data.message);
        }
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((source) => source.cancel());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
