import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity
} from 'react-native';

export default class OfferRedemptionConfirmationModal extends Component {
  constructor(props){
    super(props)
  }
  
  confirmRedeem = () => {
    this.props.offerRedeemed();
    this.props.closeModal();
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

                  <Text style={styles.title}>Are you sure?</Text>

                  <Text style={styles.text}>Someone at the location must record the offer code. Once you hit yes, there is no going back. </Text>

                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={styles.buttonContainerLeft} onPress={this.props.closeModal}>
                       <Text style={styles.button}>No</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonContainerRight} onPress={this.confirmRedeem}>
                       <Text style={styles.button}>Yes</Text>
                    </TouchableOpacity>
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
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.3)'
   },
   innerModal: {
     width: 300,
     height: 200,
     backgroundColor: 'rgba(255, 255, 255, 1)',
   },
   title: {
     fontSize: 16,
     marginTop: 20,
     textAlign: 'center'
   },
   text: {
     margin: 20,
     fontSize: 12,
     textAlign: 'center'
   },
   buttonContainerLeft: {
     flex: .5,
     marginLeft: 20,
     marginRight: 10,
     marginTop: 10,
     marginBottom: 10
   },
   buttonContainerRight: {
     flex: .5,
     marginLeft: 10,
     marginRight: 20,
     marginTop: 10,
     marginBottom: 10
   },
   button: {
     paddingTop: 15,
     paddingBottom: 15,
     textAlign: 'center',
     alignItems:'center',
     fontWeight: 'bold',
     color: 'white',
     backgroundColor: 'black'
   },
});
