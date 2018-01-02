import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableHighlight, FlatList } from 'react-native';
import fireAPI from '../lib/fireAPI';

class ScheduleRow extends Component {
        render() {
        return (
            <TouchableHighlight>
                <View>
                    <Text>{this.props.zone}</Text>
                    <Text>{this.props.data['00']['duration']}</Text>
                </View>
            </TouchableHighlight>
        );
    }
}

export default class ScheduleScreen extends Component {
    constructor() {
        super();
        this._loadZones();
        this.state = {
            zones: []
        }
    }

    _loadZones() {
        fireAPI.get('programSchedule').then((val) => {
            let retrievedZones = val;
            let zones = []
            for (const key of Object.keys(retrievedZones)) {
                console.log(key, retrievedZones[key]);
                console.log(retrievedZones[key]['00']['duration']);
                let zone = {};
                zone[key] = retrievedZones[key];
                console.log(Object.keys(zone)[0], zone[Object.keys(zone)[0]]);
                zones.push(zone);
            }
            this.setState({zones:zones});
        });
    }

    _renderItem = ({item}) => (
            <ScheduleRow
                zone={Object.keys(item)[0]}
                data={item[Object.keys(item)[0]]}
            />
    );

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Next 7 Days</Text>
                </View>
                <View style={styles.graph}>
                    <FlatList data={this.state.zones} renderItem={this._renderItem} keyExtractor={item => Object.keys(item)[0]}/>
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
