import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class BudgetingScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Budgeting Screen</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
        marginTop: 20,
    }
});
