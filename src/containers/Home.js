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
    searchPressed() {
        this.props.incrementTest();
        this.props.fetchRecipes('bacon, cucumber, banana');
    }

    renderSearch() {
        console.log("renderSearch");
        console.log(this.props.searchedRecipes);
        return Object.keys(this.props.searchedRecipes).map( key => this.props.searchedRecipes[key]); 
    }

    render()  {
        return (
            <View style={{ marginTop: 20 }}>
                <View>
                    <TouchableHighlight onPress={ () => this.searchPressed() }>
                        <Text>Fetch Recipes</Text>
                    </TouchableHighlight>
                </View>
                <ScrollView>
                    {this.renderSearch().map((obj) => {
                        console.log(obj);
                        console.log("Here I am");
                        return (
                        <View>
                            <Text>{obj}</Text>
                        </View>);
                    })
                    } 
                </ScrollView>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        searchedRecipes: state.searchedRecipes
    }
}

export default connect(mapStateToProps)(Home);
