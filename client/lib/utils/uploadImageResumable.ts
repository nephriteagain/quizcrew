import {
    FirebaseStorageTypes,
    getDownloadURL,
    uploadBytesResumable,
} from "@react-native-firebase/storage";

export const uploadImageResumable = (
    storageRef: FirebaseStorageTypes.Reference,
    blob: Blob
): Promise<string | null> => {
    console.log("Uploading...");
    const uploadTask = uploadBytesResumable(storageRef, blob);

    // Return a promise to handle the upload process
    return new Promise((resolve, reject) => {
        // Monitor the upload progress
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Calculate the progress percentage
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${Math.floor(progress)}% done`);
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                }
            },
            (error) => {
                // Handle any errors that occur during the upload
                reject(error); // Return null on failure
            },
            () => {
                // When the upload completes successfully
                console.log("Upload completed");
                try {
                    if (!uploadTask.snapshot) {
                        console.error("uploadTask snapshot not found");
                        return;
                    }
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log("Image uploaded successfully. URL:", downloadURL);
                        resolve(downloadURL); // Return the download URL on success
                    });
                } catch (urlError) {
                    console.error("Failed to get download URL:", urlError);
                    reject(urlError); // Return null if getting download URL fails
                }
            }
        );
    });
};
