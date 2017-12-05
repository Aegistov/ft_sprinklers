import {fireDB} from './firebase';

export default class fireAPI {
    static get(route) {
        return fireDB.ref(route).once('value').then((snapshot) => {
            let retrievedObject = snapshot.val();
            return (retrievedObject);
        });
    }
}
