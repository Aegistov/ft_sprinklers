'use strict';
import React from 'react';
import { StyleSheet, Text, View, PickerIOS, TouchableHighlight, Platform } from 'react-native';
import fireAPI from '../lib/fireAPI';
import PickerAndroid from '../components/pickerAndroid';

let Picker = Platform.OS === 'ios' ? PickerIOS : PickerAndroid;

export default class ManualScreen extends React.Component {
    constructor(props, context) {
        super(props, context); 
        var myBoolean =  {'1': true, '0': false};
        this.state = {
            value: '',
            zones: {},
            buttonText: '',
            myBoolean: {
                1: true,
                0: false,
                false: 0,
                true: 1
                },
			prevActive:'',
        }
        this._loadZones();
        this._renderPickerItems = this._renderPickerItems.bind(this);
        this._buttonText = this._buttonText.bind(this);
        this._onPressButton = this._onPressButton.bind(this);
    }

    _loadZones() {
       fireAPI.get('manualOverride').then((val) => {
            let retrievedZones = val;
            let zones = {}
            for (const key of Object.keys(retrievedZones)) {
                zones[key] = this.state.myBoolean[retrievedZones[key].active];
            }
            this.setState({zones});
        });
    }
 
    _renderPickerItems() {
        let itemList = [];
        for (const key of Object.keys(this.state.zones)) {
            itemList.push(<Picker.Item key={key} label={key} value={key} />);
        }
        return(itemList);
    }

    _onPressButton() {
        console.log(this.state.value, this.state.zones[this.state.value]); 
        console.log(this.state.value, !this.state.zones[this.state.value]); 
		if (this.state.myBoolean[!this.state.zones[this.state.value] == 1]) { //if turning on zone
			if (this.state.prevActive != '') { // if prevActive exists, turn it off
				fireAPI.put('manualOverride/' + this.state.prevActive, {active: this.state.myBoolean[!this.state.zones[this.state.prevActive]]});
			}
		}
        fireAPI.put('manualOverride/' + this.state.value, {active: this.state.myBoolean[!this.state.zones[this.state.value]]}); //turning on zone
		if (this.state.myBoolean[!this.state.zones[this.state.value]] == 1) { //if turning on zone, set prevActive to current active zone
			this.state.prevActive = this.state.value
		}
        this._loadZones();
    }

    _buttonText() {
        if (this.state.zones[this.state.value]) {
            return (<Text>Deactivate</Text>);
        }
        else {
            return (<Text>Activate</Text>);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.picker}>
                    <Picker
                        selectedValue={this.state.value}
                        onValueChange={(itemValue, itemIndex) => this.setState({value: itemValue})}
                    >
                            {this._renderPickerItems()}
                    </Picker>
                </View>
                <View style={styles.button}>
                    <TouchableHighlight onPress={this._onPressButton}>
                        {this._buttonText()}
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
