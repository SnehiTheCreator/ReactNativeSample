import { combineReducers } from 'redux';
import session from './sessionReducer';
import app from './appReducer';

export default combineReducers({
  session,
  app
})