import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert } from "react-native";

export const useImagePicker = () => {
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

    const pickImage = async (options?: ImagePicker.ImagePickerOptions) => {
        setIsUploadingPhoto(true);
        try {
            let result = await ImagePicker.launchImageLibraryAsync(options);
            if (result.canceled) {
                console.log("canceled");
                return null;
            }
            return result.assets;
        } catch (error) {
            console.error("Error picking image:", error);
            Alert.alert("Error", "Failed to select image");
            return null;
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    const takePhoto = async (options?: ImagePicker.ImagePickerOptions) => {
        const status = await ImagePicker.getCameraPermissionsAsync();
        if (!status.granted) {
            const permission = await ImagePicker.requestCameraPermissionsAsync();
            if (!permission.granted) {
                Alert.alert("Permission Required", "Camera permission is required to take photos");
                return null;
            }
        }

        setIsUploadingPhoto(true);
        try {
            const result = await ImagePicker.launchCameraAsync(options);
            if (result.canceled) {
                console.log("canceled");
                return null;
            }
            return result.assets;
        } catch (error) {
            console.error("Error taking photo:", error);
            Alert.alert("Error", "Failed to take photo");
            return null;
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    return {
        isUploadingPhoto,
        pickImage,
        takePhoto,
    };
};
