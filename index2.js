const { nextISSTimesForMyLocation } = require('./iss_promised');

//this is way simpler already. still confusing but its cleaner now
nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });
