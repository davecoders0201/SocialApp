import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

const Add = () => {
  const [imageData, setImageData] = useState(null);
  const [imageUrl, setImageUrl] = useState();

  const openCamera = async () => {
    const result = await launchCamera({mediaType: 'photo'});
    setImageData(result);
    console.log(result);
  };

  const openGallery = async () => {
    const result = await launchImageLibrary({mediaType: 'photo'});
    setImageData(result);
    console.log(result);
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
    firestore()
      .collection('Posts')
      .add({
        image: url,
      })
      .then(() => {
        console.log('Post Added');
      });

    firestore()
      .collection('Posts')
      .get()
      .then(querySnapshot => {
        console.log('Total Posts: ', querySnapshot.size);

        querySnapshot.forEach(documentSnapshot => {
          console.log(
            'User ID: ',
            documentSnapshot.id,
            documentSnapshot.data(),
          );
        });
      });
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.postText}>Post</Text>
        <Text
          style={[
            styles.uploadText,
            {color: imageData !== null ? 'blue' : '#8e8e8e'},
          ]}
          onPress={() => {
            if (imageData !== null) {
              uploadImage();
            }
          }}>
          Upload
        </Text>
      </View>
      <View style={styles.imageContainer}>
        {imageData !== null ? (
          <Image
            source={{uri: imageData.assets[0].uri}}
            style={styles.postImage}
          />
        ) : (
          <Image
            source={require('../../asset/image-placeholder.png')}
            style={styles.postImage}
          />
        )}
        <TextInput
          placeholder="type caption here..."
          style={styles.captionStyle}></TextInput>
      </View>
      <TouchableOpacity
        style={styles.cameraGalleryButton}
        onPress={() => {
          openCamera();
        }}>
        <Image
          source={require('../../asset/camera.png')}
          style={styles.cameraGalleryIcon}
        />
        <Text style={styles.cameraGalleryButtonText}>Open Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.cameraGalleryButton}
        onPress={() => {
          openGallery();
        }}>
        <Image
          source={require('../../asset/gallery.png')}
          style={styles.cameraGalleryIcon}
        />
        <Text style={styles.cameraGalleryButtonText}>Open Gallery</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Add;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headerContainer: {
    width: '100%',
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#8e8e8e',
  },
  postText: {
    marginLeft: 20,
    fontSize: 20,
    color: '#000',
  },
  captionStyle: {
    width: '70%',
  },
  uploadText: {
    marginRight: 20,
    fontSize: 18,
  },
  imageContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    borderColor: '#8e8e8e',
    borderRadius: 10,
    height: 150,
    borderWidth: 0.2,
    flexDirection: 'row',
  },
  postImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    margin: 10,
  },
  cameraGalleryButton: {
    width: '100%',
    marginTop: 30,
    height: 50,
    borderBottomWidth: 0.2,
    borderBottomColor: '#8e8e8e',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cameraGalleryIcon: {
    width: 24,
    height: 24,
    marginLeft: 20,
  },
  cameraGalleryButtonText: {
    marginLeft: 15,
    fontVariant: 'bold',
  },
});
