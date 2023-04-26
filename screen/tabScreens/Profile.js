import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {useNavigation} from '@react-navigation/native';
let userId = '';

const Profile = () => {
  const navigation = useNavigation();
  const [imageData, setImageData] = useState(null);
  const [imagePicked, setImagePicked] = useState(false);
  const [uplaodedPicUrl, setUplaodedPicUrl] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    getProfileData();
  }, []);

  const getProfileData = async () => {
    userId = await AsyncStorage.getItem('USERID');
    firestore()
      .collection('Users')
      .doc(userId)
      .get()
      .then(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);

        if (documentSnapshot.exists) {
          console.log('User data: ', documentSnapshot.data());
          setUplaodedPicUrl(documentSnapshot.data().profilePic);
          setFollowers(documentSnapshot.data().followers);
          setFollowing(documentSnapshot.data().following);
          console.log('data ', documentSnapshot.data().following);
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
    const reference = storage().ref(imageData.assets[0].fileName);
    const pathToFile = imageData.assets[0].uri;
    await reference.putFile(pathToFile);
    const url = await storage()
      .ref(imageData.assets[0].fileName)
      .getDownloadURL();
    saveProfileToStore(url);
  };

  const saveProfileToStore = async url => {
    const userId = await AsyncStorage.getItem('USERID');
    console.log(userId, ' ' + url);
    firestore()
      .collection('Users')
      .doc(userId)
      .update({
        profilePic: url,
      })
      .then(() => {
        console.log('profile updated!');
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getFollowStatus = followers => {
    let status = false;

    followers.map(item => {
      if (item.userId == userId) {
        status = true;
      } else {
        status = false;
      }
    });
    return status;
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
        ) : imagePicked === true ? (
          <Image
            source={{uri: imageData.assets[0].uri}}
            style={styles.profilePhoto}
          />
        ) : uploadProfilePic !== '' ? (
          <Image source={{uri: uplaodedPicUrl}} style={styles.profilePhoto} />
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
            if (imagePicked === false) {
              openGallery();
              // setImagePicked(true);
            } else {
              setImagePicked(false);
              uploadProfilePic();
            }
          }}>
          {imagePicked === true ? 'Save Pic' : 'Edit Profile'}
        </Text>
      </TouchableOpacity>

      <View style={styles.followerFollowingContainer}>
        <TouchableOpacity
          style={[
            styles.followerButton,
            {backgroundColor: selectedTab == 0 ? '#fff' : 'rgba(0,0,0,0)'},
          ]}
          onPress={() => {
            setSelectedTab(0);
          }}>
          <Text style={{fontSize: 18}}>Followers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.followingButton,
            {backgroundColor: selectedTab == 1 ? '#fff' : 'rgba(0,0,0,0)'},
          ]}
          onPress={() => {
            setSelectedTab(1);
          }}>
          <Text style={{fontSize: 18}}>Following</Text>
        </TouchableOpacity>
      </View>

      {selectedTab == 1 ? null : (
        <FlatList
          data={followers}
          renderItem={({item, index}) => {
            return (
              <View style={styles.userMainContainerFollower}>
                <View style={styles.userContainerFollower}>
                  <Image
                    source={
                      item.profilePic == ''
                        ? require('../../asset/user.png')
                        : {uri: item.profilePic}
                    }
                    style={styles.userProfilePhotoFollower}
                  />
                  <Text style={styles.userNameFollower}>{item.name}</Text>
                </View>
                <TouchableOpacity
                  style={styles.chatButtonFollower}
                  onPress={() => {
                    navigation.navigate('NewMessages', {
                      data: {
                        userId: item.userId,
                        name: item.name,
                        myId: userId,
                        profilePic:
                          item.profilePic == '' || item.profilePic == null
                            ? ''
                            : item.profilePic,
                      },
                    });
                  }}>
                  <Image
                    source={require('../../asset/chat.png')}
                    style={styles.chatIconFollower}
                  />
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}

      {selectedTab == 0 ? null : (
        <FlatList
          data={following}
          renderItem={({item, index}) => {
            return (
              <View style={styles.userMainContainerFollowing}>
                <View style={styles.userContainerFollowing}>
                  <Image
                    source={
                      item.profilePic == ''
                        ? require('../../asset/user.png')
                        : {uri: item.profilePic}
                    }
                    style={styles.userProfilePhotoFollowing}
                  />
                  <Text style={styles.userNameFollowing}>{item.name}</Text>
                </View>
                <TouchableOpacity
                  style={styles.chatButtonFollowing}
                  onPress={() => {
                    navigation.navigate('Messages', {
                      data: item,
                    });
                  }}>
                  <Image
                    source={require('../../asset/chat.png')}
                    style={styles.chatIconFollowing}
                  />
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

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
  followerFollowingContainer: {
    width: '100%',
    height: 60,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 30,
  },
  followerButton: {
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  followingButton: {
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userMainContainerFollower: {
    width: '100%',
    height: 70,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userContainerFollower: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userProfilePhotoFollower: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 20,
    marginRight: 10,
  },
  userNameFollower: {
    fontSize: 18,
    fontWeight: '600',
  },
  chatButtonFollower: {
    marginRight: 20,
  },
  chatIconFollower: {
    width: 24,
    height: 24,
    tintColor: 'orange',
  },
  userMainContainerFollowing: {
    width: '100%',
    height: 70,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userContainerFollowing: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userProfilePhotoFollowing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 20,
    marginRight: 10,
  },
  userNameFollowing: {
    fontSize: 18,
    fontWeight: '600',
  },
  chatButtonFollowing: {
    marginRight: 20,
  },
  chatIconFollowing: {
    width: 24,
    height: 24,
    tintColor: 'orange',
  },
});

export default Profile;
