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
        }
        this.databaseRef = this.getDatabaseRef();
        this.readInZones();
		this.onPressDo = this.onPressDo.bind(this);
	}
    onPressDo() {
        console.log("I did it!");
    }

    getDatabaseRef() {
        return firebase.database().ref('Zones/');
    }

    readInZones() {
        let zones = [];
       this.databaseRef.on('value', (snapshot) => {
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

    render() {
        return (
        <View style={styles.container}>
            <Text>Open up App.js to start working on your app!</Text>
            <Button
		        onPress={this.onPressDo}
		        title="Learn More"
		    color="#841584"
	        />
            <Text>Test Content</Text>
            <FlatList
                data={this.state.zones}
                //data={[{title: 'Title Text', key: 'item1'}, {title: 'Serving more content', key: 'item2'}]}
                renderItem={({item}) => <Text> Zone: {item.key}     Status: {item.zoneStatus}   Duration:{item.duration} </Text>}
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
