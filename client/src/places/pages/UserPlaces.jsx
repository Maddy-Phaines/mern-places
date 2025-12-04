import PlaceList from "../components/PlaceList";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

import { useState, useEffect } from "react";
import Toast from "../../shared/components/UIElements/Toast";
import { useParams } from "react-router-dom";

const UserPlaces = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { userId } = useParams();
  const [loadedPlaces, setLoadedPlaces] = useState();
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  useEffect(() => {
    const fetchUserPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`
        );

        setLoadedPlaces(responseData.places);
      } catch (err) {}
    };
    fetchUserPlaces();
  }, [sendRequest]);

  const handleDeletePlace = (placeToDelete) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== placeToDelete)
    );
    setToastVariant("success");
    setToastMessage("Place deleted");
    setToastOpen(true);
  };

  const handleDeleteError = (message) => {
    setToastVariant("error");
    setToastMessage(message || "Failed to delete place");
    setToastOpen(true);
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <>
          <PlaceList items={loadedPlaces} onDeletePlace={handleDeletePlace} onDeleteError={handleDeleteError} />
          {/* Toast placed near the list so user sees feedback */}
          <div>
            {/* lazy import of toast component to avoid multiple placements; import inline */}
          </div>
        </>
      )}
      {/* Toast rendered at page level so it's always visible */}
      <Toast open={toastOpen} message={toastMessage} variant={toastVariant} onClose={() => setToastOpen(false)} duration={1600} />
    </>
  );
};

export default UserPlaces;
