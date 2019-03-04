import { sessionActions } from "../actions/session_actions";

const sessionReducer = (state = {}, action) => {
  switch (action.type) {
    case sessionActions.RECEIVE_USER:
      return {...state, currentUser: action.user, registered: true, guest: false, registration: action.user, edit: false};
    case sessionActions.UPDATE_LOADING:
      return {...state, isLoading: action.isLoading};
    case sessionActions.RECEIVE_PARTNERS:
      return {...state, partners: action.partners};
    case sessionActions.UPDATE_REGISTRATION:
      return {...state, registration: action.userParams, authErrorType: null}
    case sessionActions.CLEAR_NEXT_ROUTE:
      return {...state, nextRoute: null}
    case sessionActions.CLEAR_CURRENT_USER:
      return {...state, currentUser: null, registration: null, registered: false}
    case sessionActions.AUTH_ERROR:
      return {...state, authErrorType: action.authErrorType}
    case sessionActions.GUEST_MODE:
      return {...state, currentUser: null, registered: false, guest: true}
    default:
      return state
  }
}

export default sessionReducer;