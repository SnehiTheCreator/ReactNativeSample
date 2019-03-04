import React from 'react';
import {
	SectionList,
	StyleSheet,
	Text,
	View,
	Image,
	Modal,
	TouchableOpacity,
} from 'react-native';

import CheckBox from 'react-native-checkbox';
import { Toolbar } from '../../components/widgets/index';
import { textStyles, palette } from "../../../styles";

import {
	checkboxChecked,
	checkboxUnchecked,
	exitButton
} from '../../../assets/index';

export default class FilterModal extends React.Component {
	
	componentWillReceiveProps(nextProps){
		this.initializeState(nextProps)
	}
	
	initializeState(props){
		const initialState = this.initialStateClone(this.props.filterState);
		props.categoryGroups.forEach(group => {
			if (!initialState[group.title]) {
				initialState[group.title] = {};
				group.data.forEach(category => {
					initialState[group.title][category.id] = false;
				})
			}
		})
		this.setState(initialState);
	//	creates a state object like :
	//	{
	//		Offers: {
	//			dining: false,
	//			shopping: false,
	//		},
	//		Discoveries: {
	//				landmark: false,
	//				etc..
	}
	
	initialStateClone(filterState){
		// reset the state to the filter state of the parent component. cloning to remove references to parent filter state
		return JSON.parse(JSON.stringify(filterState));
	}
	
	selectFilter = (rowData) => {
		let group = rowData.section.title;
		return () => {
			let updatedState = {...this.state}
			updatedState[group][rowData.item.id] = !updatedState[group][rowData.item.id];
			this.setState(updatedState);
		}
	}
	
	renderItem = (data) => {
		let item = data.item;
		return (
			<TouchableOpacity
				onPress= { this.selectFilter(data) } >
				<View style={styles.listRow}>
					<View style={styles.listRowLeft}>
						<Image source={item.icon} style={styles.listIcon} />
						<View style={styles.listTitleContainer}>
							<Text style={textStyles.bodyBlack} ellipseMode={'tail'} numberOfLines={1} >{item.title}</Text>
						</View>
					</View>
					
					<CheckBox
						checked={this.state[data.section.title][item.id]}
						checkedImage={checkboxChecked}
						label=''
						uncheckedImage={checkboxUnchecked}
						checkboxStyle={{width: 13, height: 13, marginRight: 20}}
						onChange={this.selectFilter(data)}
						underlayColor='transparent'
					/>
					
				</View>
			</TouchableOpacity>
		)
	}
	
	renderSectionHeader = ({section}) => {
		if (this.props.headers) {
			return (
				<View style={styles.sectionHeader}>
					<Text style={styles.sectionHeaderLabel}>{section.title}</Text>
					<TouchableOpacity onPress={this.sectionSelectAll(section)}>
						<Text style={textStyles.textButton}> Select all </Text>
					</TouchableOpacity>
				</View>
			)
		}
	}
	
	sectionSelectAll = (section) => (
		() => {
			let updatedState = {...this.state}
			let allSelected = section.data.every(category => (updatedState[section.title][category.id]));
			section.data.forEach(category => {updatedState[section.title][category.id] = !allSelected});
			this.setState(updatedState);
		}
	)
	
	applyFilter = () => {
		this.props.applyFilter(this.state)
	}
	
	
	render() {
		return (
			<Modal
				animationType={"fade"}
				visible={this.props.modalVisible}
				onRequestClose={this.props.close}>
				<View style={{flex: 1}}>
					<Toolbar back={false} title={"Filter Results"} close={this.props.close} />
					<SectionList
						renderItem={this.renderItem}
						contentContainerStyle={{flex: 0}}
						renderSectionHeader={this.renderSectionHeader}
						removeClippedSubviews={true}
						keyExtractor={item => item.id}
						sections={this.props.categoryGroups}
					/>
					<TouchableOpacity style={styles.bottomButton} onPress={this.applyFilter}>
						<Text style={[textStyles.primaryButton, styles.buttonActive]}> Apply </Text>
					</TouchableOpacity>
				</View>
			</Modal>
		)
	}
}

const styles = StyleSheet.create({
	listRow:{
	 backgroundColor:'white',
	 paddingTop:20,
	 paddingBottom:20,
	 paddingLeft: 20,
	 paddingRight: 38,
	 flexDirection:'row',
	 alignItems: 'center',
	 justifyContent: 'space-between'
	},
	listRowLeft: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	listIcon:{
	 width: 15,
	 height: 15,
	 resizeMode: 'contain',
	},
	listDistance: {
	 width: 65,
	 textAlign: 'center',
	 fontFamily: 'Nunito Sans',
	},
	listTitleContainer:{
	 flex:1,
	 marginLeft: 20,
	 marginRight: 20,
	},
	listTitle: {
	 color:'black',
	 marginBottom: 5,
	 fontFamily: 'Nunito Sans',
	 fontWeight:'bold',
	},
	 bottomButton: {
		 flexDirection: 'row'
	 },
	 buttonInactive: {
		 flex: 1,
		 paddingTop: 25,
		 paddingBottom: 25,
		 textAlign: 'center',
		 color: 'rgb(70, 11, 0)',
		 backgroundColor: 'rgb(240, 81, 51)',
		 fontFamily: 'Nunito Sans',
		 fontWeight: 'bold',
	 },
	 buttonActive: {
		 flex: 1,
		 paddingTop: 25,
		 paddingBottom: 25,
		 textAlign: 'center',
		 color: 'white',
		 backgroundColor: 'rgb(240, 81, 51)',
		 fontFamily: 'Nunito Sans',
		 fontWeight: 'bold'
	 },
		sectionHeader: {
			height: 36,
			flex: 1,
			backgroundColor: palette.almostWhite,
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			paddingRight: 23,
			paddingLeft: 12
		},
		sectionHeaderLabel: {
			fontFamily: "Avenir",
			fontSize: 13,
			fontWeight: "500",
			color: "#15135d"
		}
 })