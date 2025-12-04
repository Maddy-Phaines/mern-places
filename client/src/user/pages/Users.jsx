import UsersList from "../components/usersList";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";

import { useState, useEffect, useRef } from "react";

const Users = () => {
  const [loadedUsers, setLoadedUsers] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    // Fetch users on mount. The hook uses AbortController and ignores AbortError;
    // `isMountedRef` prevents calling setState after unmount as an extra safeguard.
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users"
        );

        if (!isMountedRef.current) return;
        if (responseData?.users) {
          setLoadedUsers(responseData.users);
        }
      } catch (err) {
        if (err && err.name !== "AbortError") {
          // eslint-disable-next-line no-console
          console.error("Users -> fetchUsers error", err);
        }
      }
    };

    fetchUsers();
    return () => {
      isMountedRef.current = false;
    };
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </>
  );
};

export default Users;
