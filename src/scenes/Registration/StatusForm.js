import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  Dimensions,
  BackHandler
} from 'react-native';

import {
  heartActive,
  heartBack,
  heartInactive,
  logoSplitTop,
  logoSplitBottom
} from '../../../assets/index';

import { textStyles } from "../../../styles";
import { userStatusChoices } from '../../util/values';

//calculate size for the split logo image
const SCREEN_WIDTH = Dimensions.get('window').width - 100;
const IMAGE_ASPECT_RATIO = 54/828;
const IMAGE_HEIGHT = SCREEN_WIDTH * IMAGE_ASPECT_RATIO;


/**
Screen responsible for gathering information about the user's involvement in Midtown
**/
export default class StatusForm extends Component {
  
  constructor(props){
    super(props);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.androidBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.androidBackPress);
  }

  androidBackPress = () => {
    this.props.goBack();
    return true;
  }
  
  updateStatus = (ctstatus) => {
    return () => {
      this.props.updateRegistration({...this.props.registration, ctstatus})
    }
  }
  
  generatePickerRows = () => (
    Object.keys(userStatusChoices).map(choiceKey => {
      let choice = userStatusChoices[choiceKey];
      return (
        <PickerRow
          key={choice.id}
          type={choice.title}
          style={this.getPickerStyle(choice.id)}
          updateStatus={this.updateStatus(choice.id)}
          heart={this.getHeartIcon(choice.id)}/>
      )
	  })
  )
  
  getHeartIcon = (selection) => {
    if(this.props.registration.ctstatus == selection) {
      return heartActive;
    } else return heartInactive;
  }
  
  getPickerStyle = (selection) => {
    if(this.props.registration.ctstatus == selection) {
      return styles.pickerTextActive;
    } else return styles.pickerTextInactive;
  }
  
  handleNext = () => {
    //if user does not work or live in midtown then navigate to connect page
    //otherwise have them select their affiliation
    if (this.props.registration.ctstatus === userStatusChoices.NEITHER.id) {
      this.props.navigateToConnect();
    } else {
      this.props.navigateToAffiliationForm()
    }
  }

  render() {
		let guestModeLink = (
      <TouchableOpacity onPress={this.props.initiateGuestMode}>
        <Text style={[textStyles.textButton, styles.textButton]}>Explore in Guest Mode</Text>
      </TouchableOpacity>
		)
    
    return(
      <View style={styles.backContainer}>
        <View style={styles.toolbarContainer}>
          <TouchableOpacity onPress={this.props.goBack}>
            <Image source={heartBack} style={styles.backIcon} />
          </TouchableOpacity>
	
					{this.props.currentUser ? null : guestModeLink}
        </View>
        <View style={styles.innerContainer}>
          <Text style={styles.header}>What do you do in Midtown?</Text>

          <View style={styles.pickerContainer}>
          <Image source={logoSplitTop} style={styles.logoSplit} />

            {this.generatePickerRows()}

          <Image source={logoSplitBottom} style={styles.logoSplit} />
          </View>
        </View>

        <TouchableOpacity style={{flexDirection: 'row'}} onPress={this.handleNext}>
          <Text style={[textStyles.primaryButton, styles.button]}> Next </Text>
        </TouchableOpacity>
      </View>
    );
  }

}

const PickerRow = ({ type, updateStatus, style, heart }) => {

  return(
    <View style={styles.pickerRowOuter}>
      <TouchableOpacity style={styles.pickerRowInner}
        onPress={updateStatus}>
        <Text style={style}>{type}</Text>
        <Image source={heart} style={styles.pickerHeart} />
      </TouchableOpacity>
    </View>
  );

}

const styles = StyleSheet.create({
  backContainer : {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  backIcon: {
    width: 20,
    height: 20,
    marginLeft: 20,
    marginTop: 40,
    resizeMode: 'contain'
  },
   textButton: {
     marginRight: 20,
     marginTop: 40
   },
   toolbarContainer: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     marginBottom: 40
   },
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  header: {
    textAlign: 'center',
    color: 'rgb(22, 20, 95)',
    fontSize: 20,
    marginTop: 50,
    fontFamily: 'Nunito Sans',
  },
  pickerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoSplit: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
    resizeMode: 'contain',
  },
  firstPickerRow: {
    flexDirection: 'row',
    paddingLeft: 50,
    paddingRight: 40,
    height: 50,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgb(231, 231, 231)',
    alignItems: 'center',
  },
  pickerRowOuter: {
    height: 50,
    borderBottomWidth: 1,
    borderColor: 'rgb(231, 231, 231)',
    flexDirection: 'row',
  },
  pickerRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 50,
    paddingRight: 40,
    flex: 1
  },
  pickerTextActive: {
    flex: 1,
    height: 40,
    color: 'rgb(22, 20, 95)',
    fontSize: 16,
    fontFamily: 'Rokkitt',
    paddingTop: 15
  },
  pickerTextInactive: {
    flex: 1,
    height: 40,
    color: 'rgba(22, 20, 95, .3)',
    fontSize: 16,
    fontFamily: 'Rokkitt',
    paddingTop: 15
  },
  pickerHeart: {
    width: 20,
    height: 20,
    marginRight: 15,
    alignItems: 'center',
    resizeMode: 'contain',
  },
  button: {
    flex: 1,
    paddingTop: 25,
    paddingBottom: 25,
    backgroundColor: 'rgb(240, 81, 51)',
  },
});
