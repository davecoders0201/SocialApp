import {
  Image,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';

// This is the import of the lauchCamera and launchImageLibrary
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import storage from '@react-native-firebase/storage';
import Home from './Home';
import Search from './Search';
import Add from './Add';
import Chat from './Chat';
import Profile from './Profile';
const NavigationScreen = ({navigation}) => {
  const [selectedTab, setSelectedTab] = useState(0);

  // This is the OpenCamera and uploadPhoto to the Database Function
  // const [imageData, setImageData] = useState(null);
  // const [imageUrl, setImageUrl] = useState();

  // const openCamera = async () => {
  //   const result = await launchCamera({mediaType: 'photo'});
  //   setImageData(result);
  //   console.log(result);
  // };

  // const requestPermission = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.CAMERA,
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       openCamera();
  //     } else {
  //       console.log('camera permission denied');
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // };
  // const uploadImage = async () => {
  //   const reference = storage().ref(imageData.assets[0].fileName);
  //   const pathToFile = imageData.assets[0].uri;
  //   // uploads file
  //   await reference.putFile(pathToFile);
  //   const url = await storage()
  //     .ref(imageData.assets[0].fileName)
  //     .getDownloadURL();
  //   console.log('Image uploaded to database');
  //   console.log(url);
  // };
  return (
    <View style={styles.mainContainer}>
      {selectedTab === 0 ? (
        <Home />
      ) : selectedTab === 1 ? (
        <Search />
      ) : selectedTab === 2 ? (
        <Add />
      ) : selectedTab === 3 ? (
        <Chat />
      ) : (
        <Profile />
      )}
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={() => setSelectedTab(0)}>
          <Image
            source={require('../../asset/home.png')}
            style={{
              width: 25,
              height: 25,
              tintColor: selectedTab === 0 ? 'red' : '#8e8e8e',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={() => setSelectedTab(1)}>
          <Image
            source={require('../../asset/search.png')}
            style={{
              width: 25,
              height: 25,
              tintColor: selectedTab === 1 ? 'red' : '#8e8e8e',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={() => setSelectedTab(2)}>
          <Image
            source={require('../../asset/add.png')}
            style={{
              width: 25,
              height: 25,
              tintColor: selectedTab === 2 ? 'red' : '#8e8e8e',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={() => setSelectedTab(3)}>
          <Image
            source={require('../../asset/chat.png')}
            style={{
              width: 25,
              height: 25,
              tintColor: selectedTab === 3 ? 'red' : '#8e8e8e',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={() => setSelectedTab(4)}>
          <Image
            source={require('../../asset/profile.png')}
            style={{
              width: 25,
              height: 25,
              tintColor: selectedTab === 4 ? 'red' : '#8e8e8e',
            }}
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
});
