

const axios = require('axios');

// Your PositionStack API key (replace this with your actual key)
const API_KEY = '6288425393aca770d30f5e9907b386e8';

const normalizeAddress = (address) => {
    return address
      .toLowerCase()  // Convert to lowercase
      .replace(/,|\.|;/g, '')  // Remove commas, periods, and semicolons
      .replace(/\bst\b/g, 'street')  // Replace common abbreviations
      .replace(/\bave\b/g, 'avenue')
      .trim();  // Remove leading/trailing spaces
  };

// Function to geocode an address using PositionStack API
const geocodeAddress = async (address) => {
  const url = 'http://api.positionstack.com/v1/forward';
  
  const normalizedAddress = normalizeAddress(address);
  const params = {
    access_key: API_KEY,
    query: normalizedAddress,
    limit: 1,  // Limit to 1 result
  };

  try {
    // Perform the HTTP request
    const response = await axios.get(url, { params });

    // If results found, return latitude and longitude
    if (response.data && response.data.data.length > 0) {
      const result = response.data.data[0];
      return {
        latitude: result.latitude,
        longitude: result.longitude,
      };
    } else {
      console.log('No results found');
      return null; // Return null if no result is found
    }
  } catch (error) {
    console.error('Error fetching geocoding data:', error);
    return null; // Return null in case of an error
  }
};

// Export the function so it can be used in other files
module.exports = { geocodeAddress };
