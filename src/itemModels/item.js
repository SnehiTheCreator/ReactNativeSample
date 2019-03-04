
const isString = (value) => typeof value === 'string';

export default class Item {
    constructor(item) {
        this.hide = false;
        this.categoryId = null;
        this.distance = item.distance && isString(item.distance) ? item.distance : null;
        this.isFeatured = item.isFeatured !== "0";
        this.label = item.label && isString(item.label) ? item.label : null;
        this.metersAway = item.metersaway && isString(item.metersaway) ? item.metersaway : null;
        this.uid = item.uid;
        if (!isString(this.uid)) {this.hide = false;}

        this.setCategory();
        this.setLocationImage();
        this.setLocationDetails();
    }

    setCategory(item){
        if (item.citylight_groups && item.citylight_groups.group && isString(item.citylight_groups.group.groupId)) {
            this.categoryId = item.citylight_groups.group.groupId;
            this.categoryLabel = item.citylight_groups.group.groupLabel;
            this.listIcon = item.citylight_groups.group.groupLabel.toLowerCase();
        } else {
            this.groupId = null;
            this.hide = true;
        }
    }

    setLocationImage(item){
        if (item.citylight_images && item.citylight_images.citylight_image && isString(item.citylight_images.citylight_image.imageurl)) {
            this.locationImageUrl = item.citylight_images.citylight_image.imageurl;
        } else {
            this.locationImageUrl = null;
        }
    }

    setLocationDetails(item){
        if (item.citylight_point) {
            const address1 = item.citylight_point.address1;
            const address2 = item.citylight_point.address2;
            const address3 = item.citylight_point.address3;
            this.address1 = address1 && isString(address1) ? address1 : null;
            this.address2 = address2 && isString(address2) ? address2 : null;
            this.address3 = address3 && isString(address3) ? address3 : null;

            const lat = item.citylight_point.lat;
            const long = item.citylight_point.long;
            this.lat = lat && isString(address1) ? lat : null;
            this.long = long && isString(address1) ? long : null;

            const telephone = item.citylight_point.telephone;
            const website = item.citylight_point.website;
            this.telephone = telephone && isString(address1) ? telephone : null;
            this.website = website && isString(address1) ? website : null;

            this.setDetailImage(item);
        }
    }

    setDetailImage(item) {
        if (item.citylight_point_images && item.citylight_point_images.citylight_image && isString(item.citylight_point_images.citylight_image.imageurl)) {
            this.detailImage = item.citylight_point_images.citylight_image.imageurl;
        }
    }
}