import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
// import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
let token = '';

const Reg = ({navigation}) => {
  useEffect(() => {
    getFcmToken();
  }, []);
  const getFcmToken = async () => {
    token = await messaging().getToken();
    console.log(token);
  };

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reenterpassword, setreEnterPassword] = useState('');
  const [checkValidEmail, setCheckValidEmail] = useState(false);
  const [seepassword, setSeePassword] = useState(true);
  const [seerepassword, setSeerePassword] = useState(true);
  const nameRemove = useRef(null);
  const surnameRemove = useRef(null);
  const emailRemove = useRef(null);
  const passwordRemove = useRef(null);
  const reEnteredPasswordRemove = useRef(null);

  //This is the function in which the Validation is done User is Added By Provding the details.
  const handleRegister = async () => {
    //It check the details if anyone is blank then it diplay the alert
    if (!name || !surname || !email || !password || !reenterpassword) {
      alert('Please fill in all fields.');
      return;
    }

    //It check the entered password and reentered password is match or not
    if (password !== reenterpassword) {
      alert('passwords do not match.');
      return;
    }

    //It check the entered password contains Whitespace or not
    const isNonWhiteSpace = /^\S*$/;
    if (!isNonWhiteSpace.test(password)) {
      alert('Password must not contain Whitespaces.');
      return;
    }

    //It checks the entered password contains the uppercase or not
    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    if (!isContainsUppercase.test(password)) {
      alert('Password must have at least one Uppercase Character.');
      return;
    }

    //It checks the entered password contains the Lowercase or not
    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    if (!isContainsLowercase.test(password)) {
      alert('Password must have at least one Lowercase Character.');
      return;
    }

    //It checks the entered password contains the Number or not
    const isContainsNumber = /^(?=.*[0-9]).*$/;
    if (!isContainsNumber.test(password)) {
      alert('Password must contain at least one Digit.');
      return;
    }

    //It checks the entered password contains proper lenght
    const isValidLength = /^.{8,16}$/;
    if (!isValidLength.test(password)) {
      alert('Password must be 8-16 Characters Long.');
      return;
    }

    //It checks the entered password contains the symbol or not
    const isContainsSymbol =
      /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
    if (!isContainsSymbol.test(password)) {
      alert('Password must contain at least one Special Symbol.');
      return;
    }

    // try {
    //   //createUserWithEmailAndPassword is use to create a User in the Firebase app
    //   const isUserCreated = await auth().createUserWithEmailAndPassword(
    //     email,
    //     password,
    //   );
    //   console.log(isUserCreated);

    //It clears the inputValues after clicking the button
    // nameRemove.current.clear();
    // surnameRemove.current.clear();
    // emailRemove.current.clear();
    // PasswordRemove.current.clear();
    // reEnteredPasswordRemove.current.clear();
    // alert('SuccessFully Registered');
    // } catch (error) {
    //   alert(error);
    // }

    // This is the user adding code in the database called the firestore
    firestore()
      .collection('Users')
      .add({
        name: name,
        surname: surname,
        email: email,
        password: password,
        reenterpassword: reenterpassword,
        token: token,
        userId: uuid.v4(),
      })
      .then(() => {
        console.log('User Added');
        nameRemove.current.clear();
        surnameRemove.current.clear();
        emailRemove.current.clear();
        passwordRemove.current.clear();
        reEnteredPasswordRemove.current.clear();
        saveLocalData();
        alert('SuccessFully Registered');
      })
      .catch(error => {
        console.log(error);
      });
  };

  const saveLocalData = async () => {
    await AsyncStorage.setItem('NAME', name);
    await AsyncStorage.setItem('EMAIL', email);
  };

  //It is the Function of the Validate Email which validate the Email
  const validateEmail = text => {
    let re = /\S+@\S+\.\S+/;
    let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    setEmail(text);
    if (re.test(text) || regex.test(text)) {
      setCheckValidEmail(false);
    } else {
      setCheckValidEmail(true);
    }
  };

  //It is the main Return in the function
  return (
    //------------This is the Main View in the File which contaion whole Registration Page---------------
    <View style={styles.container}>
      {/* ---------------This is the Image Tag which is use for the Image-------------------- */}
      <Image
        source={require('../../asset/Logo1.png')}
        style={styles.image}></Image>

      {/* ---------------------------This is the Name Input--------------------------------- */}
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Name"
          placeholderTextColor="#003f5c"
          onChangeText={name => setName(name)}
          ref={nameRemove}
        />
      </View>

      {/* ---------------------------This is the Surname Input--------------------------------- */}

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Surname"
          placeholderTextColor="#003f5c"
          onChangeText={surname => setSurname(surname)}
          ref={surnameRemove}
        />
      </View>

      {/* ---------------------------This is the Email Input--------------------------------- */}

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email."
          placeholderTextColor="#003f5c"
          onChangeText={text => validateEmail(text)}
          onChange={validateEmail}
          ref={emailRemove}
        />
      </View>

      {/* ---------------------------This is use to check the Email--------------------------------- */}

      {checkValidEmail ? (
        <Text style={styles.textFailed}>Wrong format email</Text>
      ) : (
        <Text style={styles.blockText}> </Text>
      )}

      {/* ---------------------------This is the Password Input--------------------------------- */}

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Enter New Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={seepassword}
          onChangeText={text => setPassword(text)}
          ref={passwordRemove}
        />

        {/* ---------------------------This is the Icon Button--------------------------------- */}

        <TouchableOpacity
          style={styles.wrapperIcon}
          onPress={() => setSeePassword(!seepassword)}>
          <Image
            source={
              seepassword
                ? require('../../asset/Eye.png')
                : require('../../asset/EyeActive.png')
            }
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* ---------------------------This is the ReEnter Password Input--------------------------------- */}

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Re Enter Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={seerepassword}
          onChangeText={reenterpassword => setreEnterPassword(reenterpassword)}
          ref={reEnteredPasswordRemove}
        />

        {/* ---------------------------This is the Icon Button--------------------------------- */}
        <TouchableOpacity
          style={styles.wrapperIcon}
          onPress={() => setSeerePassword(!seerepassword)}>
          <Image
            source={
              seerepassword
                ? require('../../asset/Eye.png')
                : require('../../asset/EyeActive.png')
            }
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* ---------------------------This is the Login Navigation Window--------------------------------- */}

      <Text style={styles.TextStyle}>
        Already Member ?{' '}
        <Text
          style={styles.loginTextStyle}
          onPress={() => navigation.navigate('Login')}>
          Login{' '}
        </Text>
      </Text>

      {/* ---------------------------This is the Validation in the Button for Diable and Enable the Button--------------------------------- */}
      {!name ||
      !surname ||
      !email ||
      !password ||
      !reenterpassword ||
      checkValidEmail == true ? (
        <TouchableOpacity
          // onPress={() => navigation.navigate('Login')}
          disabled
          style={styles.disableRegisterBtn}
          onPress={handleRegister}>
          <Text style={{fontSize: 18}}>Register</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          // onPress={() => navigation.navigate('Login')}
          style={styles.registerBtn}
          onPress={handleRegister}>
          <Text style={{fontSize: 18}}>Register</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Reg;

//----------------This is the Style Like the CSS in the React-native-------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    marginTop: -200,
    // marginBottom: 30,
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
    fontSize: 17,
    fontWeight: 'bold',
    // textAlign: 'center',
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
    marginBottom: 30,
  },
  registerBtn: {
    width: '40%',
    borderRadius: 15,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: '#ff5435',
    fontSize: 200,
  },
  disableRegisterBtn: {
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
  textFailed: {
    alignSelf: 'center',
    color: 'red',
    fontSize: 16,
    marginBottom: 16,
    marginTop: -12,
  },
  blockText: {
    marginTop: -20,
  },
  loginTextStyle: {
    color: '#ff5435',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    alignSelf: 'center',
    padding: 10,
  },
});
