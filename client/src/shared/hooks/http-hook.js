// function to send a request and handle data parsing, request status, code checking and state management

import { useState, useCallback, useEffect, useRef } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      console.log("sendRequest start", { url, method });
      setIsLoading(true);
      const httpAbortCtrll = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrll);
      console.log(
        "activeHttpRequests after push",
        activeHttpRequests.current.length
      );
      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrll.signal,
        });

        // Some responses (e.g. DELETE returning 204 No Content) have no body.
        // Read as text first and parse JSON only when present to avoid
        // 'Unexpected end of JSON input' errors.
        const text = await response.text();
        let responseData = null;
        try {
          responseData = text ? JSON.parse(text) : null;
        } catch (parseErr) {
          // If parsing fails, leave responseData as null; we'll still
          // treat non-ok responses below.
          responseData = null;
        }

        if (!response.ok) {
          throw new Error(
            (responseData && responseData.message) || "Request failed"
          );
        }

        console.log("sendRequest success", responseData);
        setIsLoading(false);
        return responseData;
      } catch (err) {
        console.log("sendRequest catch", err);
        if (err.name !== "AbortError") {
          setError(err.message);
        }
        throw err;
      } finally {
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (ctrll) => ctrll !== httpAbortCtrll
        );
        console.log(
          "activeHttpRequests after filter",
          activeHttpRequests.current.length
        );
        setIsLoading(false);
      }
    },
    []
  );
  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      console.log(
        "useHttpClient cleanup -> aborting",
        activeHttpRequests.current.length,
        "requests"
      );
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
