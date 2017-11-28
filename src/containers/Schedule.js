import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

class ScheduleContainer extends React.Component {
    render() {
        return (
            <View>
                <Text>Schedule Screen</Text>
            </View>
        );
    }
}

ScheduleContainer.navigationOptions = {
    title: 'Schedule',
}

export default ScheduleContainer;
