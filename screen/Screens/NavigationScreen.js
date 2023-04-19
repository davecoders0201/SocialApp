import {
  Image,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
const NavigationScreen = ({navigation}) => {
  const [imageData, setImageData] = useState(null);
  const [imageUrl, setImageUrl] = useState();
  const openCamera = async () => {
    const result = await launchCamera({mediaType: 'photo'});
    setImageData(result);
    console.log(result);
  };

  const requestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        openCamera();
      } else {
        console.log('camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const uploadImage = async () => {
    const reference = storage().ref(imageData.assets[0].fileName);
    const pathToFile = imageData.assets[0].uri;
    // uploads file
    await reference.putFile(pathToFile);
    const url = await storage()
      .ref(imageData.assets[0].fileName)
      .getDownloadURL();
    console.log('Image uploaded to database');
    console.log(url);
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.navigationButton}>
          <Image
            source={require('../../asset/home.png')}
            style={styles.navigationImage}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navigationButton}>
          <Image
            source={require('../../asset/search.png')}
            style={styles.navigationImage}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navigationButton}>
          <Image
            source={require('../../asset/add.png')}
            style={styles.navigationImage}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navigationButton}>
          <Image
            source={require('../../asset/chat.png')}
            style={styles.navigationImage}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navigationButton}>
          <Image
            source={require('../../asset/profile.png')}
            style={styles.navigationImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NavigationScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    position: 'absolute',
    bottom: 0,
    height: 70,
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  navigationButton: {
    width: '20%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationImage: {
    width: 25,
    height: 25,
  },
});
