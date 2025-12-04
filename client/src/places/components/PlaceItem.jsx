import "./PlaceItem.css";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

import { useState, useContext } from "react";
import { useParams } from "react-router-dom";

import PropTypes from "prop-types";

const PlaceItem = ({
  image,
  title,
  address,
  description,
  id,
  coordinates,
  creatorId,
  onDeletePlace,
  onDeleteError,
}) => {
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { placeId } = useParams();

  const auth = useContext(AuthContext);
  const showMapHandler = () => {
    setShowMap(true);
  };

  const closeMapHandler = () => {
    setShowMap(false);
  };

  const confirmDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    console.log("Deleting...");
    setShowConfirmModal(false);
    try {
      await sendRequest(`http://localhost:5000/api/places/${id}`, "DELETE");
      // Notify parent that deletion succeeded
      if (typeof onDeletePlace === "function") onDeletePlace(id);
    } catch (err) {
      // Notify parent of failure so it can show feedback
      if (typeof onDeleteError === "function")
        onDeleteError(err?.message || "Failed to delete place");
      return;
    }
  };
  return (
    <>
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to delete this place? Please be aware that, once
          taken, this action cannot be undone.
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img src={`http://localhost:5000/${image}`} alt={title} />
          </div>
          <div className="place-item__info">
            <h2>{title}</h2>
            <h3>{address}</h3>
            <p>{description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={showMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.userId === creatorId && (
              <>
                <Button to={`/places/${id}`}>EDIT PLACE</Button>
                <Button danger onClick={confirmDeleteWarningHandler}>
                  DELETE
                </Button>
              </>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;

PlaceItem.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string.isRequired,
  address: PropTypes.string,
  description: PropTypes.string,
  id: PropTypes.string.isRequired,
  coordinates: PropTypes.object,
  onDeletePlace: PropTypes.func,
  onDeleteError: PropTypes.func,
  creatorId: PropTypes.string,
};
