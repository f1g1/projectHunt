import { fireStorage } from '../firebase';
import moment from 'moment';

const MediaService = {
    SaveImage

}

async function SaveImage(image) {
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

}

export default MediaService