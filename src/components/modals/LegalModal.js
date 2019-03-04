import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  WebView,
  Modal,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import { exitButton } from '../../../assets/index';

export default class InfoModal extends Component {

  state = {
    webviewLoaded: false,
  }

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
                  <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <TouchableOpacity onPress = {this.props.closeModal}>
                       <Image source={exitButton} style={styles.closeButton}/>
                    </TouchableOpacity>
                  </View>

                  <ActivityIndicator
                    animating={!this.state.webviewLoaded}
                    style={this.getIndicatorStyle()}
                  />

                  <WebView
                    source={{uri: 'http://www.midtownatl.com/app-privacy-policy-and-terms'}}
                    onLoad={this.hideLoadingIndicator}
                    style={this.getWebviewStyle()} />
                </View>
             </View>
          </Modal>
       </View>
    );
  }

  hideLoadingIndicator = () => {
    this.setState({webviewLoaded: true});
  }

  getIndicatorStyle = () => {
    if(this.state.webviewLoaded) {
      return styles.viewInactive;
    } else return styles.viewActive;
  }

  getWebviewStyle = () => {
    if(this.state.webviewLoaded) {
      return styles.viewActive;
    } else return styles.viewInactive;
  }
}

const styles = StyleSheet.create ({
   modal: {
    flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.3)'
   },
   innerModal: {
     flex: 1,
     backgroundColor: 'rgba(255, 255, 255, 0.95)',
     margin: 20
   },
   viewActive: {
     flex: 1,
   },
   viewInactive: {
     width: 0,
     height: 0
   },
   webview: {
     flex: 1
   },
   closeButton: {
     width: 20,
     resizeMode: 'contain',
     marginRight: 20,
     marginTop: 5
   }
});