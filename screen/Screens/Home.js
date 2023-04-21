import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const Home = () => {
  const [onLickClick, setOnLikeClick] = useState(false);
  const [postData, setPostData] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    getUserId();
    getData();
  }, [onLickClick]);

  const getUserId = async () => {
    userId = await AsyncStorage.getItem('USERID');
  };
  const getData = () => {
    let tempData = [];
    firestore()
      .collection('Posts')
      .get()
      .then(querySnapshot => {
        console.log('Total Posts: ', querySnapshot.size);

        querySnapshot.forEach(documentSnapshot => {
          tempData.push(documentSnapshot.data());
        });
        setPostData(tempData);
      });
  };

  const getLikeStatus = likes => {
    let status = false;
    likes.map(item => {
      if (item === userId) {
        status = true;
      } else {
        status = false;
      }
    });
    return status;
  };

  const onLike = item => {
    let tempLikes = item.likes;
    if (tempLikes.length > 0) {
      tempLikes.map(item1 => {
        if (item1 === userId) {
          const index = tempLikes.indexOf(item1);
          if (index > -1) {
            tempLikes.splice(index, 1);
          }
        } else {
          tempLikes.push(userId);
        }
      });
    } else {
      tempLikes.push(userId);
    }

    firestore()
      .collection('Posts')
      .doc(item.postId)
      .update({
        likes: tempLikes,
      })
      .then(() => {
        console.log('Post updated');
      })
      .catch(error => {
        console.log(error);
      });
    setOnLikeClick(!onLickClick);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>MD Social</Text>
      </View>
      {postData.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={postData}
          renderItem={({item, index}) => {
            return (
              <View
                style={[
                  styles.flatListPost,
                  {marginBottom: postData.length - 1 === index ? 80 : 0},
                ]}>
                {/* <Image source={{uri: item.image}} style={styles.imagePost} /> */}
                <View style={styles.userContainer}>
                  <Image
                    source={require('../../asset/user.png')}
                    style={styles.userImage}
                  />
                  <Text style={styles.userName}>{item.name}</Text>
                </View>
                <Text style={styles.captionText}>{item.caption}</Text>
                <Image source={{uri: item.image}} style={styles.imagePost} />
                <View style={styles.likeCommentButtonContainer}>
                  <TouchableOpacity
                    style={styles.likeCommentButton}
                    onPress={() => {
                      onLike(item);
                    }}>
                    <Text style={styles.likeCommentButtonText}>
                      {item.likes.length}
                    </Text>
                    {getLikeStatus(item.likes) ? (
                      <Image
                        source={require('../../asset/love.png')}
                        style={styles.loveCommentIcon}
                      />
                    ) : (
                      <Image
                        source={require('../../asset/heart.png')}
                        style={styles.loveCommentIcon}
                      />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.likeCommentButton}
                    onPress={() =>
                      navigation.navigate('Comment', {
                        postId: item.postId,
                        comments: item.comments,
                      })
                    }>
                    <Text style={styles.likeCommentButtonText}>
                      {item.comments.length}
                    </Text>
                    <Image
                      source={require('../../asset/comment.png')}
                      style={styles.loveCommentIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      ) : (
        <View style={styles.postNotFound}>
          <Text>Post is Not There</Text>
        </View>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headerContainer: {
    justifyContent: 'center',
    paddingLeft: 20,
    backgroundColor: '#fff',
    width: '100%',
    height: 60,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 700,
    color: '#000',
  },
  flatListPost: {
    width: '90%',
    // height: 200,
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  imagePost: {
    width: '90%',
    height: 120,
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 15,
  },
  userName: {
    fontSize: 18,
    marginLeft: 15,
    fontWeight: '600',
  },
  captionText: {
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  likeCommentButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    marginBottom: 10,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  likeCommentButton: {
    flexDirection: 'row',
  },
  likeCommentButtonText: {
    marginRight: 10,
  },
  loveCommentIcon: {
    width: 24,
    height: 24,
  },
  postNotFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
