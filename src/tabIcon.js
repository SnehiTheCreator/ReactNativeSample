import React from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text
} from 'react-native';

import {
	iconDiscoveriesActive,
	iconDiscoveriesInactive,
	iconMapActive,
	iconMapInactive,
	iconMoreActive,
	iconMoreInactive,
	iconOffersActive,
	iconOffersInactive,
} from '../assets/index';

export const TabIcon = ({ focused, title }) => {
	let source;
	switch (title) {
		case 'Offers':
			source = focused ? iconOffersActive : iconOffersInactive;
			break;
		case 'Discoveries':
			source = focused ? iconDiscoveriesActive : iconDiscoveriesInactive;
			break;
		case 'Map':
			source = focused ? iconMapActive : iconMapInactive;
			break;
		case 'More':
			source = focused ? iconMoreActive : iconMoreInactive;
			break;
	}
	
	return (
		<View style={styles.tab}>
			<Image style={{height: 19, width: 19}} source={source} />
		</View>
	)
}

const styles = StyleSheet.create({
	tab: {
		flex:1,
		flexDirection:'column',
		alignItems:'center',
		alignSelf:'center',
		justifyContent: 'center'
	}
})