import createReducer from '../lib/createReducer';
import * as types from '../actions/types';
import { AppNavigator } from '../navigators/AppNavigator';
import { NavigationActions } from 'react-navigation';

const firstAction = AppNavigator.router.getActionForPathAndParams('Main');
const tempNavState = AppNavigator.router.getStateForAction(firstAction);
const secondAction = AppNavigator.router.getActionForPathAndParams('Schedule');
const thirdAction = AppNavigator.router.getActionForPathAndParams('ManualOverride');
const fourthAction = AppNavigator.router.getActionForPathAndParams('Analytics');
const fifthAction = AppNavigator.router.getActionForPathAndParams('Budgeting');
tempNavState = AppNavigator.router.getStateForAction(secondAction, tempNavState);
tempNavState = AppNavigator.router.getStateForAction(thirdAction, tempNavState);
tempNavState = AppNavigator.router.getStateForAction(fourthAction, tempNavState);
const initialNavState = AppNavigator.router.getStateForAction(fifthAction, tempNavState);

export function nav(state = initialNavState, action) {
    let nextState;
    switch (action.type) {
        case 'Login':
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.back(),
                state
            );
            break;
        case 'Logout':
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.navigate({ routeName: 'Login' }),
                state
            );
            break;
        default:
            nextState = AppNavigator.router.getStateForAction(action, state);
            break;
    }
    return nextState || state;
}
