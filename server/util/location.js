import axios from "axios";

export const getCoordinatesFromAddress = async (address) => {
  const encoded = encodeURIComponent(address);

  // ✅ Log a safe slice of the key + the address being geocoded
  console.log(
    "KEY starts with:",
    (process.env.GOOGLE_API_KEY || "").slice(0, 6)
  );
  console.log("Geocoding address:", address);

  const resp = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${process.env.GOOGLE_API_KEY}`
  );

  const data = resp.data;

  // ✅ Log Google’s response status (and any error message)
  console.log("GEOCODE status:", data.status, "message:", data.error_message);

  if (!data || data.status !== "OK" || data.results.length === 0) {
    throw new Error("Could not find a location for the specified address.");
  }

  return data.results[0].geometry.location;
};
