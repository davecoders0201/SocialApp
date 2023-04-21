import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// This is the Authentication Import from the package
// the Installation command is npm install @react-native-firebase/auth
// import auth from '@react-native-firebase/auth';

import firestore from '@react-native-firebase/firestore';
const AuthContext = React.createContext();
const {width, height} = Dimensions.get('window');

//-------------Main Login Function--------------
const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [seePassword, setSeePassword] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSelected, setSelection] = useState(false);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  useEffect(() => {
    // Retrieve email and password from AsyncStorage
    const retrieveData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('email');
        const storedPassword = await AsyncStorage.getItem('password');
        if (storedEmail !== null && storedPassword !== null) {
          setEmail(storedEmail);
          setPassword(storedPassword);
          setSelection(true);
          console.log(storedEmail, storedPassword);
        }
      } catch (error) {
        console.log(error);
      }
    };
    retrieveData();
  }, []);

  const handleLogin = async () => {
    // Validate inputs
    if (!email.trim()) {
      Alert.alert('Please enter your email');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Please enter your password');
      return;
    }

    // This uses a Simple Authentication in the Firebase
    // try {
    //   // Try to log in the user
    //   const isUserLogin = await auth().signInWithEmailAndPassword(
    //     email,
    //     password,
    //   );

    //   // Save or remove credentials based on "Remember me" checkbox
    //   if (isSelected) {
    //     await AsyncStorage.setItem('email', email);
    //     await AsyncStorage.setItem('password', password);
    //   } else {
    //     await AsyncStorage.removeItem('email');
    //     await AsyncStorage.removeItem('password');
    // emailInputRef.current.clear();
    // passwordInputRef.current.clear();
    //   }

    //   // Navigate to the main screen
    //   setIsAuthenticated(true);
    //   console.log('Succesful');
    //   navigation.navigate('NavigationScreen');
    // } catch (error) {
    //   // Display the actual error message
    //   alert(error.message);

    //   // Clear input fields only if necessary
    //   if (
    //     error.code === 'auth/invalid-email' ||
    //     error.code === 'auth/wrong-password'
    //   ) {
    //     // emailInputRef.current.clear();
    //     // passwordInputRef.current.clear();
    //   }
    // }

    firestore()
      .collection('Users')
      .where('email', '==', email)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.docs.length > 0) {
          if (
            querySnapshot.docs[0]._data.email === email &&
            querySnapshot.docs[0]._data.password === password
          ) {
            Alert.alert('user logged in successfully');
            console.log(querySnapshot.docs);
            console.log(
              querySnapshot.docs[0]._data.email +
                ' ' +
                querySnapshot.docs[0]._data.password,
            );
            goToHome(
              querySnapshot.docs[0]._data.userId,
              querySnapshot.docs[0]._data.name,
              querySnapshot.docs[0]._data.profilePic,
            );
            emailInputRef.current.clear();
            passwordInputRef.current.clear();
          } else {
            Alert.alert('email id or password may wrong');
          }
        } else {
          console.log('Account not found');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const goToHome = async (userId, name, profileurl) => {
    await AsyncStorage.setItem('USERID', userId);
    await AsyncStorage.setItem('NAME', name);
    await AsyncStorage.setItem('PROFILE_PIC', profileurl);
    navigation.navigate('NavigationScreen');
  };
  return (
    <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
      {/* ---------------------Main View----------------- */}
      <View style={styles.container}>
        {/* ---------------------Image Logo----------------- */}
        <Image
          source={require('../../asset/Logo1.png')}
          style={styles.image}></Image>

        {/* ---------------------Email View----------------- */}
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Email."
            placeholderTextColor="#003f5c"
            onChangeText={email => setEmail(email)}
            ref={emailInputRef}
          />
        </View>

        {/* ---------------------Password View----------------- */}
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Password."
            placeholderTextColor="#003f5c"
            secureTextEntry={seePassword}
            onChangeText={password => setPassword(password)}
            ref={passwordInputRef}
          />

          {/* ---------------------Icon Button----------------- */}
          <TouchableOpacity
            style={styles.wrapperIcon}
            onPress={() => setSeePassword(!seePassword)}>
            <Image
              source={
                seePassword
                  ? require('../../asset/Eye.png')
                  : require('../../asset/EyeActive.png')
              }
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>

        {/* ---------------------Button Validation----------------- */}
        {!email || !password ? (
          <TouchableOpacity
            style={styles.disableLoginBtn}
            onPress={handleLogin}
            disabled>
            <Text style={{fontSize: 18}}>Login</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={{fontSize: 18}}>Login</Text>
          </TouchableOpacity>
        )}

        {/* ---------------------Forgot Password Button----------------- */}
        <TouchableOpacity>
          <Text
            style={styles.forgot_button}
            onPress={() => navigation.navigate('NavigationScreen')}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <Text style={styles.TextStyle}>
          New Here ?{' '}
          <Text
            style={styles.registerTextStyle}
            onPress={() => navigation.navigate('Reg')}>
            Register
          </Text>
        </Text>
      </View>
    </AuthContext.Provider>
  );
};

//-------------This is the Important Export Function in the File--------------
export default Login;

//------------This is the StyleSheet we also called the Css of the React-native-----------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height,
    width,
  },
  image: {
    marginTop: -200,
    height: 500,
    width: 500,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputView: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 30,
    width: '70%',
    height: 45,
    marginBottom: 20,
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  wrapperIcon: {
    position: 'absolute',
    right: 0,
    padding: 10,
  },
  icon: {
    width: 32,
    height: 26,
  },
  forgot_button: {
    height: 30,
    marginTop: 20,
    marginBottom: 30,
    fontSize: 17,
    fontWeight: 'bold',
  },
  loginBtn: {
    width: '40%',
    borderRadius: 15,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: '#ff5435',
    fontSize: 200,
    fontWeight: 'bold',
  },
  disableLoginBtn: {
    width: '40%',
    borderRadius: 15,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    fontSize: 200,
    backgroundColor: 'grey',
  },
  TextStyle: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    alignSelf: 'center',
    padding: 10,
  },
  registerTextStyle: {
    color: '#ff5435',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    alignSelf: 'center',
    padding: 10,
  },
});
