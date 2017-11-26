import React from 'react';
import { StyleSheet, Text, View, Button, FlatList, ListItem, Switch } from 'react-native';
import * as firebase from "firebase";
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReduxers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducer from './reducers';
import AppContainer from './containers/AppContainer';

const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__});

function configureStore(initialState) {
    const enhancer = compose(
        applyMiddleware(
            thunkMiddleware,
            loggerMiddleware,
        ),
    );
    return createStore(reducer, initialState, enhancer);
}

const store = configureStore({});

//Firebase Initializer
// Get a reference to the database service
const database = firebase.database();

class Zone extends React.Component {
   constructor(props) {
        super(props);
        this.state = {
            zoneStatus: props.zoneStatus,
        }
    } 
    render() {
        return (
            <View style={{backgroundColor: 'blue', flex: 0.5}}>
            <Text> {this.props.zoneId}</Text>
            <Switch
                onValueChange={(value) => this.setState({zoneStatus: value})}
                style={{marginBottom: 10}}
                value={this.state.zoneStatus}
            />
            </View>
        );
    }
}

class Home extends React.Component {
  constructor() {
		super();
        this.state = {
            zones: [],
            zoneToggled: false,
            switchState: false,
        }
        this.databaseRef = this.getDatabaseRef();
        this.readInZones();
		this.onPressDo = this.onPressDo.bind(this);
        this._onPressWrite = this._onPressWrite.bind(this);
        this._toggleZone = this._toggleZone.bind(this);
	}
    onPressDo() {
        console.log("I did it!");
    }

    getDatabaseRef() {
        return firebase.database().ref('Zones/');
    }

    readInZones() {
        let zones = [];
       this.databaseRef.once('value', (snapshot) => {
            snapshot.forEach((child) => {
                console.log(child);
                console.log(child.key);
                let zoneStatus = false;
                if (child.val().Status == 1) {
                    zoneStatus = true;
                }
                zones.push({
                    key: child.key,
                    zoneStatus: zoneStatus,
                    duration: child.val().Duration
                });
                this.setState({zones});
            });
        }); 
    }

    _onPressWrite() {
        console.log("...Writing");
        this.databaseRef.child('Test Dump').set({Entry: "Hello World!"});
    }

    _toggleZone(zone) {
        if (this.state.zoneToggled) {
            (zone.zoneStatus == 1)
                ? newZoneStatus = 0
                : newZoneStatus = 1
            this.databaseRef.child(zone.key).update({Status: newZoneStatus});
            this.setState({zoneToggled: !this.state.zoneToggled});
        }
        
    }

    renderZone =  ({item}) => (
        <Zone zoneStatus={item.zoneStatus} zoneId={item.key}/>
    );

    render() {
        return ( 
        <View style={styles.container}>
            <Text> This is Acting as a buffer, and just that</Text>
            <Text>Open up App.js to start working on your app!</Text>
            <Button
		        onPress={this._onPressWrite}
		        title="Learn More"
		    color="#841584"
	        />
            <Text>Test Content</Text>
            <FlatList
                data={this.state.zones}
                numColumns={2}                
//renderItem={({item}) => <View style={{flexDirection: 'row'}}><Text> Zone: {item.key}     Status: {item.zoneStatus}   Duration:{item.duration} </Text><Button title={item.key} onPress={this._toggleZone(item)}/></View>}
                renderItem={this.renderZone}
//                renderItem={({item}) => <ListItem title={item.key}/>}
            />
            <Switch
                onValueChange={(value) => this.setState({switchState: value})}
                style={{marginBottom: 10}}
                value={this.state.switchState}
            />
            <Text>Changes you make will automatically reload.</Text>
            <Text>Shake your phone to open the developer menu.</Text>
        </View>
    );
  }
}

export default class Main extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <AppContainer /> 
           </Provider>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
