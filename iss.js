/*
ISS passes overhead every 90-ish minutes
Fetch our IP Address
Fetch the geo coordinates (Latitude & Longitude) for our IP
Fetch the next ISS flyovers for our geo coordinates

 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require('request');

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  const ipify = 'https://www.ipify.org?format=json';
  request(ipify, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    //use same json assignment format as breedfetcher assignment
    const ipv4 = JSON.parse(body).ip;
    callback(null, ipv4);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  // use request to fetch IP address from JSON API
  request(`http://ipwho.is/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} during geolocation search: ${body}`;
      callback(Error(msg), null);
      return;
    }
    //use same json assignment format as breedfetcher assignment
    const geoLocation = JSON.parse(body);
    if (!geoLocation.success) {
      const message = `Success status was ${geoLocation.success}. Server message says: ${geoLocation.message} when fetching for IP ${geoLocation.ip}`;
      callback(Error(message), null);
      return;
    }
    const coords = {
      latitude: geoLocation.latitude,
      longitude: geoLocation.longitude
    };
    callback(null, coords);
  });
};


module.exports = { fetchMyIP, fetchCoordsByIP };
