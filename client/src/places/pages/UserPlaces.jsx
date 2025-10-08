import PlaceList from "../components/PlaceList";

/*
const DUMMY_PLACES = [
  {
    id: "p1",
    imageURL:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped2%29.jpg/250px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped2%29.jpg",
    title: "View of the Empire State Building from Rockerfeller Center",
    description: "One of the most famous skycrapers in the world!",
    address: "20 W 34th St., New York, NY 10001, United States",
    creator: "u1",
    location: { lat: 40.7484405, lng: -73.9882393 },
  },
  {
    id: "p2",
    imageURL:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped2%29.jpg/250px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped2%29.jpg",
    title: "View of the Empire State Building from Rockerfeller Center",
    description: "One of the most famous skycrapers in the world!",
    address: "20 W 34th St., New York, NY 10001, United States",
    creator: "u2",
    location: { lat: 40.7484405, lng: -73.9882393 },
  },
];

export const DUMMY_PLACES = [
  { id: "p1", title: "Some Place", creator: "u2", imageUrl: "https://…" },
];

const UserPlaces = () => {
  return <PlaceList items={DUMMY_PLACES} />;
};

export default UserPlaces;*/

import { useParams } from "react-router-dom";

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

const UserPlaces = () => {
  const { userId } = useParams();
  const loadedPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);

  if (loadedPlaces.length === 0) {
    return (
      <div style={{ padding: 24 }}>
        <h2>No places found for this user.</h2>
      </div>
    );
  }

  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
