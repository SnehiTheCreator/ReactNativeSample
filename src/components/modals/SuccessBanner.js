import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Animated,
  Dimensions,
  Easing
} from 'react-native';

import { iconHeartWhite } from '../../../assets/index';

export default class SuccessBanner extends React.Component {
  
  state = {
    yPosition: new Animated.Value(-50)
  }
  
  componentDidMount(){
		Animated.sequence([
      Animated.timing(
        this.state.yPosition,
        {
          toValue: 0,
          easing: Easing.linear(),
          duration: 1000,
        }
      ),
      Animated.timing(
        this.state.yPosition,
        {
          toValue: -50,
          easing: Easing.linear(),
          duration: 1000,
          delay: 1500
        }
      ),
    ]).start(this.props.hideConfirmationModal)
  }
  
  render() {

		let bannerStyle = {
		  position: 'absolute',
      width: Dimensions.get('window').width,
      bottom: this.state.yPosition,
      height: 50
		}
		
		return (
      <Animated.View style={bannerStyle}>
        <View style={styles.innerModal}>
          <Image source={iconHeartWhite} style={styles.heartIcon} />
          <Text style={styles.text}>{this.props.modalText}</Text>
        </View>
      </Animated.View>
		);
  }
}

const styles = StyleSheet.create ({
   innerModal: {
		 flex: 1,
     backgroundColor: 'rgb(51, 48, 146)',
     flexDirection: 'row',
     height: 50,
     alignItems: 'center'
   },
   text: {
     marginLeft: 10,
     fontSize: 14,
     color: 'white',
     flex: 1,
   },
   heartIcon: {
     width: 24,
     resizeMode: 'contain',
     marginLeft: 20
   }
});
