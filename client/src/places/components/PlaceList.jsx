// PlaceList.jsx (example)
import PlaceItem from "./PlaceItem";
import Card from "../../shared/components/UIElements/Card";
import "./PlaceList.css";
import Button from "../../shared/components/FormElements/Button";
import PropTypes from "prop-types";

export default function PlaceList({
  items = [],
  onDeletePlace = () => {},
  onDeleteError = () => {},
}) {
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2 className="m-2 font-bold text-lg text-center">
            No places found. Why not create one?
          </h2>
          <div className="flex flex-col items-center">
            <Button to="/places/new">SHARE PLACE</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {items.map((p) => (
        <PlaceItem
          key={p.id}
          id={p.id}
          image={p.image}
          title={p.title}
          address={p.address}
          description={p.description}
          coordinates={p.location}
          creatorId={p.creator}
          onDeletePlace={onDeletePlace}
          onDeleteError={onDeleteError}
        />
      ))}
    </ul>
  );
}

PlaceList.propTypes = {
  items: PropTypes.array,
  onDeletePlace: PropTypes.func,
  onDeleteError: PropTypes.func,
};
