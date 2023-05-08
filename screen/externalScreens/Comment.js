import {StyleSheet, Text, TextInput, View, FlatList, Image} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

let userId = '';
let comments = [];
let postId = '';
let name = '';
let profile = '';
const Comment = () => {
  const route = useRoute();
  const [comment, setComment] = useState('');
  const inputRef = useRef();
  const [commentsList, setcommentList] = useState([]);

  useEffect(() => {
    getUserId();
    comments = route.params.comments;
    console.log(comments);
    setcommentList(comments);
    postId = route.params.postId;
  }, []);

  const getUserId = async () => {
    userId = await AsyncStorage.getItem('USERID');
    name = await AsyncStorage.getItem('NAME');
    profile = await AsyncStorage.getItem('PROFILE_PIC');
  };
  const postComment = () => {
    let tempComments = comments;
    tempComments.push({
      userId: userId,
      comment: comment,
      postId: postId,
      name: name,
      profile: profile,
    });
    firestore()
      .collection('Posts')
      .doc(postId)
      .update({
        comments: tempComments,
      })
      .then(() => {
        console.log('Post updated');
        getNewComment();
      })
      .catch(error => {
        console.log(error);
      });
    inputRef.current.clear();
  };

  const getNewComment = () => {
    firestore
      .collection('Posts')
      .doc(postId)
      .get()
      .then(documentSnapshot => {
        setcommentList(documentSnapshot.data().comments);
      });
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Comments</Text>
      </View>
      <FlatList
        data={commentsList}
        renderItem={({item, index}) => {
          return (
            <View style={styles.commentListContainer}>
              {item.profile === '' ? (
                <Image
                  source={require('../../asset/user.png')}
                  style={styles.commentUserProfile}
                />
              ) : (
                <Image
                  source={{uri: item.profile}}
                  style={styles.commentUserProfile}
                />
              )}

              <View>
                <Text style={styles.commentName}>{item.name}</Text>
                <Text style={styles.commentText}>{item.comment}</Text>
              </View>
            </View>
          );
        }}
      />
      <View style={styles.writeCommentContainer}>
        <TextInput
          ref={inputRef}
          value={comment}
          onChangeText={txt => {
            setComment(txt);
          }}
          placeholder="type comment here..."
          style={styles.commentTextInput}
        />
        <Text
          style={styles.sendText}
          onPress={() => {
            postComment();
          }}>
          Send
        </Text>
      </View>
    </View>
  );
};

export default Comment;

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

  writeCommentContainer: {
    width: '100%',
    height: 60,
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  commentTextInput: {
    width: '80%',
    marginLeft: 20,
    fontWeight: '600',
  },

  sendText: {
    marginRight: 10,
    fontSize: 18,
    fontWeight: '600',
  },

  commentListContainer: {
    width: '100%',
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
  },

  commentUserProfile: {
    width: 40,
    height: 40,
    marginLeft: 10,
    marginTop: 10,
    marginRight: 15,
    borderRadius: 20,
  },

  commentName: {
    fontSize: 18,
    fontWeight: '600',
  },

  commentText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: '600',
  },
});
