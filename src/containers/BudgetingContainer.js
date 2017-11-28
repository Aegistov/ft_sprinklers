import React from 'react';
import { Stylesheet, Text, View } from 'react-native';

class BudgetingContainer extends React.Component {
    render() {
        return (
            <View>
                <Text>Budgeting Screen</Text>
            </View>
        );
    }
}

BudgetingContainer.navigationOptions = {
    title: 'Budgeting',
}

export default BudgetingContainer;
