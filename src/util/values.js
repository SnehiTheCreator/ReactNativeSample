import {
    iconDining,
	iconDiningCircle,
	iconExperience,
	iconExperienceCircle,
	iconNightlife,
	iconNightlifeCircle,
	iconShopping,
	iconShoppingCircle,
	iconNewBuilding,
	iconPublicArt,
	iconHistoricLandmark,
	iconStreetImprovement,
	iconAttractions,
	iconMidtownBright,
	iconBlank
} from '../../assets/index';

export const userStatusChoices = {
  LIVE: { title: "Live", id: "live"},
  WORK: { title: "Work", id: "work"},
  BOTH: { title: "Both", id: "both"},
  NEITHER: { title: "Neither", id: "neither"}
};

export const toastIds = {
  REGISTRATION_TOAST_ID: "registraion",
  REDEMPTION_TOAST_ID: "redemption",
	CHANGE_PASSWORD_TOAST_ID: "changePassword",
	FORGOT_PASSWORD_TOAST_ID: "forgotPassword",
	CONTACT_UPDATED_TOAST_ID: "contactUpdated"
}

export const errorTypes = {
	SYSTEM: "system",
	CONNECTIVITY: "connectivity"
};

export const OfferCategories = {
  "dining": {id: 'dining', title: "Dining", icon: iconDining, iconCircle: iconDiningCircle},
  "shopping": {id: "shopping", title: "Shopping", icon: iconShopping, iconCircle: iconShoppingCircle},
  "experiences": {id: "experiences", title: "Experience", icon: iconExperience, iconCircle: iconExperienceCircle},
  "nightlife": {id: "nightlife", title: "Nightlife", icon: iconNightlife, iconCircle: iconNightlifeCircle},
};

export const DiscoveryCategories = {
	"new building": {id: 'new building', title: "New Building", icon: iconNewBuilding},
	"public art": {id: "public art", title: "Public Art", icon: iconPublicArt},
	"historic landmark": {id: "historic landmark", title: "Historic Landmark", icon: iconHistoricLandmark},
	"street improvement": {id: "street improvement", title: "Street Improvement", icon: iconStreetImprovement},
	"attractions": {id: "attractions", title: "Attractions", icon: iconAttractions },
	"midtown bright": {id: "midtown bright", title: "Midtown Bright", icon: iconMidtownBright}
};

export const hasValidOfferCategory = (category) => (!!OfferCategories[category]);
export const hasValidDiscoveryCategory = (category) => (!!DiscoveryCategories[category]);

export const authErrorTypes = {
	USERNAME: {code: "auth/user-not-found"},
	PASSWORD: {code: "auth/wrong-password"},
	REAUTHENTICATE: {code: "auth/requires-recent-login"}
};

export const contentTypes = {
	OFFER: "offer",
	DISCOVERY: "discovery"
};

