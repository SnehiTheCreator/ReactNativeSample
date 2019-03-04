import {
    iconDining,
    iconDiningCircle,
    iconExperience,
    iconExperienceCircle, iconNightlife, iconNightlifeCircle,
    iconShopping,
    iconShoppingCircle
} from "../../assets";

import Item from './item';

const isString = (value) => typeof value === 'string';

export default class Offer extends Item {
    constructor(offerItem) {
        super(offerItem);
        this.endDate = offerItem.enddate && isString(offerItem.enddate) ? offerItem.enddate : null;
        this.isRedeemed = offerItem.isRedeemed === true;
        this.limitOncePerPerson = offerItem.limit_once_per_person !== "0";
        this.metersAway = offerItem.metersaway && isString(offerItem.metersaway) ? offerItem.metersaway : null;
        this.offerRedemptionCode = offerItem.offer_redemption_code && isString(offerItem.offer_redemption_code) ? offerItem.offer_redemption_code : null;
        this.offerTerms = offerItem.offer_terms && isString(offerItem.offer_terms) ? offerItem.offer_terms : null;
        this.offerText = offerItem.offer_text && isString(offerItem.offer_text) ? offerItem.offer_text : null;
        this.offerType = offerItem.offer_type && isString(offerItem.offer_type) ? offerItem.offer_type : null;
        this.redemptionLimit = offerItem.redemption_limit && isString(offerItem.redemption_limit) ? offerItem.redemption_limit : null;
        this.redemptionToDate = offerItem.redemptions_to_date && isString(offerItem.redemptions_to_date) ? offerItem.redemptions_to_date : null;

        this.setCategory();
        this.setLocationImage();
        this.setLocationDetails();
    }

    static categories = {
        "dining": {id: 'dining', title: "Dining", icon: iconDining, iconCircle: iconDiningCircle},
        "shopping": {id: "shopping", title: "Shopping", icon: iconShopping, iconCircle: iconShoppingCircle},
        "experiences": {id: "experiences", title: "Experience", icon: iconExperience, iconCircle: iconExperienceCircle},
        "nightlife": {id: "nightlife", title: "Nightlife", icon: iconNightlife, iconCircle: iconNightlifeCircle},
    }

    static Categories = {
        "273" : {id: 'dining', title: "Dining", icon: iconDining, iconCircle: iconDiningCircle},
        "274": {id: "nightlife", title: "Nightlife", icon: iconNightlife, iconCircle: iconNightlifeCircle},
        "275": {id: "shopping", title: "Shopping", icon: iconShopping, iconCircle: iconShoppingCircle},
        "276": {id: "experiences", title: "Experience", icon: iconExperience, iconCircle: iconExperienceCircle}
    }
}