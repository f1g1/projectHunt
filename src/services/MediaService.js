import moment from 'moment'
import { fireStorage } from '../firebase';

const MediaService = {
    SaveImageStep

}

async function SaveImageStep(image) {
    debugger;
    if (!image) return;
    const timestamp = moment()
        .valueOf()
        .toString();

    const ref = fireStorage.ref();
    const task = ref.child(timestamp).put(image);
    return task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then((url) => {
            console.log(url);
            return url;
        })
    // const uploadTask = fireStorage
    //     .ref()
    //     .child(timestamp)
    //     .put(image)
    // let zz;


    // await uploadTask.on(
    //     "state_changed",
    //     null,
    //     err => {
    //     },
    //     async () => uploadTask.snapshot.ref.getDownloadURL());
}

export default MediaService