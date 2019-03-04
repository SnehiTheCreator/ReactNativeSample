import React, { Component } from 'react';

import {
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
} from 'react-native';

import { palette, textStyles } from '../../../styles';
import { searchButton } from '../../../assets';

import SearchBar from 'react-native-material-design-searchbar'

const searchIcon = (
	<View>
		<Image source={searchButton} style={{width: 13, height: 13}} />
	</View>
);

export default class SearchActionBar extends React.Component {
	
	
	
	render() {
		
		return (
			<View style={styles.outerContainer}>
				<View style={styles.searchBarContainer}>
					<SearchBar
						height={38}
						onSearchChange={this.props.handleSearchChange}
						placeholder={'Search'}
						padding={11}
						iconSearchComponent={searchIcon}
						iconBackComponent={searchIcon}
						inputStyle={searchBarInputContainer}
						textStyle={searchText}
						placeholderColor={"#747474"}
					/>
				</View>
				<View style={styles.actionButtonContainer}>
					<TouchableOpacity onPress={this.props.handleActionButtonPress}>
							<Text style={textStyles.textButton}>{this.props.actionButtonText}</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

const searchBarInputContainer =	 {
	borderRadius: 19,
	borderWidth: 0,
	backgroundColor: palette.white,
}

const searchText = {
	fontFamily: 'Nunito Sans',
}

const styles = StyleSheet.create({
		outerContainer: {
			flexDirection: 'row',
			backgroundColor: palette.almostWhite
		},
		searchBarContainer: {
			flex: 5
		},
		actionButtonContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
		}
 })