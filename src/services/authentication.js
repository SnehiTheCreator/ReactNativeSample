import axios from 'axios';
//return promises

const getPartners = () => (axios.get('http://www.midtownatl.com/_bluefletch/members_mixed_json.pxp'));

function submitRegistration(registrationParams) {
	
	let regForm = new FormData();
	regForm.append('Semail', registrationParams.ctemailaddress);
	regForm.append('Szip', registrationParams.ctzip);
	regForm.append('Sstatus', registrationParams.ctstatus);
	regForm.append('Sfirm', registrationParams.ctfirm);
	//post user information to citylight Services
	return axios.post('post_contact.php', regForm)
}

function fetchUserInfo(email) {
	let url = "contacts_by_email_json.pxp"
	let ctemailaddress = encodeURIComponent(email);
	return (
		axios.get(url, {
			params: {
				ctemailaddress
			}
		})
	)
}

function updateRegistration(registrationParams) {
	//all data is overwritten so if value is undefined it will overwrite in db as empty obj
	let regForm = new FormData();
	regForm.append('Sctid', registrationParams.ctid);
	regForm.append('Semail', registrationParams.ctemailaddress);
	regForm.append('Szip', registrationParams.ctzip);
	regForm.append('Sstatus', registrationParams.ctstatus);
	regForm.append('Sfirm', registrationParams.ctfirm);
	
	return axios.post('post_contact_update.php', regForm, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
}

module.exports = {
  getPartners,
  submitRegistration,
  fetchUserInfo,
	updateRegistration
}
