import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
let userId = '';
const Search = () => {
  const [userList, setUserList] = useState([]);
  const [onFollowClick, setOnFollowClick] = useState(false);
  useEffect(() => {
    getUsers();
  }, [onFollowClick]);

  const getUsers = async () => {
    userId = await AsyncStorage.getItem('USERID');
    let tempUsers = [];
    firestore()
      .collection('Users')
      .get()
      .then(querySnapshot => {
        querySnapshot._docs.map(item => {
          if (item._data.userId !== userId) {
            tempUsers.push(item);
          }
        });
        setUserList(tempUsers);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const followUser = async item => {
    let tempFollowers = item._data.followers;
    let following = [];
    await firestore()
      .collection('Users')
      .doc(userId)
      .get()
      .then(snapShot => {
        following = snapShot._data.following;
        console.log('snapdhot:::', following);
      })
      .catch(error => {
        console.log(error);
      });

    if (following.length > 0) {
      following.map(item2 => {
        if (item2 === item._data.userId) {
          let index2 = following.indexOf(item._data.userId);
          if (index2 > -1) {
            following.splice(index2, 1);
          }
        } else {
          following.push(item._data.userId);
        }
      });
    } else {
      following.push(item._data.userId);
    }

    if (tempFollowers.length > 0) {
      tempFollowers.map(item1 => {
        if (item1 === userId) {
          let index = tempFollowers.indexOf(userId);
          if (index > -1) {
            tempFollowers.splice(index, 1);
          }
        } else {
          tempFollowers.push(userId);
        }
      });
    } else {
      tempFollowers.push(userId);
    }

    firestore()
      .collection('Users')
      .doc(userId)
      .update({
        following: following,
      })
      .then(res => {})
      .catch(error => {
        console.log(error);
      });

    firestore()
      .collection('Users')
      .doc(item._data.userId)
      .update({
        followers: tempFollowers,
      })
      .then(res => {})
      .catch(error => {
        console.log(error);
      });

    setOnFollowClick(!onFollowClick);
    getUsers();
  };

  const getFollowStatus = followers => {
    let status = false;
    followers.map(item => {
      if (item === userId) {
        status = true;
      } else {
        status = false;
      }
    });
    return status;
  };
  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={userList}
        renderItem={({item, index}) => {
          return (
            <View style={styles.userListMainContainer}>
              <View style={styles.userListContainer}>
                <Image
                  source={
                    item._data.profilePic === ''
                      ? require('../../asset/user.png')
                      : {uri: item._data.profilePic}
                  }
                  style={styles.profilePic}
                />
                <Text style={styles.userName}>{item._data.name}</Text>
              </View>
              <TouchableOpacity
                style={styles.followButton}
                onPress={() => {
                  followUser(item);
                }}>
                <Text style={styles.followButtonText}>
                  {getFollowStatus(item._data.followers)
                    ? 'Unfollow'
                    : 'Follow'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  userListMainContainer: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  userListContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 20,
    marginLeft: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
  },
  followButton: {
    marginRight: 20,
    backgroundColor: '#0099ff',
    height: 35,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  followButtonText: {
    color: '#fff',
    marginRight: 10,
    marginLeft: 10,
  },
});
