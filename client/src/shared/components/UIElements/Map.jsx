import { useRef, useEffect } from "react";
import "./Map.css";
import { Zoom } from "swiper/modules";
const Map = (props) => {
  const { center, zoom } = props;
  const mapRef = useRef();

  useEffect(() => {
    const map = new window.google.maps.Map(
      mapRef.current,
      {
        center: props.center,
        zoom: props.zoom,
      },
      [center, zoom]
    );

    new window.google.maps.Marker({ position: props.center, map: map });
  });

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
