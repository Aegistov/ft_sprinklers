import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

class AnalyticsContainer extends React.Component {
    render() {
        return (
            <View>
                <Text>Analytics Screen</Text>
            </View>
        );
    }
}

AnalyticsContainer.navigationOptions = {
    title: 'Analytics',
}

export default AnalyticsContainer;
