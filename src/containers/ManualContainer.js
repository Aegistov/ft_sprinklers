import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

class ManualContainer extends React.Component {
    render() {
        return (
            <View>
                <Text>Manual Override Screen</Text>
            </View>
        );
    }
}

ManualContainer.navigationOptions = {
    title: 'Manual Override',
}

export default ManualContainer;
