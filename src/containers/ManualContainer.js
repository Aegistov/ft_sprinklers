import React from 'react';
import { StyleSheet, Text, View, Picker, TouchableHighlight } from 'react-native';
import fireAPI from '../lib/fireAPI';

export default class ManualScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            value: '',
        }
        this._renderPickerItems();
    }
    
    _renderPickerItems() {
       fireAPI.get('manualOverride').then((val) => {
            console.log(val);
        }); 
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.picker}>
                    <Picker
                        selectedValue={this.state.value}
                        onValueChange={(itemValue, itemIndex) => this.setState({value: itemValue})}
                    >
                            <Picker.Item label='Zone 1' value='1' />
                            <Picker.Item label='z02' value='2' />
                            <Picker.Item label='z01' value='1' />
                            <Picker.Item label='z02' value='2' />
                            <Picker.Item label='z01' value='1' />
                            <Picker.Item label='z02' value='2' />
                            <Picker.Item label='z01' value='1' />
                            <Picker.Item label='z02' value='2' />
                            <Picker.Item label='z01' value='1' />
                            <Picker.Item label='z02' value='2' />
                            <Picker.Item label='z01' value='1' />
                            <Picker.Item label='z02' value='2' />
                            <Picker.Item label='z01' value='1' />
                            <Picker.Item label='z02' value='2' />
                            <Picker.Item label='z01' value='1' />
                            <Picker.Item label='z02' value='2' />
                    </Picker>
                </View>
                <View style={styles.button}>
                    <TouchableHighlight onPress={this._onPressButton}>
                        <Text>Activate</Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        marginTop: 20
    },
    picker: {
        flex: 0.8,
        marginTop: 90
    },
    button: {
        flex: 0.2,
        alignItems: 'center',
    }
});
