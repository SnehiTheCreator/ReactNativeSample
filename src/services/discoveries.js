import axios from 'axios';

function getDiscoveries(userLat, userLong) {
	let discoveriesUrl = 'discoveries_json.pxp';
	if(userLat && userLong) {
		discoveriesUrl += '?lat=' + userLat + '&long=' + userLong;
	}
	return axios.get(discoveriesUrl)
}

module.exports = {
	getDiscoveries
}