import React from 'react';
import { TabNavigator } from 'react-navigation';
import HomeScreen from './src/containers/HomeScreen';
import ScheduleScreen from './src/containers/ScheduleScreen';
import AnalyticsScreen from './src/containers/AnalyticsScreen';
import BudgetingScreen from './src/containers/BudgetingScreen';
import ManualScreen from './src/containers/ManualContainer';

const TabNavConfig = {
    tabBarOptions: {
        style: {
        }
    }
}

const Screens = {
    Home: {
        screen: HomeScreen,
    },
    Schedule: {
        screen: ScheduleScreen,
    },
    Manual: {
        screen: ManualScreen,
    },
    Analytics: {
        screen: AnalyticsScreen,
    },
    Budgeting: {
        screen: BudgetingScreen,
    },
}

const RootTabs = TabNavigator(Screens, TabNavConfig);

export default RootTabs;
