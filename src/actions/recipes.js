import * as types from './types';
import Api from '../lib/api';

export function fetchRecipes(ingredients) {
    return (dispatch, getState) => {
        const params = [
            `ingredients=${encodeURIComponent(ingredients)}`,
            'fillIngredients=false',
            'limitLicense=false',
            'number=20',
            'ranking=1',
        ].join('&');
        return Api.get('/microControllerBin').then(resp => {
            dispatch(setSearchedRecipes({ recipes: resp}));
        });
    }
}

export function setSearchedRecipes( { recipes } ) {
    return {
        type: types.SET_SEARCHED_RECIPES,
        recipes
    }
}

export function addRecipe() {
    return {
        type: types.ADD_RECIPE,
    }
}

export function incrementTest() {
    return {
        type: types.TEST_INCREMENT,
    }
}
