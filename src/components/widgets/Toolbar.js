import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';

import { heartBack, exitButton } from '../../../assets/index';
import { textStyles } from '../../../styles';

/**
Widget responsible for displaying top tool bar
**/
export default class Toolbar extends Component {
  
  render() {
    if(this.props.back && !this.props.close) {
      return (
        <SafeAreaView style={{backgroundColor: "white"}}>
          <View style={styles.toolbar}>
            <TouchableOpacity style={styles.toolbarButton} onPress={this.props.onBackFunction}>
              <Image source={heartBack} style={styles.icon} />
            </TouchableOpacity>
            <Text style={[styles.toolbarTitle, textStyles.headerTitle]}>{this.props.title}</Text>
            <View style={{width: 50}}></View>
          </View>
        </SafeAreaView>
      );
    }
    if (this.props.close && !this.props.back) {
			return (
        <SafeAreaView style={{backgroundColor: "white"}}>
          <View style={styles.toolbar}>
            <View style={{width: 50}}></View>
            <Text style={[styles.toolbarTitle, textStyles.headerTitle]}>{this.props.title}</Text>
            <TouchableOpacity style={styles.toolbarButton} onPress={this.props.close}>
              <Image style={styles.icon} source={exitButton} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
			);
    }
    if (!this.props.close && !this.props.back)
      return (
        <SafeAreaView style={{backgroundColor: "white"}}>
          <View style={styles.toolbar}>
            <View style={{width: 50}}></View>
            <Text style={[styles.toolbarTitle, textStyles.headerTitle]}>{this.props.title}</Text>
            <View style={{width: 50}}></View>
          </View>
        </SafeAreaView>
      );
    }
}

var styles = StyleSheet.create({
    toolbar:{
        height: 65,
        backgroundColor:'white',
        paddingTop: 20,
        paddingBottom:10,
        flexDirection:'row',
        borderColor: 'rgb(151, 151, 151)',
        borderBottomWidth: .5,
    },
    toolbarButton:{
      paddingTop: 10,
        width: 50,
        height: 50,
    },
    toolbarTitle:{
        height: 40,
        paddingTop: 8,
        color:'rgb(22, 20, 95)',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign:'center',
        fontSize: 18,
        flex:1,
        fontFamily: 'Rokkitt',
        fontWeight: 'bold'
    },
    icon: {
      width: 16,
      height: 16,
      marginLeft: 20,
      marginRight: 10,
      resizeMode: 'contain'
    }
});