import React from 'react';
import { StyleSheet, Text, View, Button, FlatList, ListItem } from 'react-native';
import * as firebase from "firebase";

//Firebase Initializer
const config = {
    apiKey: "AIzaSyAiPg4F4t0kVQ4AqLZISYeJhOlQ8yf15pw",
    authDomain: "ft-sprinklers.firebaseapp.com",
    databaseURL: "https://ft-sprinklers.firebaseio.com",
    projectId: "ft-sprinklers",
    storageBucket: "ft-sprinklers.appspot.com",
    messagingSenderId: "324804803769"
  };
  firebase.initializeApp(config);
// Get a reference to the database service
const database = firebase.database();

export default class App extends React.Component {
  constructor() {
		super();
        this.state = {
            zones: [],
            zoneToggled: false,
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
                zones.push({
                    key: child.key,
                    zoneStatus: child.val().Status,
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
                //data={[{title: 'Title Text', key: 'item1'}, {title: 'Serving more content', key: 'item2'}]}
                renderItem={({item}) => <View style={{flexDirection: 'row'}}><Text> Zone: {item.key}     Status: {item.zoneStatus}   Duration:{item.duration} </Text><Button title={item.key} onPress={this._toggleZone(item)}/></View>}
            />
            <Text>Changes you make will automatically reload.</Text>
            <Text>Shake your phone to open the developer menu.</Text>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
