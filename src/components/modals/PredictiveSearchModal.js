import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Keyboard
} from 'react-native';

import Communications from 'react-native-communications';

import { heartBack, searchButton, heartbeatAnimation } from '../../../assets/index';

import { palette, textStyles } from "../../../styles";


const SCREEN_WIDTH = Dimensions.width;

export default class PredictiveSearchModal extends Component {

  state = {
    searchedPartners: [],
    inputText: '',
    formIsInvalid: true,
    buttonStyle: styles.buttonInactive
  };

  componentDidMount() {
    if(this.props.partners){
      this.setState({
        searchedPartners: this.props.partners
      });
    }
  }

  render() {
    if(this.state.isLoading) {
      this.renderLoadingView();
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Modal
             animationType={"fade"}
             transparent={true}
             visible={this.props.modalVisible}
             onRequestClose={this.props.closeModal.bind(this, "back")} >
             <View style={styles.modal}>
                 <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginTop: 40}}>
                  <View style={{flex: 1}}>
                     <TouchableOpacity onPress={this.props.closeModal.bind(this, "back")}>
                        <Image source={heartBack} style={styles.closeButton}/>
                     </TouchableOpacity>
                   </View>
                 </View>

                  <View style={styles.inputContainer}>
                    <View style={styles.innerInputContainer}>
                      <TextInput
                        style={styles.forms}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        onChangeText={this.searchedPartners}
                        autoCorrect={false}
                        keyboardType="default"
                        placeholder={this.props.hint}
                        autoFocus={false}
                        value={this.state.inputText} />
                    </View>
                    <Image source={searchButton} style={styles.searchIcon} />
                  </View>

                    <FlatList
                      keyboardShouldPersistTaps={"always"}
                      style={{marginLeft: 20}}
                      data={this.state.searchedPartners}
                      keyExtractor={item => (item.objid + `${Math.random()}`)}
                      renderItem={this.renderPartner}
                      showsVerticalScrollIndicator={false} />

                  <TouchableOpacity style={{flexDirection: 'row' }} disabled={this.state.formIsInvalid} onPress={this.props.closeModal.bind(this, this.state.inputText)}>
                    <Text style={[textStyles.primaryButton, this.state.buttonStyle]}> Done </Text>
                  </TouchableOpacity>

             </View>
          </Modal>
       </TouchableWithoutFeedback>
    );
  }

  renderLoadingView = () => {
    return (
      <View style={styles.loadingContainer}>
        <Image source={heartbeatAnimation} style={{width: 80, resizeMode: 'contain'}}/>
      </View>
    );
  }

  setFormState = () => {
    var validAffiliation = false;
    for(var i=0; i< this.props.partners.length; i++) {
      if(this.props.helpPartnerObject.label == this.state.inputText || this.props.partners[i].label == this.state.inputText) {
        validAffiliation = true;
        break;
      }
    }
    if(validAffiliation) {
      this.setState(
      {
        formIsInvalid: false,
        buttonStyle: styles.buttonActive
      });
    } else {
      this.setState(
      {
        formIsInvalid: true,
        buttonStyle: styles.buttonInactive
      });
    }
  }

  /**PREDICTIVE SEARCH FUNCTIONS **/
  searchedPartners = (searchedText) => {
    var searchedPartners = this.props.partners.filter(function(partner) {
      return new RegExp(searchedText.toLowerCase()).test(partner.label.toLowerCase());
    });
    if(searchedPartners.length == 0) {
      searchedPartners[0] = this.props.helpPartnerObject;
    }
    this.setState({searchedPartners: searchedPartners, inputText: searchedText}, this.setFormState);
  }

  renderPartner = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.predictiveSearchRow}
        onPress={() => this.updateInput(item.label)}>
          <View style={styles.predictiveSearchRowInner}>
            <Text style={styles.predictiveSearchText}>
                {item.label}
            </Text>
          </View>
      </TouchableOpacity>
    );
  }

  updateInput = (partner) => {
    Keyboard.dismiss;
    this.setState({
      inputText: partner
    }, this.setFormState);
  }
}

const styles = StyleSheet.create ({
  loadingContainer: {
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
   modal: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    backgroundColor: 'white',
   },
   closeButton: {
     width: 20,
     height: 20,
     resizeMode: 'contain',
     marginLeft: 20,
   },
   inputContainer: {
     flexDirection: 'row',
     marginRight: 20,
     borderBottomWidth: 2,
     borderColor: 'rgb(251, 176, 64)',
     marginLeft: 20,
   },
   innerInputContainer: {
     flex: 1
   },
   forms: {
     height: 50,
     textAlign: 'left',
     backgroundColor: 'white',
     marginTop: 20,
     color: 'rgb(51, 48, 146)',
     fontFamily: 'Nunito Sans'
   },
   searchIcon: {
     width: 20,
     height: 20,
     marginTop: 35,
   },
   predictiveSearchRow: {
     paddingTop:20,
     paddingBottom:20,
     flexDirection:'row',
     borderBottomWidth: 1,
     borderColor: 'rgb(231, 231, 231)',
     width: SCREEN_WIDTH
   },
   predictiveSearchText: {
     color: 'rgb(119, 119, 119)',
     fontSize: 14,
     paddingTop: 15,
     fontFamily: 'Nunito Sans'
   },
   buttonInactive: {
     flex: 1,
     paddingTop: 25,
     paddingBottom: 25,
     color: 'rgb(70, 11, 0)',
     backgroundColor: 'rgb(240, 81, 51)'
   },
   buttonActive: {
     flex: 1,
     paddingTop: 25,
     paddingBottom: 25,
     color: 'white',
     backgroundColor: 'rgb(240, 81, 51)'
   },
});
