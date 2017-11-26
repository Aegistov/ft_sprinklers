import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

export const searchedRecipes = createReducer({}, {
    [types.SET_SEARCHED_RECIPES](state, action) {
        let newState = action.recipes;
        console.log(action.recipes);
        return newState;
    }
});

export const recipeCount = createReducer(0, {
    [types.SET_SEARCHED_RECIPES](state, action) {
        return action.recipes;
    },
    [types.ADD_RECIPE](state, action) {
        return ++state;
    }
});

export const test = createReducer(0, {
    [types.TEST_INCREMENT](state, action) {
        return ++state;
    }
}); 
