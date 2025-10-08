// PlaceList.jsx (example)
import PlaceItem from "./PlaceItem";
import Card from "../../shared/components/UIElements/Card";
import "./PlaceList.css";

export default function PlaceList({ items = [] }) {
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found.</h2>
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
          image={p.imageURL} // <- match your data
          title={p.title}
          address={p.address}
          description={p.description}
          coordinates={p.location} // <- match your data
          creatorId={p.creator}
        />
      ))}
    </ul>
  );
}
