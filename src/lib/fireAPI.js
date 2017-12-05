import {fireDB} from './firebase';

export default class fireAPI {
    static get(route) {
        return fireDB.ref(route).once('value').then((snapshot) => {
            let retrievedObject = snapshot.val();
            return (retrievedObject);
        });
    }

    static listen(route) {
        return fireDB.ref(route).on('value', (snapshot) => {
            let retrievedObject = snapshot.val();
            return (retrievedObject);
        });
    }
    
    static put(route, obj) {
        return fireDB.ref(route).update(obj);
    }
}
