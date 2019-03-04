/***
Snehi Vallurupalli
BlueFletch Mobile
2017


Allison Velez
BlueFletch Mobile
2016

Main Container for Midtown Alliance mobile app
**/

import React, { Component } from 'react';
import {AppRegistry, StatusBar } from 'react-native';
import { Router, Scene, Stack, Tabs } from 'react-native-router-flux';
import {Register1, StatusForm, AffiliationForm, Password, Connect, LocationPermission} from './scenes/Registration';
import {Login} from "./scenes/Login";
import {OfferList, OfferDetail, OfferRedemption} from './scenes/Offers';
import { DiscoveryList, DiscoveryDetail } from "./scenes/Discoveries";
import { MidtownMap } from './scenes/Map';
import { MoreMenu, Profile, ChangePassword, About, ProfileAffiliationForm, ProfileConnect, ProfileStatusForm } from "./scenes/More";
import { Error } from "./scenes/Error";
import {TabIcon} from "./tabIcon";
import LandingPage from './landing';
import LoadingScreen from './loading';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { initialize } from "./actions/session_actions";
import thunk from 'redux-thunk';
import NavigationMiddleware from './middleware/navigation';
import reducer from './reducers/rootReducer';
import axios from 'axios';
import { configureServices } from "./services/service";
import { palette, textStyles } from "../styles";
import SplashScreen from 'react-native-splash-screen'


const preloadedState = {
  session: {
    registered: false,
    isLoading: true
  }
}

axios.defaults.baseURL = 'https://www.midtownatl.com/_bluefletch/';
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

const store = createStore(reducer, preloadedState, applyMiddleware(thunk, NavigationMiddleware));


class MidtownAlliance extends Component {


  componentDidMount() {
		//needs to be splash screen to start out
		store.dispatch(initialize())
       .then(() => {
				 SplashScreen.hide();
				 configureServices(store)
       })
	}

  render() {
    
    return (
      <Provider store={store}>
          <Router sceneStyle={{backgroundColor: "white"}}>
            <Scene
              hideNavBar
              key="root">
              <Scene key="loading" intial component={LoadingScreen} />
              <Scene
                key="landing" component={LandingPage}/>
              <Scene
                key="login" component={Login}/>
              <Stack
                hideNavBar
                key="registration">
                <Scene
                  key="register1"
                  component={Register1}/>
                <Scene
                  key="statusForm"
                  component={StatusForm}/>
                <Scene
                  key="affiliationForm"
                  component={AffiliationForm}/>
                <Scene
                  key="password"
                  component={Password}/>
                <Scene
                  key="connect"
                  component={Connect}/>
                <Scene
                  key="locationPermission"
                  component={LocationPermission}/>
              </Stack>
              <Tabs
                key="content"
                activeTintColor={palette.blueberry}
                tabBarPosition="bottom">
                <Stack
                  hideNavBar
                  key="offers"
                  title='Offers'
                  icon={TabIcon}>
                  <Scene
                    key="offerList"
                    component={OfferList}/>
                  <Scene
                    key="offerDetail"
                    hideTabBar
                    component={OfferDetail}/>
                  <Scene
                    key="offerRedemption"
                    hideTabBar
                    component={OfferRedemption}/>
                </Stack>
                <Stack
                  hideNavBar
                  key="discoveries"
                  title="Discoveries"
                  icon={TabIcon}>
                  <Scene
                    key="discoveryList"
                    component={DiscoveryList}/>
                  <Scene
                    key="discoveryDetail"
                    hideTabBar
                    component={DiscoveryDetail}/>
                </Stack>
                <Stack
                  hideNavBar
                  key="map"
                  title="Map"
                  icon={TabIcon}>
                  <Scene
                    key="mapList"
                    component={MidtownMap}/>
                  <Scene
                    key="mapOfferDetail"
                    hideTabBar
                    component={OfferDetail}/>
                  <Scene
                    key="mapDiscoveryDetail"
                    hideTabBar
                    component={DiscoveryDetail}/>
                </Stack>
                <Stack
                  hideNavBar
                  key="more"
                  title="More"
                  icon={TabIcon}>
                  <Scene
                    key="moreMenu"
                    component={MoreMenu}/>
                  <Scene
                    key="profile"
                    hideTabBar
                    component={Profile} />
                  <Scene
                    hideTabBar
                    key="profileStatusForm"
                    component={ProfileStatusForm}/>
                  <Scene
                    hideTabBar
                    key="profileAffiliationForm"
                    component={ProfileAffiliationForm}/>
                  <Scene
                    hideTabBar
                    key="profileConnect"
                    component={ProfileConnect}/>
                  <Scene
                    key="changePassword"
                    hideTabBar
                    component={ChangePassword} />
                  <Scene
                    key="about"
                    hideTabBar
                    component={About} />
                </Stack>
              </Tabs>
              <Scene key="error" component={Error} />
            </Scene>
          </Router>
      </Provider>
    );
  }
}

AppRegistry.registerComponent('MidtownAlliance', () => MidtownAlliance);
