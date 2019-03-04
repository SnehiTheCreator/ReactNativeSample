import { AsyncStorage } from 'react-native';
import axios from 'axios';

function getCMSOffers(userLat, userLong) {
  //get list of all offers from citylight CMS
  let dealsUrl = 'deals_json.pxp';
  if(userLat && userLong) {
    dealsUrl += '?lat=' + userLat + '&long=' + userLong;
  }
  return axios.get(dealsUrl)
}

function reportRedemption(dealId) {
  var postForm = new FormData();
  postForm.append('Suid', dealId);

  //post user information to citylight Services
  return axios.post('post_redemption.php', {postForm})
}

function getRedeemedOffers(){
  return AsyncStorage.getItem('MAredeemedOffers')
		.then((offers) => {
  		if (offers) {
  			return Promise.resolve(JSON.parse(offers));
			} else {
				AsyncStorage.setItem('MAredeemedOffers', JSON.stringify([]));
				return Promise.resolve([])
			}
		})
		.catch(error => {
			return Promise.reject(error);
		})
}

function saveOfferRedemption(offer) {
	if (offer.limit_once_per_person == 1) {
		return getRedeemedOffers()
			.then((offers) => {
				offers.push(offer.uid);
				return AsyncStorage.setItem('MAredeemedOffers', JSON.stringify(offers));
			})
			.catch(error => (
				Promise.reject(error)
			))
	} else {
		return Promise.resolve();
	}
}

module.exports = {
  getCMSOffers,
  reportRedemption,
  saveOfferRedemption,
	getRedeemedOffers
}
