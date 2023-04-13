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
      return callback(error, null);
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
      return callback(Error(msg), null);
    }
    //use same json assignment format as breedfetcher assignment
    const geoLocation = JSON.parse(body);
    if (!geoLocation.success) {
      const message = `Success status was ${geoLocation.success}. Server message says: ${geoLocation.message} when fetching for IP ${geoLocation.ip}`;
      return callback(Error(message), null);
    }
    const coords = {
      latitude: geoLocation.latitude,
      longitude: geoLocation.longitude
    };
    callback(null, coords);
  });
};

/*
Latitude	The latitude of the place to predict passes	lat	-80..80	degrees
Longitude	The longitude of the place to predict passes	lon	-180..180	degrees
*/
const fetchISSFlyOverTimes = function(coords, callback) {
  // use request to fetch IP address from JSON API
  const flyOverURL = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(flyOverURL, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    //use same json assignment format as breedfetcher assignment
    const passTimes = JSON.parse(body).response;
    callback(null, passTimes);
  });
};

//remember the laundry exercise, if error, quit, if not, continue
const nextISSTimesForMyLocation = function(callback) {
  // empty for now
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, location) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(location, (error, passTimes) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, passTimes);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };
