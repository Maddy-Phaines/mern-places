// update title and description only when authenticated (for user to edit one of their existing places)
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import Toast from "../../shared/components/UIElements/Toast";
import Input from "../../shared/components/FormElements/input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import "./placeForm.css";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";

const UpdatePlace = () => {
  const { placeId } = useParams();
  const [loadedPlace, setLoadedPlace] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  // Start with empty inputs; after loading the place we will populate them
  const [formState, handleFormChange, setFormData] = useForm(
    {
      title: { value: "", isValid: false },
      description: { value: "", isValid: false },
    },
    false
  );

  /*  useEffect(() => {
    setFormData(
      {
        title: {
          value: formState.inputs.title.value,
          isValid: true,
        },
        description: {
          value: formState.inputs.description.value,
          isValid: true,
        },
      },
      true
    );
  }, [setFormData]); */

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/${placeId}`
        );
        setLoadedPlace(responseData.place);

        // Populate the form with fetched data and mark as valid
        setFormData(
          {
            title: { value: responseData.place.title, isValid: true },
            description: { value: responseData.place.description, isValid: true },
          },
          true
        );
      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, setFormData, placeId]);

  const handleUpdatePlaceSubmit = async (e) => {
    e.preventDefault();

    try {
      await sendRequest(
        `http://localhost:5000/api/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        { "Content-Type": "application/json" }
      );
      // show a short success toast, then navigate so users get feedback
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/" + auth.userId + "/places");
      }, 1200);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }
  if (!loadedPlace) {
    return (
      <div className="center">
        <Card>
          <h2>Place not found!</h2>
        </Card>
      </div>
    );
  }

  // Block editing if the current user is not the creator
  if (loadedPlace.creator && loadedPlace.creator !== auth.userId) {
    return (
      <div className="center">
        <Card>
          <h2>Not authorized</h2>
          <p>You are not allowed to edit this place.</p>
        </Card>
      </div>
    );
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Toast open={showSuccess} message="Place updated" />
      <form className="place-form" onSubmit={handleUpdatePlaceSubmit}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={handleFormChange}
          initialValue={loadedPlace.title}
          initialValid={formState.inputs.title.isValid}
        />

        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (min length of 5 characters)."
          onInput={handleFormChange}
          initialValue={loadedPlace.description}
          initialValid={formState.inputs.description.isValid}
        />
        <Button type="submit" disabled={!formState.isValid}>
          UPDATE PLACE
        </Button>
      </form>
    </>
  );
};

export default UpdatePlace;
