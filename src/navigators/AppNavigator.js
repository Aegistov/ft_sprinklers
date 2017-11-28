import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator, TabNavigator } from 'react-navigation';

import AppContainer from '../containers/AppContainer';
import ScheduleContainer from '../containers/Schedule';
import ManualContainer from '../containers/ManualContainer';
import AnalyticsContainer from '../containers/AnalyticsContainer';
import BudgetingContainer from '../containers/BudgetingContainer';

export const AppNavigator = TabNavigator({
    Main: { screen: AppContainer },
    Schedule: { screen: ScheduleContainer },
    ManualOverride: { screen: ManualContainer },
    Analytics: { screen: AnalyticsContainer },
    Budgeting: { screen: BudgetingContainer },
});

const AppWithNavigationState = ({ dispatch, nav}) => (
    <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

AppWithNavigationState.propsTypes = {
    dispatch: PropTypes.funcisRequired,
    nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
