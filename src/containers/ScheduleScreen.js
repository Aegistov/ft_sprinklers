import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableHighlight, FlatList, Image } from 'react-native';
import fireAPI from '../lib/fireAPI';

class DayColumn extends Component {
    render() {
        return (
            <View style={styles.column}>
                <Text>Hello World</Text>
            </View>
        );
    }
}

class ScheduleRow extends Component {
        constructor(props) {
            super(props);
            this.state = {
                data: props.data,
                rowData: []
            }
        }
        _renderRowData() {
            console.log("Loading Row Data");
            console.log(this.props.data);
            ren = [];
            for (var key in Object.keys(this.props.data)) {
                let q = this.props.data;
                console.log(key);
                console.log(this.props.data["0" + key]);
                console.log(this.props.data["0" + key]['duration']);
                if (this.props.data["0" + key]['duration'] > 0) {
                    console.log('<View><Text>X</Text></View>');
                    ren.push(1);
                }
                else {
                    console.log('<View><Text>E</Text></View>');
                    ren.push(0);
                }
            }
            const listItems = ren.map((r) => r == 1 ? <View style={styles.day}><Image style={styles.drop} source={require('../img/drop.png')}/></View> : <View style={styles.day}><Text>y</Text></View>);
            console.log('test');
            console.log(ren);
            return (listItems);
        }
        _renderItem = ({item}) => (
            <DayColumn
                duration={item[Object.keys(item)]}
            />
        );
        render() {
        return (
            <View style={styles.scheduleRow}>
            <TouchableHighlight>
                <View>
                    <Text style={styles.zoneButton}>{this.props.zone}</Text>
                </View>
            </TouchableHighlight>
                <View style={styles.column}>
                    {this._renderRowData()}
                </View>
            </View>
        );
    }
}

class ScheduleHeader extends Component {
    constructor() {
        super();
        this.state = {
            text: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        };
    }

    _renderHeader() {
        const scheduleHeader = this.state.text.map((t) => <View style={styles.day}><Text style={styles.scheduleHeaderText}>{t}</Text></View>);
        return (scheduleHeader);
    }

    render() {
        return (
            <View style={styles.scheduleHeader}>
                <View>
                    <Text style={{fontSize:14, fontWeight:'bold', color:'#80CBC4', padding:12, marginTop: 10}}>ZONE</Text>
                </View>
                <View style={styles.column}>
                    {this._renderHeader()}      
                </View>
            </View>
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
                let zone = {};
                zone[key] = retrievedZones[key];
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
                <ScheduleHeader />
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
    scheduleHeader: {
        flex: .1,
        flexDirection: 'row',
        alignItems: 'stretch',
        width: 340,
    },
    headerCol: {
        flex: .14,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: 'red',
    },
    scheduleHeaderText: {
        fontSize: 24,
        color: '#80CBC4',
    },
    graph: {
        flex: 0.6,
        backgroundColor: '#fff',
        width: 340,
    },
    footer: {
        flex: 0.2,
        backgroundColor: '#228B22',
        width: 240,
        alignItems: 'center',
    },
    scheduleRow: {
        flex: 1,
        flexDirection:'row',
        backgroundColor: '#fff',
        alignItems: 'stretch',
    },
    zoneButton: {
        fontSize: 24,
        padding: 10,
        flex: 0.166,
        color: '#80CBC4',
    },
    column: {
        flexDirection:'row',
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: 'red',
    },
    day: {
        flex: 0.2,
        alignItems: 'center',
        padding: 5,
        marginTop: 10,
    },
    drop: {
        width: 24,
        height: 24,
    }
});
