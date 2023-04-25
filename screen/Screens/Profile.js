import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const Profile = () => {
  const [imageData, setImageData] = useState(null);
  const [imagedPicked, setImagePicked] = useState(false);
  const [uploadedPicUrl, setuploadedPicUrl] = useState('');
  useEffect(() => {
    getProfileData();
  }, []);

  const getProfileData = async () => {
    const userId = await AsyncStorage.getItem('USERID');
    firestore()
      .collection('Users')
      .doc(userId)
      .get()
      .then(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);

        if (documentSnapshot.exists) {
          console.log('User data: ', documentSnapshot.data());
          setuploadedPicUrl(documentSnapshot.data().profilePic);
        }
      });
  };

  const openCamera = async () => {
    const result = await launchCamera({mediaType: 'photo'});
    setImageData(result);
    console.log(result);
  };

  const openGallery = async () => {
    const result = await launchImageLibrary({mediaType: 'photo'});
    setImageData(result);
    setImagePicked(true);
    console.log(result);
  };

  const uploadProfilePic = async () => {
    const userId = await AsyncStorage.getItem('USERID');
    const reference = storage().ref(imageData.assets[0].fileName);
    const pathToFile = imageData.assets[0].uri;
    await reference.putFile(pathToFile);
    const url = await storage()
      .ref(imageData.assets[0].fileName)
      .getDownloadURL();
    console.log('Image uploaded to database');
    console.log(url);

    firestore()
      .collection('Users')
      .doc(userId)
      .update({
        profilePic: url,
      })
      .then(() => {
        console.log('Profile Updated');
      });
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Profile</Text>
      </View>
      <TouchableOpacity style={styles.profilePhotoButton}>
        {imageData === false && uploadProfilePic === '' ? (
          <Image
            source={require('../../asset/user.png')}
            style={styles.profilePhoto}
          />
        ) : imagedPicked === true ? (
          <Image
            source={{uri: imageData.assets[0].uri}}
            style={styles.profilePhoto}
          />
        ) : uploadProfilePic !== '' ? (
          <Image source={{uri: uploadedPicUrl}} style={styles.profilePhoto} />
        ) : (
          <Image
            source={{uri: imageData.assets[0].uri}}
            style={styles.profilePhoto}
          />
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.editProfileButton}>
        <Text
          style={styles.editProfileText}
          onPress={() => {
            if (imagedPicked === false) {
              openGallery();
              // setImagePicked(true);
            } else {
              setuploadedPicUrl(false);
              uploadProfilePic();
            }
          }}>
          {imagedPicked === true ? 'Save Pic' : 'Edit Profile'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headerContainer: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#8e8e8e',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '600',
  },
  profilePhotoButton: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  editProfileButton: {
    width: 200,
    height: 40,
    borderWidth: 0.2,
    alignSelf: 'center',
    borderRadius: 8,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ff5252',
  },
  editProfileText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ff5252',
  },
});
