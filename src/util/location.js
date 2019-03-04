function distance(lat1, lon1, lat2, lon2) {
  var p = Math.PI / 180;
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 +
          c(lat1 * p) * c(lat2 * p) *
          (1 - c((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a));
}

function distanceAway(meters) {
  let feet = Math.round(meters * 3.28084);
  let miles = Math.round((feet / 5280) * 100) / 100;
  if (miles < 0.1) {
    return `${feet} ft`
  } else {
    return  miles === 1 ? `1 mile` : `${miles} miles`;
  }
}

module.exports = {
  distance,
  distanceAway
}
