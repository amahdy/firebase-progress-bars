import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from './firebase-config';

const firebaseApp = initializeApp(firebaseConfig);

// Create a root reference
const storage = getStorage(firebaseApp);

let files = [];
document.getElementById("file").addEventListener("change", function(e) {
  files = e.target.files;
});

document.getElementById('file').addEventListener("change", function() {
  //checks if files are selected
  if (files.length != 0) {

    // Create the file metadata
    /** @type {any} */
    const metadata = {
      contentType: 'image/jpeg'
    };

    // Create a reference to 'mountains.jpg'
    // const file = ref(storage, files[0]);

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, 'images/' + files[0].name);
    const uploadTask = uploadBytesResumable(storageRef, files[0], metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        document.getElementById("progress").value = progress;
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;

          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      }, 
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          document.getElementById('linkbox').innerHTML = '<a target="_blank" href="' +  downloadURL + '">Click For File</a>'
        });
      }
    );
  } else {
    console.log("No file??");
  }
});

// const auth = getAuth(firebaseApp);
// onAuthStateChanged(auth, async user => {
//   if(user != null) {
//     console.log('We have a logged in user!');
//   }
// });
