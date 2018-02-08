import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableHighlight, FlatList, Image, Modal, Button } from 'react-native';
import fireAPI from '../lib/fireAPI';

class ModalRow extends Component {
    constructor(props) {
        super(props);
        this._renderRowData = this._renderRowData.bind(this);
    }

    _onPressButton() {
        console.log('h');
    }

    _renderRowData() {
        let q = this.props.data;
        const listItems = Object.entries(q).map((pair) =>
            <View style={styles.day, {marginRight: 5, width:40}}>
                <Text style={{flex: .5, alignItems: 'center', fontSize: 24}}>{pair[1]['duration']}</Text>
                <View style={{flex: .5, flexDirection: 'row'}}>
                    <Button onPress={() => {console.log("Doh"); pair[1]['duration'] += 5; console.log(pair[1]['duration']);this._renderRowData();}} title={"+"} color={"#80CBC4"} />
                    <Button onPress={this._onPressButton} title={"-"} color={"red"} />
                </View>
            </View>);
        return (listItems);
    }

    render() {
        return (
            <View style={styles.scheduleRow}>
                <View style={{backgroundColor: '#80CBC4', width: 30, height: 60, justifyContent: 'center', alignItems: 'center'}}>
                    <Text>{this.props.zone}</Text>
                </View>
                <View style={styles.column}>
                    {this._renderRowData()}
                </View>
            </View>
        );
    }
}

class DayColumn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chosenZones: {},
        }
        this._load = this._load.bind(this);
        this._cb = this._cb.bind(this);
        this._load();
    }

    _load() {
        let zoneDurations = [];
        console.log('w');
        for (var i in this.props.zones) {
            if (this.props.selected[i] == 1) {
                zoneDurations.push(this.props.zones[i]);
                for (var j in this.props.zones[i]["z0" + i]) {
                }
            }
        }
        this.state.chosenZones = zoneDurations;
        console.log(this.state.chosenZones);
    }

    _cb(){
        console.log('i');
    }

    _renderItem = ({item}) => (
        <ModalRow
            zone={parseInt(Object.keys(item)[0].slice(1)) + 1}
            data={item[Object.keys(item)[0]]}
            callback={this._cb}
        />
    );

    render() {
        return (
            <View>
                <FlatList data={this.state.chosenZones} renderItem={this._renderItem} keyExtractor={item => Object.keys(item)[0]}/>
            </View>
        );
    }
}

