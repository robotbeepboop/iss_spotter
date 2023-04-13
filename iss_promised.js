const request = require('request-promise-native');

const fetchMyIP = () => {
  return request('https://api.ipify.org?format=json');
}

const fetchCoordsByIP = function(body) {
  const ipv4 = JSON.parse(body).ip;
  return request(`http://ipwho.is/${ipv4}`);
};

const fetchISSFlyOverTimes = function(body) {
  //behold! the coords
  const { latitude, longitude } = JSON.parse(body);
  const searchURL = `https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`;
  return request(searchURL);
};

const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { resp } = JSON.parse(data);
      return resp;
    });
};

module.exports = { nextISSTimesForMyLocation };
