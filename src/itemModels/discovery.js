// {
//     citylight_groups: {group: {groupid: "284", grouplabel: "Midtown Bright"}},
//     citylight_images: {citylight_image: {}},
//     citylight_point: {
//         address1: {},
//         address2: {},
//         address3: "Atlanta, GA 30309",
//             label: "Last Mile Intersection Safety Improvement Project",
//             lat: "33.659717",
//             long: "-84.455569",
//             telephone: {},
//         website: "https://www.midtownatl.com/about/programs-and-projects/capital-improvements/last-mile-intersections"
//     },
//     contentType: "discovery",
//         description: "The City of Atlanta and Midtown Alliance have been awarded funding to install new traffic signals at several intersections and enhance pedestrian crossings at multiple other Midtown intersections. The project will enhance connectivity and safety for people accessing MARTA rail stations and regional and local bus stops. ↵↵Status: Design + Engineering",
//     distance: "2136.4 miles",
//     headline: "New Safety Enhancements for People Walking",
//     isfeatured: "0",
//     label: "Last Mile Intersection Safety Improvement Project",
//     listIcon: "midtown bright",
//     mapId: "discovery-18",
//     metersaway: "3438082",
//     uid: "18"
// }

import {
    iconAttractions,
    iconHistoricLandmark, iconMidtownBright,
    iconNewBuilding,
    iconPublicArt,
    iconStreetImprovement
} from "../../assets";

export default class Discovery extends Item {
    constructor(discoveryItem) {
        super(discoveryItem)
    }

    static categories = {
        "new building": {id: 'new building', title: "New Building", icon: iconNewBuilding},
        "public art": {id: "public art", title: "Public Art", icon: iconPublicArt},
        "historic landmark": {id: "historic landmark", title: "Historic Landmark", icon: iconHistoricLandmark},
        "street improvement": {id: "street improvement", title: "Street Improvement", icon: iconStreetImprovement},
        "attractions": {id: "attractions", title: "Attractions", icon: iconAttractions },
        "midtown bright": {id: "midtown bright", title: "Midtown Bright", icon: iconMidtownBright}
    }
}