class ScheduleRow extends Component {
        constructor(props) {
            super(props);
            this.state = {
                data: props.data,
                rowData: [],
                backgroundColor: '#FFF',
                color: '#80CBC4',
            };
            this._onPressButton = this._onPressButton.bind(this);
            this._renderRowData = this._renderRowData.bind(this);
        }
        _renderRowData() {
            ren = [];
            for (var key in Object.keys(this.props.data)) {
                let q  = this.props.data;
                if (this.props.data["0" + key]['duration'] > 0) {
                    ren.push(1);
                }
                else {
                    ren.push(0);
                }
            }
            const listItems = ren.map((r) => r == 1 ? <View style={styles.day}><Image style={styles.drop} source={require('../img/drop.png')}/></View> : <View style={styles.day}></View>);
            return (listItems);
        }
        _renderItem = ({item}) => (
            <DayColumn
                duration={item[Object.keys(item)]}
            />
        );
        _onPressButton()
        {
            var active;
            if (this.state.backgroundColor == '#FFF') {
                active = 1;
                this.setState({backgroundColor: '#80CBC4', color: '#FFF'})
            }
            else {
                active = 0;
                this.setState({backgroundColor: '#FFF', color: '#80CBC4'})
            }
            console.log("It Works"); 
            this.props.selected(active, this.props.zone);
        }
        render() {
        return (
            <View style={styles.scheduleRow}>
            <TouchableHighlight onPress={this._onPressButton}>
                <View style={{backgroundColor: this.state.backgroundColor, width: 60, height: 60, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: this.state.color, fontSize: 24}}>{this.props.zone}</Text>
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
        this.state = {
            zones: [],
            selectedZones: [],
            modalVisible: false,
        }
        this._loadZones = this._loadZones.bind(this);
        this._selectedCallback = this._selectedCallback.bind(this);
        this._renderSelected = this._renderSelected.bind(this);
        this._openModal = this._openModal.bind(this);
        this._closeModal = this._closeModal.bind(this);
        this._renderModal = this._renderModal.bind(this);
        this._modalCallback = this._modalCallback.bind(this);
        this._loadZones();
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
            let selectedZones = new Array(zones.length + 1).join('0').split('').map(parseFloat);
            this.setState({zones:zones, selectedZones});
        });
    }

    _renderModal() {
        return(<DayColumn
                    selected={this.state.selectedZones}
                    zones={this.state.zones}
                    callback={this._modalCallback}
            />);
    }

    _renderItem = ({item}) => (
            <ScheduleRow
                zone={parseInt(Object.keys(item)[0].slice(1)) + 1}
                data={item[Object.keys(item)[0]]}
                zoneState={this.state.selectedZones}
                selected={this._selectedCallback}
            />
    );

    _modalCallback(obj) {
        console.log("Activated");
    }

    _selectedCallback(active, id) {
        var selectedZones = this.state.selectedZones;
        selectedZones[id - 1] = active;
        this.setState({selectedZones}); 
    }
    
    _renderSelected() {
        var sZ = this.state.selectedZones;
        var active =  [];
        console.log(sZ);
        for (var i = 0; i < sZ.length; i++) {
            if (sZ[i] == 1) {
                active.push(i + 1);
            }
        }
        console.log(active);
        return (active);
    }

    _openModal() {
        this.setState({modalVisible: true})
    }

    _closeModal() {
        this.setState({modalVisible: false})
    }

    _saveChanges() {
        fireAPI.put('programSchedule/z00/00', {'duration': 20});
    }

    render() {
        return (
            <View style={styles.container}>
                <Modal
                    visible={this.state.modalVisible}
                    animationType={'slide'}
                    onRequestClose={() => this._closeModal()} 
                >
                    <View style={styles.modalContainer}>
                        <ScheduleHeader />
                        <View style={styles.innerContainer}>
                            {this._renderModal()}
                            <TouchableHighlight onPress={() =>this._saveChanges()}>
                                <View><Text>Save</Text></View>
                            </TouchableHighlight>
                            <TouchableHighlight onPress={() =>this._closeModal()}>
                                <View><Text>Close</Text></View>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Weekly Schedule</Text>
                </View>
                <ScheduleHeader />
                <View style={styles.graph}>
                    <FlatList data={this.state.zones} renderItem={this._renderItem} keyExtractor={item => Object.keys(item)[0]}/>
                </View>
                <View style={styles.footer}>
                    <Text style={{height: 20, margin: 5}}>{this._renderSelected()}</Text>
                    <TouchableHighlight onPress={() => this._openModal()}>
                        <View style={styles.circle}>
                            <Text style={{color: '#80CBC4'}}>Modify</Text>
                        </View>
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
    modalContainer: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'stretch',
    },
    innerContainer: {
        flex: .9,
        backgroundColor: '#FFF',
        alignItems: 'stretch',
    },
    circle: {
        height: 60,
        width: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#80CBC4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flex: 0.1,
        width: 340,
        alignItems: 'center',
        marginBottom: 10
    },
    headerText: {
        fontSize: 32,
        color: '#80CBC4',
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
        borderColor: '#FFF',
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
        width: 240,
        alignItems: 'center',
    },
    scheduleRow: {
        flex: 1,
        flexDirection:'row',
        backgroundColor: '#fff',
        alignItems: 'stretch',
    },
    column: {
        flexDirection:'row',
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#FFF',
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
