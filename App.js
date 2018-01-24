import React from 'react';
import { TabNavigator } from 'react-navigation';
import HomeScreen from './src/containers/HomeScreen';
import ScheduleScreen from './src/containers/ScheduleScreen';
import AnalyticsScreen from './src/containers/AnalyticsScreen';
import BudgetingScreen from './src/containers/BudgetingScreen';
import ManualScreen from './src/containers/ManualContainer';

const TabNavConfig = {
    tabBarOptions: {
        activeTintColor: '#00897B',
        inactiveTintColor: '#80CBC4',
        style: {
            marginTop: 25,
            backgroundColor: '#FFF',
            shadowOpacity: 0,
        },
        labelStyle: {
            fontSize: 8,
        },
        indicatorStyle: {
            backgroundColor: '#80CBC4'
        },
        tabStyle: {
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
