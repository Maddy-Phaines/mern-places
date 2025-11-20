// update title and description only when authenticated (for user to edit one of their existing places)
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Input from "../../shared/components/FormElements/input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import "./placeForm.css";
import { useForm } from "../../shared/hooks/form-hook";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "View of the Empire State Building from Rockerfeller Center",
    creator: "u1",
    imageURL:
      "https://images.pexels.com/photos/14270758/pexels-photo-14270758.jpeg",
    location: { lat: 40.7484405, lng: -73.9882393 },
    description: "One of the most famous skycrapers in the world!",
    address: "20 W 34th St., New York, NY 10001, United States",
  },
  {
    id: "p2",
    title: "View of the Empire State Building from Rockerfeller Center",
    creator: "u2",
    imageURL:
      "https://images.pexels.com/photos/14270758/pexels-photo-14270758.jpeg",
    location: { lat: 40.7484405, lng: -73.9882393 },
    description: "One of the most famous skycrapers in the world!",
    address: "20 W 34th St., New York, NY 10001, United States",
  },

  {
    id: "p3",
    title: "View of the Empire State Building from Rockerfeller Center",
    creator: "u3",
    imageURL:
      "https://images.pexels.com/photos/14270758/pexels-photo-14270758.jpeg",
    location: { lat: 40.7484405, lng: -73.9882393 },
    description: "One of the most famous skycrapers in the world!",
    address: "20 W 34th St., New York, NY 10001, United States",
  },
  {
    id: "p3",
    title: "Golden Gate Bridge at Sunset",
    creator: "u3",
    imageURL:
      "https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg",
    location: { lat: 37.8199286, lng: -122.4782551 },
    description:
      "An iconic suspension bridge offering breathtaking views of the San Francisco Bay.",
    address: "Golden Gate Bridge, San Francisco, CA, United States",
  },
  {
    id: "p4",
    title: "Eiffel Tower from Champ de Mars",
    creator: "u2",
    imageURL:
      "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg",
    location: { lat: 48.8583701, lng: 2.2944813 },
    description:
      "The symbol of Paris — a must-see landmark offering panoramic views of the city.",
    address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
  },
  {
    id: "p5",
    title: "Tokyo Tower at Night",
    creator: "u5",
    imageURL:
      "https://images.pexels.com/photos/2086748/pexels-photo-2086748.jpeg",
    location: { lat: 35.6585805, lng: 139.7454329 },
    description:
      "A communications and observation tower inspired by the Eiffel Tower, glowing brightly over Tokyo.",
    address: "4 Chome-2-8 Shibakoen, Minato City, Tokyo 105-0011, Japan",
  },
  {
    id: "p6",
    title: "Sydney Opera House from the Harbour",
    creator: "u1",
    imageURL:
      "https://images.pexels.com/photos/2193300/pexels-photo-2193300.jpeg",
    location: { lat: -33.8567844, lng: 151.2152967 },
    description:
      "A masterpiece of modern architecture, located right by the beautiful Sydney Harbour.",
    address: "Bennelong Point, Sydney NSW 2000, Australia",
  },
  {
    id: "p7",
    title: "Colosseum at Sunrise",
    creator: "u1",
    imageURL:
      "https://images.pexels.com/photos/532263/pexels-photo-532263.jpeg",
    location: { lat: 41.8902102, lng: 12.4922309 },
    description:
      "Ancient Rome’s most famous amphitheater, glowing in the early morning light.",
    address: "Piazza del Colosseo, 1, 00184 Roma RM, Italy",
  },
];

const UpdatePlace = () => {
  const { placeId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const [formState, handleFormChange, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: true,
      },
      description: {
        value: "",
        isValid: true,
      },
    },
    true
  );

  const identifiedPlace = DUMMY_PLACES.find((p) => p.id === placeId);

  useEffect(() => {
    if (identifiedPlace) {
      setFormData(
        {
          title: {
            value: identifiedPlace.title,
            isValid: true,
          },
          description: {
            value: identifiedPlace.description,
            isValid: true,
          },
        },
        true
      );
    }
    setIsLoading(false);
  }, [setFormData, identifiedPlace]);

  const handleUpdatePlaceSubmit = (e) => {
    e.preventDefault();
    console.log(formState.inputs);
  };
  if (!identifiedPlace) {
    return (
      <div className="center">
        <Card>
          <h2>Place not found!</h2>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="center">
        <h2>Loading...</h2>
      </div>
    );
  }
  return (
    <form className="place-form" onSubmit={handleUpdatePlaceSubmit}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={handleFormChange}
        initialValue={formState.inputs.title.value}
        initialValid={formState.inputs.title.isValid}
      />

      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (min length of 5 characters)."
        onInput={handleFormChange}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.description.isValid}
      />
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
};

export default UpdatePlace;
