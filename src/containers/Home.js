import React, { Component } from 'react';
import ReactNative from 'react-native';
import { connect } from 'react-redux';

const {
    ScrollView,
    View,
    Text,
    TextInput,
    Image,
    TouchableHighlight,
    StyleSheet,
} = ReactNative

class Home extends Component {
    constructor() {
        super();
        this.state = {
            searching: false,
            ingredientsInput: '',
        }
    }
    searchPressed() {
        this.setState({searching: true });
        this.props.incrementTest();
        this.props.fetchRecipes(this.state.ingredientsInput).then( () => {
            this.setState({searching: false});
        });
    }

    renderSearch() {
        console.log("renderSearch");
        console.log(this.props.searchedRecipes);
        if (!this.state.ingredientsInput) {
            return (
                <View>
                    <Text>Click Above to Receive Latest Info</Text>
                </View>
            );
        }
        else {
            return (
                <View>
                    <Text style={styles.resultText}>{this.props.searchedRecipes.sensorOutput}</Text>
                </View>
            );
        }
    }

    render()  {
        return (
            <View style={styles.scene}>
                <View style={styles.searchSection}>
                    <TextInput style={styles.searchInput}
                        returnKeyType='search'
                        placeholder='Ingredients'
                        onChangeText={ (ingredientsInput) => this.setState({ingredientsInput}) }
                        value={this.state.ingredientsInput}  
                    />
                    <TouchableHighlight onPress={ () => this.searchPressed() } style={styles.searchButton}>
                        <Text>Fetch Recipes</Text>
                    </TouchableHighlight>
                </View>
                <ScrollView style={styles.scrollSection}>
                    {!this.state.searching && this.renderSearch()} 
                    { this.state.searching ? <Text>Searching...</Text> : null }
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
        marginTop: 20,
    },
    searchSection: {
        height: 30,
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        padding: 5,
        flexDirection: 'row',
    },
    searchInput: {
        flex: 0.7,
    },
    searchButton: {
        flex: 0.3,
    },
    scrollSection: {
        flex: 0.5,
    },
    resultText: {
        backgroundColor: '#000',
        color: '#FFF',
        height: 20
    },
});

function mapStateToProps(state) {
    return {
        searchedRecipes: state.searchedRecipes
    }
}

export default connect(mapStateToProps)(Home);
