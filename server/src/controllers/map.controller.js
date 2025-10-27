const axios= require("axios");

// Reverse Geocoding (lat, lon → address)
const getReverseGeocode = async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ message: "Latitude and Longitude required" });
  }

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse`,
      {
        params: {
          lat,
          lon,
          format: "json",
        },
        headers: {
          "User-Agent": "RealEstateApp/1.0 (realestate@gmail.com)", // Required by Nominatim
        "Accept-Language": "en",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Reverse Geocode Error:", error.message);
    res.status(500).json({ message: "Error fetching location data" });
  }
};

// Forward Geocoding (search query → lat, lon)
const searchLocation = async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ message: "Search query required" });
  }

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          format: "json",
          q,
        },
        headers: {
          "User-Agent": "RealEstateApp/1.0 (realestate@gmail.com)",
          "Accept-Language": "en",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Location Search Error:", error.message);
    res.status(500).json({ message: "Error fetching search results" });
  }
};

module.exports={getReverseGeocode, searchLocation};