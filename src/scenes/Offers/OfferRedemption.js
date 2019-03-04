import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  BackHandler
} from 'react-native';

import { OfferRedemptionConfirmationModal } from '../../components/modals/index';
import { Toolbar } from '../../components/widgets/index';

import { palette, textStyles } from "../../../styles";

import {
  expandButton,
  minusButton,
  redeemBiking,
  redeemCafe,
  redeemParade,
  redeemPiano,
  redeemVarsity
} from '../../../assets/index';
import {analytics} from "../../services";

const redemptionImgArray = [redeemBiking, redeemCafe, redeemParade, redeemPiano, redeemVarsity];
let randIndex, randImg, expiration, terms, code;
const SCREEN_WIDTH = Dimensions.width;
const IMAGE_RATIO = 1017 / 1242;

/**
Screen responsible for displaying redemption fine print and the offer code
Offers are considered redeemed after confirming on the confirmation modal
**/
export default class OfferRedemption extends Component {

  state = {
    modalVisible: false,
    detailsVisible: false,
    finePrintVisible: false,
    detailsIcon: expandButton,
    finePrintIcon: expandButton,
    isLoading: true,
    expiration: '',
    terms: '',
    code:'MIDTOWN99',
    randImg: redemptionImgArray[0]
  }
  
  componentDidMount(){
		BackHandler.addEventListener('hardwareBackPress', () => this.androidBackPress() );
		if(this.props.currentOffer) {
			if(this.isEmpty(this.props.currentOffer.enddate) || null == this.props.currentOffer.enddate) {
				expiration = '';
			} else { expiration = 'Expires ' + this.props.currentOffer.enddate; }
		
			if(this.isEmpty(this.props.currentOffer.offer_terms) || null == this.props.currentOffer.offer_terms) {
				terms = 'Contact ' + this.props.currentOffer.citylight_point.label + ' for more details.';
			} else { terms = this.props.currentOffer.offer_terms; }
		
			if(this.isEmpty(this.props.currentOffer.offer_redemption_code) || null == this.props.currentOffer.offer_redemption_code) {
				code = 'MIDTOWN99';
			} else { code = this.props.currentOffer.offer_redemption_code; }
		
			randIndex = Math.floor(Math.random() * 5);
			randImg = redemptionImgArray[randIndex];
      this.setState({expiration, terms, code, randImg});
      
		}
  }

  componentWillUnmount(){
		BackHandler.removeEventListener('hardwareBackPress', () => this.androidBackPress() );
  }

  androidBackPress = () => {
    this.props.goBack()
    return true;
  }
  
  redeemCurrentOffer = () => {
		analytics.reportRedemptionToGoogleAnalytics("REDEEM_CONFIRMED", this.props.currentOffer)
    this.props.redeemOffer(this.props.currentOffer);
  }

  render() {
    if(this.props.currentOffer) {
      return(
        <View style={styles.container}>
        <Toolbar title={"Redeem"} back={true} onBackFunction={this.props.goBack} />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.dealInfoContainer}>
              <Text style={[styles.title, textStyles.headline]}>{this.props.currentOffer.citylight_point.label}</Text>
              <Text style={[styles.subtitle, textStyles.title]}>{this.props.currentOffer.label}</Text>
              <Text style={textStyles.bodyBlack}>{expiration}</Text>
            </View>
            <TouchableOpacity style={styles.sectionContainer}  onPress={this.toggleDetails}>
              <Text style={styles.sectionHeader}>Offer Details</Text>
              <Image source={this.state.detailsIcon} style={styles.expandIcon}/>
            </TouchableOpacity>

            <Text style={this.getStyle(this.state.detailsVisible)}>{this.props.currentOffer.offer_text}</Text>

            <TouchableOpacity style={styles.sectionContainer} onPress={this.toggleFinePrint}>
              <Text style={styles.sectionHeader}>The Fine Print</Text>
              <Image source={this.state.finePrintIcon} style={styles.expandIcon}/>
            </TouchableOpacity>

            <Text style={this.getStyle(this.state.finePrintVisible)}>{terms}</Text>

            <ImageBackground source={randImg} style={styles.redemptionImage}>
              <View style={styles.codeContainer}>
                <Text style={[styles.codeText, textStyles.title]}>Show this code to checkout associate</Text>
                <Text style={[textStyles.headline, styles.code]}>{code}</Text>
              </View>
            </ImageBackground>
          </ScrollView>

          <TouchableOpacity style={{flexDirection: 'row'}} onPress={this.redeemCurrentOffer}>
             <Text style={[styles.button, textStyles.primaryButton]}>Mark as Redeemed</Text>
          </TouchableOpacity>

        </View>
      );
    }
  }

  openConfirmationModal = () => {
    this.setState({
      modalVisible: true
    });
  }

  closeConfirmationModal = () => {
    this.setState({
      modalVisible: false
    });
  }

  toggleDetails = () => {
    if(this.state.detailsVisible) {
      this.setState({
        detailsVisible: !this.state.detailsVisible,
        detailsIcon: expandButton
      });
    } else {
      this.setState({
        detailsVisible: !this.state.detailsVisible,
        detailsIcon: minusButton
      });
    }
  }

  toggleFinePrint = () => {
    if(this.state.finePrintVisible) {
      this.setState({
        finePrintVisible: !this.state.finePrintVisible,
        finePrintIcon: expandButton
      });
    } else {
      this.setState({
        finePrintVisible: !this.state.finePrintVisible,
        finePrintIcon: minusButton
      });
    }

  }

  getStyle = (sectionState) => {
    if(sectionState) {
      return styles.viewActive;
    } else return styles.viewInactive;
  }

  isEmpty = (obj) => {
    if(typeof(obj) == 'object'){
      for(var prop in obj) {
          if(obj.hasOwnProperty(prop))
              return false;
      }
      return true;
    } else {
      return false;
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
		backgroundColor: palette.white
  },
  dealInfoContainer: {
    margin: 30,
  },
  title: {
    fontSize: 18,
    marginBottom: 18,
    paddingTop: 5,
  },
  subtitle: {
    paddingBottom: 5,
  },
  sectionContainer: {
    flexDirection: 'row',
    height: 36,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    backgroundColor: palette.almostWhite
  },
  sectionHeader: {
    flex: 1,
    color: 'rgb(22, 20, 95)',
    fontFamily: 'Nunito Sans'
  },
  expandIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain'
  },
  viewActive: {
    marginLeft: 20,
    marginTop: 30,
    marginRight: 20,
    marginBottom: 30,
    fontFamily: 'Nunito Sans'
  },
  viewInactive: {
    height: .5,
    backgroundColor: 'rgb(190, 190, 190)'
  },
  redemptionImage: {
    width: SCREEN_WIDTH,
    height: 400,
    justifyContent: 'center',
  },
  redemptionContainer: {
    alignItems: 'center'
  },
  codeContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, .8)',
    justifyContent: 'space-between',
    marginBottom: 100
  },
  codeText: {
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  code: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontSize: 49
  },
  button: {
    flex: 1,
    paddingTop: 25,
    paddingBottom: 25,
    backgroundColor: 'rgb(240, 81, 51)',
  },
});
