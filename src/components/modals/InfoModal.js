import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Linking,
  ScrollView
} from 'react-native';

import Communications from 'react-native-communications';

import {
  exitButton,
  logo,
  iconFacebook,
  iconInstagram,
  iconTwitter
} from '../../../assets/index';

export default class InfoModal extends Component {

  render() {
    return (
       <View>
          <Modal
             animationType = {"fade"}
             transparent = {true}
             visible = {this.props.modalVisible}
             onRequestClose = {this.props.closeModal} >
             <View style = {styles.modal}>
                <View style={styles.innerModal}>
                  <View>
                    <View style={styles.backContainer}>
                      <TouchableOpacity onPress = {this.props.closeModal}>
                         <Image source={exitButton} style={styles.closeButton} />
                      </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                      <Image
                        style={styles.logo}
                        source={logo} />

                      <Text style={styles.header}>About</Text>
                      <Text style={styles.appDescription}>Midtown is the heartbeat of Atlanta. This app is a pilot program to bring Midtown Alliance members special offers, unique experiences and cool discoveries. You must be at the deal location to redeem, so get out there and explore one of ATL’s most vibrant neighborhoods.</Text>

                      <TouchableOpacity style={styles.contactContainer}  onPress={() => Communications.email(['appsupport@midtownatl.com'],null,null,'Question About My Midtown Alliance App',null)}>
                        <Text style={styles.linkText}>Email us:</Text>
                        <Text style={styles.email}>appsupport@midtownatl.com</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.contactContainer} onPress={() => Linking.openURL('http://www.midtownatl.com/')}>
                        <Text style={styles.linkText}>Visit us online</Text>
                      </TouchableOpacity>


                      <View style={styles.socialContainer}>
                        <TouchableOpacity style={{marginRight: 20}} onPress={() => Linking.openURL('https://www.facebook.com/midtownalliance/')}>
                          <Image style={styles.socialIcon} source={iconFacebook} />
                        </TouchableOpacity>

                        <TouchableOpacity style={{marginRight: 20}} onPress={() => Linking.openURL('https://twitter.com/MidtownATL')}>
                          <Image style={styles.socialIcon} source={iconTwitter} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/midtown_atl/')}>
                          <Image style={styles.socialIcon} source={iconInstagram} />
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity onPress={() => Linking.openURL('http://www.midtownatl.com/app-privacy-policy-and-terms')}>
                        <Text style={styles.termsText}>View Terms & Conditions and Privacy Policy</Text>
                      </TouchableOpacity>

                    </ScrollView>

                  </View>

                  <View style={{height: 60}}>
                    <Text style={styles.titleText}>Midtown Alliance</Text>
                    <View style={{flexDirection: 'row', height: 50, paddingBottom: 10}}>
                      <Text style={styles.appNameText}>Member Application</Text>
                      <Text style={styles.versionText}>Version 1.0</Text>
                    </View>
                  </View>

                </View>
             </View>
          </Modal>
       </View>
    );
  }
}

const styles = StyleSheet.create ({
   modal: {
    flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.3)'
   },
   innerModal: {
     flex: 1,
     margin: 20,
     justifyContent: 'space-between',
     backgroundColor: 'rgba(255, 255, 255, 0.95)',
     paddingLeft: 30,
     paddingRight: 30,
     paddingTop: 10,
     paddingBottom: 50
   },
   backContainer: {
     flexDirection: 'row',
     justifyContent: 'flex-end',
     height: 40
   },
   logo: {
     marginBottom: 10,
     width: 200,
     resizeMode: 'contain'
   },
   contactContainer: {
     paddingBottom: 5,
     paddingTop: 5,
   },
   linkText: {
     color: 'rgb(51, 48, 146)',
     fontFamily: 'Rokkitt',
     fontWeight: 'bold',
     fontSize: 18,
     height: 30,
     paddingTop: 5,
     paddingBottom: 5
   },
   email: {
     color: 'rgb(51, 48, 146)',
     fontFamily: 'Rokkitt',
     fontWeight: 'bold',
     fontSize: 18,
     height: 30,
     paddingBottom: 5,
     marginLeft: 20,
   },
   socialContainer: {
     flexDirection: 'row',
     justifyContent: 'flex-start',
   },
   socialIcon: {
     marginRight: 20,
     width: 30,
     padding: 5,
     marginRight: 10,
     resizeMode: 'contain'
   },
   header: {
     fontSize: 20,
     fontFamily: 'Rokkitt',
     fontWeight: 'bold',
     paddingTop: 5,
   },
   appDescription: {
     marginTop: 5,
     marginBottom: 30,
     fontFamily: 'Nunito Sans'
   },
   titleText: {
     fontFamily: 'Nunito Sans',
     fontWeight: 'bold',
     fontSize: 10,
     paddingTop: 10,
   },
   termsText: {
     fontSize: 10,
     color: 'rgb(51, 48, 146)',
     fontFamily: 'Nunito Sans',
     fontWeight: 'bold',
     marginBottom: 10
   },
   appNameText: {
     color: 'black',
     marginRight: 5,
     fontSize: 10,
     fontFamily: 'Nunito Sans',
   },
   versionText: {
     color: 'grey',
     fontSize: 10,
     fontFamily: 'Nunito Sans',
   },
   closeButton: {
     width: 20,
     resizeMode: 'contain',
   }
});