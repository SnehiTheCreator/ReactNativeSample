import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import LegalModal from '../modals/LegalModal';

/**
Widget responsible for displaying terms and privacy information link
**/
export default class TermsPrivacyDisclaimer extends Component {

  state = {
    modalVisible: false,
  }

  render() {
    return(
        <View style={styles.container}>
          <Text style={styles.text}>By registering you agree to the</Text>
          <TouchableOpacity style={styles.rowContainer} onPress={this.showTermsModal}>
            <Text style={styles.linkText}>Terms & Conditions and Privacy Policy</Text>
          </TouchableOpacity>
          <LegalModal
            modalVisible={this.state.modalVisible}
            closeModal={this.closeModal} />
        </View>
    );
  }

  showTermsModal = () => {
    this.setState({
      modalVisible: true,
    });
  }

  closeModal = () => {
     this.setState({ modalVisible: false });
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    marginTop: 5
  },
  text: {
    fontFamily: 'Nunito Sans',
    color: 'black'
  },
  linkText: {
    fontFamily: 'Nunito Sans',
    fontWeight: 'bold',
    color: 'black'
  }
});