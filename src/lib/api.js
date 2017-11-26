import {fireDB} from './firebaseInit';

class Api {
    static get(route) {
       return  fireDB.ref('microControllerBin/').once('value').then((snapshot) => {
            let test = snapshot.val();
            console.log(test);            
            return (test);
        });
    }
}

export default Api
