
import { sessionActions } from "../actions/session_actions";
import { navigationActions } from "../actions/navigation_actions";
import { Actions } from 'react-native-router-flux';
import { errorTypes } from "../util/values";

function lastScreen(currentUser){
	if (!currentUser) {
		return 'landing'
	}
	let routes = Actions.state.routes;
	let nonLoadingRoutes = routes.filter(route => {
		return route.routeName ? (route.routeName !== 'loading' && route.routeName !== 'splash' && route.routeName !== 'error') : false
	});
	if (nonLoadingRoutes && nonLoadingRoutes.length > 0) {
		return nonLoadingRoutes[nonLoadingRoutes.length - 1].routeName;
	} else {
		return;
	}
}

const NavigationMiddleware = store => next => action => {
  switch (action.type) {
	case sessionActions.UPDATE_LOADING:
	  if (action.isLoading && Actions.currentScene !== 'loading' && Actions.currentScene !== 'error') {
	    Actions.push('loading')
	  }
	  break;
	case navigationActions.NEXT_SCENE:
	  Actions.push(action.scene, action.props)
	  break;
	case navigationActions.GO_BACK:
	  Actions.pop()
	  break;
	case navigationActions.RESET_TO_OFFER_LIST:
	  Actions.reset("content");
	  break;
	case navigationActions.RESET_TO_LANDING:
		Actions.reset("landing");
		break;
	case navigationActions.RESET_TO_REGISTRATION:
		Actions.reset("registration");
		break;
	case navigationActions.RESET_TO_LOGIN:
		Actions.reset("login");
		break;
	case navigationActions.SYSTEM_ERROR:
		Actions.push("error", {errorType: errorTypes.SYSTEM})
		break;
	case navigationActions.CONNECTIVITY_ERROR:
		Actions.push("error", {errorType: errorTypes.CONNECTIVITY})
		break;
	case navigationActions.GO_TO_LAST_SCREEN:
		let last = lastScreen(store.getState().session.currentUser);
		if (last === "landing" || last === 'content') {
			Actions.reset(last);
		} else {
			Actions.pop();
		}
		break;
	case navigationActions.POP_TO:
		Actions.popTo(action.scene);
		break;
	default:
	  return next(action);
  }
}

export default NavigationMiddleware;