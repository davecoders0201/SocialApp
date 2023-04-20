import {FlatList, StyleSheet, Text, View, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';

const Home = () => {
  const [postData, setPostData] = useState([]);
  useEffect(() => {
    getData();
  });
  const getData = () => {
    let tempData = [];
    firestore()
      .collection('Posts')
      .get()
      .then(querySnapshot => {
        console.log('Total Posts: ', querySnapshot.size);

        querySnapshot.forEach(documentSnapshot => {
          tempData.push(documentSnapshot.data());
          console.log(
            'User ID: ',
            documentSnapshot.id,
            documentSnapshot.data(),
          );
        });
        setPostData(tempData);
      });
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
              <View style={styles.flatListPost}>
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
  postNotFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
