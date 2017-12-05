import React, { Component } from 'react';
import Home from './Home';

export default class AppContainer extends Component {
    render() {
        return (
            <Home {} />
        );
    }
}

AppContainer.navigationOptions = {
    title: 'Main',
};
