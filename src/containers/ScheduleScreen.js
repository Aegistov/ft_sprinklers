import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableHighlight, FlatList } from 'react-native';
import fireAPI from '../lib/fireAPI';

export default class ScheduleScreen extends Component {
    constructor() {
        super();
        this._loadZones();
    }

    _loadZones() {
        fireAPI.get('programSchedule').then((val) => {
            let retrievedZones = val;
            let zones = {}
            for (const key of Object.keys(retrievedZones)) {
                console.log(key, retrievedZones[key]);
            }
        });
    }

    _renderRow(item) {
        <View>
            <TouchableHighlight>
                <Text>Zone 1</Text>
            </TouchableHighlight>
        </View>
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Next 7 Days</Text>
                </View>
                <View style={styles.graph}>
                    <Text>Graph View</Text>
                    <FlatList data={'test'} renderItem={this._renderRow}/>
                </View>
                <View style={styles.footer}>
                    <Text>Selection: 1,3,4,5,9,10...</Text>
                    <TouchableHighlight>
                        <Text>Modify</Text>
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
        alignItems: 'center',
        marginTop: 20
    },
    header: {
        flex: 0.1,
        backgroundColor: 'red',
        width: 340,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 48,
    },
    graph: {
        flex: 0.6,
        backgroundColor: 'blue',
        width: 340,
        alignItems: 'center',
    },
    footer: {
        flex: 0.2,
        backgroundColor: '#228B22',
        width: 240,
        alignItems: 'center',
    }
});
