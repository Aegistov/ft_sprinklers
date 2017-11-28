import { combineReducers } from 'redux';
import * as recipesReducer from './recipes';
import * as navReducer from './navigation';

export default combineReducers(Object.assign(
    recipesReducer,
    navReducer,
));
