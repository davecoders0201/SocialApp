import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';

const Reg = ({navigation}) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [newpassword, setnewPassword] = useState('');
  const [reenterpassword, setreEnterPassword] = useState('');
  const [checkValidEmail, setCheckValidEmail] = useState(false);
  const [seePassword, setSeePassword] = useState(true);
  const [seerePassword, setSeerePassword] = useState(true);
  const nameRemove = useRef(null);
  const surnameRemove = useRef(null);
  const emailRemove = useRef(null);
  const newPasswordRemove = useRef(null);
  const reEnteredPasswordRemove = useRef(null);

  //This is the function in which the Validation is done User is Added By Provding the details.
  const handleRegister = async () => {
    //It check the details if anyone is blank then it diplay the alert
    if (!name || !surname || !email || !newpassword || !reenterpassword) {
      alert('Please fill in all fields.');
      return;
    }

    //It check the entered password and reentered password is match or not
    if (newpassword !== reenterpassword) {
      alert('Passwords do not match.');
      return;
    }

    //It check the entered password contains Whitespace or not
    const isNonWhiteSpace = /^\S*$/;
    if (!isNonWhiteSpace.test(newpassword)) {
      alert('Password must not contain Whitespaces.');
      return;
    }

    //It checks the entered password contains the uppercase or not
    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    if (!isContainsUppercase.test(newpassword)) {
      alert('Password must have at least one Uppercase Character.');
      return;
    }

    //It checks the entered password contains the Lowercase or not
    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    if (!isContainsLowercase.test(newpassword)) {
      alert('Password must have at least one Lowercase Character.');
      return;
    }

    //It checks the entered password contains the Number or not
    const isContainsNumber = /^(?=.*[0-9]).*$/;
    if (!isContainsNumber.test(newpassword)) {
      alert('Password must contain at least one Digit.');
      return;
    }

    //It checks the entered password contains proper lenght
    const isValidLength = /^.{8,16}$/;
    if (!isValidLength.test(newpassword)) {
      alert('Password must be 8-16 Characters Long.');
      return;
    }

    //It checks the entered password contains the symbol or not
    const isContainsSymbol =
      /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
    if (!isContainsSymbol.test(newpassword)) {
      alert('Password must contain at least one Special Symbol.');
      return;
    }

    try {
      //createUserWithEmailAndPassword is use to create a User in the Firebase app
      const isUserCreated = await auth().createUserWithEmailAndPassword(
        email,
        newpassword,
      );
      console.log(isUserCreated);

      //It clears the inputValues after clicking the button
      nameRemove.current.clear();
      surnameRemove.current.clear();
      emailRemove.current.clear();
      newPasswordRemove.current.clear();
      reEnteredPasswordRemove.current.clear();
      alert('SuccessFully Registered');
    } catch (error) {
      alert(error);
    }
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
        source={require('../../asset/Logo.png')}
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
          secureTextEntry={seePassword}
          onChangeText={text => setnewPassword(text)}
          ref={newPasswordRemove}
        />

        {/* ---------------------------This is the Icon Button--------------------------------- */}

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

      {/* ---------------------------This is the ReEnter Password Input--------------------------------- */}

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Re Enter Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={seerePassword}
          onChangeText={reenterpassword => setreEnterPassword(reenterpassword)}
          ref={reEnteredPasswordRemove}
        />

        {/* ---------------------------This is the Icon Button--------------------------------- */}
        <TouchableOpacity
          style={styles.wrapperIcon}
          onPress={() => setSeerePassword(!seerePassword)}>
          <Image
            source={
              seerePassword
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
      !newpassword ||
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
    // marginTop: -100,
    marginBottom: 30,
    height: 300,
    width: 300,
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
