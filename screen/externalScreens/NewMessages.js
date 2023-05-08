import {View, Image, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Bubble, GiftedChat, Send} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import {useRoute} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

const NewMessage = () => {
  const [messages, setMessages] = useState([]);
  const [imageData, setImageData] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const route = useRoute();
  useEffect(() => {
    const querySnapShot = firestore()
      .collection('chats')
      .doc('123456789')
      .collection('messages')
      .orderBy('createdAt', 'desc');
    querySnapShot.onSnapshot(snapShot => {
      const allMessages = snapShot.docs.map(snap => {
        return {...snap.data(), createdAt: new Date()};
      });
      setMessages(allMessages);
    });
  }, []);

  const onSend = messageArray => {
    console.log('fsfsf');
    let myMsg = null;
    if (imageUrl !== '') {
      const msg = messageArray[0];
      myMsg = {
        ...msg,
        senderId: route.params.data.myId,
        receiverId: route.params.data.userId,
        image: imageUrl,
      };
    } else {
      const msg = messageArray[0];
      myMsg = {
        ...msg,
        senderId: route.params.data.myId,
        receiverId: route.params.data.userId,
        image: '',
      };
    }

    setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg));
    firestore()
      .collection('chats')
      .doc('123456789')
      .collection('messages')
      .add({
        ...myMsg,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    setImageUrl('');
    setImageData(null);
  };

  const openCamera = async () => {
    const result = await launchCamera({mediaType: 'photo'});
    if (result.didCancel && result.didCancel == true) {
    } else {
      setImageData(result);
      console.log(result);
      uplaodImage(result);
    }
  };

  const uplaodImage = async imageData => {
    const reference = storage().ref(imageData.assets[0].fileName);
    const pathToFile = imageData.assets[0].uri;
    await reference.putFile(pathToFile);
    const url = await storage()
      .ref(imageData.assets[0].fileName)
      .getDownloadURL();
    console.log('url', url);
    setImageUrl(url);
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <GiftedChat
        alwaysShowSend
        renderSend={props => {
          return (
            <View style={styles.chatSendMainContainer}>
              {imageUrl !== '' ? (
                <View style={styles.selectedImageContainer}>
                  <Image
                    source={{uri: imageData.assets[0].uri}}
                    style={styles.selectedImage}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setImageUrl('');
                    }}>
                    <Image
                      source={require('../../asset/close.png')}
                      style={styles.closeIcon}
                    />
                  </TouchableOpacity>
                </View>
              ) : null}
              <TouchableOpacity
                style={styles.openCameraButton}
                onPress={() => {
                  openCamera();
                }}>
                <Image
                  source={require('../../asset/image.png')}
                  style={styles.openCameraImage}
                />
              </TouchableOpacity>
              <Send {...props} containerStyle={{justifyContent: 'center'}}>
                <Image
                  source={require('../../asset/send.png')}
                  style={styles.sendIcon}
                />
              </Send>
            </View>
          );
        }}
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: route.params.data.myId,
        }}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: '#ff5435',
                },
              }}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chatSendMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },

  selectedImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginRight: 10,
  },

  selectedImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
    position: 'absolute',
  },

  closeIcon: {
    width: 10,
    height: 10,
    tintColor: '#fff',
    marginLeft: 5,
    marginTop: 5,
  },

  openCameraButton: {
    marginRight: 20,
  },

  openCameraImage: {
    width: 24,
    height: 24,
  },

  sendIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: 'orange',
  },
});
export default NewMessage;
