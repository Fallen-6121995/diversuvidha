// Import React and Component
import React, {useState, createRef, useEffect} from 'react';
import {
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  Alert,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import APIKit, {setClientToken} from '../../../shared/APIKit';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Loader from '../../../component/Loader';

const Login = ({navigation}) => {
  const [mobile, setUserPhone] = useState('');
  const [password, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const {width, height} = Dimensions.get('screen');
  const [passwordEye, setPasswordEye] = useState(true);
  const passwordInputRef = createRef();
  const handlePhoneChange = mobile => {
    setUserPhone(mobile);
  };
  const handlePasswordChange = password => {
    setUserPassword(password);
  };
  const handleSubmitPress = () => {
    setErrortext('');
    if (!mobile) {
      alert('Please fill Email');
      return;
    }
    if (!password) {
      alert('Please fill Password');
      return;
    }
    setLoading(true);

    const payload = {mobile, password};
    console.log(payload);

    const onSuccess = ({data}) => {
      // Set JSON Web Token on success
      setLoading(false);

      console.log(data);
      if (data.status == true) {
        storeUser(data.data);
        setTimeout(() => {
          // Alert.alert('Oops!', error.message);
          // Alert.alert('Success!', data.message);
        }, 100);
        setUserPhone('');
        setUserPassword('');
        navigation.navigate('BottomTab');
      } else {
        setTimeout(() => {
          // Alert.alert('Oops!', error.message);
          Alert.alert('Alert!', data.message);
        }, 100);
      }
    };

    const onFailure = error => {
      //console.log("!!!!----message",error.data.message);
      setLoading(false);
      console.log('!!!!----Error', error);
      console.log('!!!!----Error Response', error.response);
      console.log('!!!!----error.response.data', error.response.data);
      console.log('!!!!----error.response.status', error.response.status);
      console.log('!!!!----headers', error.response.headers);
      setTimeout(() => {
        // Alert.alert('Oops!', error.message);
        Alert.alert('Oops!', 'User id or password incorrect');
      }, 100);
    };

    // Show spinner when call is made
    //this.setState({isLoading: true});

    APIKit.post('/Auth/login', payload).then(onSuccess).catch(onFailure);
  };
  const storeUser = async user => {
    console.log('!!!!User', user);

    AsyncStorage.setItem('userData', JSON.stringify(user), err => {
      if (err) {
        console.log('an error');
        throw err;
      }
      console.log('success');
    }).catch(err => {
      console.log('error is: ' + err);
    });
  };

  useEffect(() => {}, []);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.mainBody}>
        <Loader loading={loading} />

        <View
          style={{width: '100%', height: height / 4, backgroundColor: 'black'}}>
          <ImageBackground
            source={require('../../../../Image/login-bg.png')}
            resizeMode="cover"
            style={styles.TopImage}>
            <Image
              source={require('../../../../Image/logo.png')}
              style={styles.Logo}
            />
          </ImageBackground>
        </View>
        <View style={styles.ContentView}>
          <ScrollView
            // keyboardShouldPersistTaps="handled"
            contentContainerStyle={
              {
                // flex: 1,
                //justifyContent: 'center',
                //alignContent: 'center',
              }
            }>
            <View>
              <Text
                style={{
                  color: 'rgba(219, 35, 36, 1.0)',
                  fontWeight: 'bold',
                  fontSize: 18,
                  padding: 20,
                }}>
                Login
              </Text>
              <View style={styles.SectionStyle}>
                <TextInput
                  mode="outlined"
                  label="Phone number"
                  value={mobile}
                  placeholder="Enter phone number"
                  theme={{
                    colors: {primary: 'red', underlineColor: 'transparent'},
                  }}
                  maxLength={10}
                  keyboardType="numeric"
                  onChangeText={handlePhoneChange}

                  //right={<TextInput.Affix text="/100" />}
                />
              </View>
              <View style={styles.SectionStyle}>
                <TextInput
                  mode="outlined"
                  label="Password"
                  value={password}
                  placeholder="Enter password"
                  theme={{colors: {primary: 'red', underlineColor: 'red'}}}
                  onChangeText={handlePasswordChange}
                  secureTextEntry={passwordEye}
                  right={
                    passwordEye ? (
                      <TextInput.Icon
                        name="eye"
                        onPress={() => setPasswordEye(!passwordEye)}
                      />
                    ) : (
                      <TextInput.Icon
                        name="eye"
                        onPress={() => setPasswordEye(!passwordEye)}
                      />
                    )
                  }
                />
              </View>
              {errortext != '' ? (
                <Text style={styles.errorTextStyle}>{errortext}</Text>
              ) : null}
              <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={handleSubmitPress}
                // onPress={() => navigation.navigate('RootTabBar')}
              >
                <Text style={styles.buttonTextStyle}>SIGN IN</Text>
              </TouchableOpacity>
              <View style={{flexDirection: 'row'}}>
                <View>
                  <View style={styles.bottomContent}>
                    <Text style={styles.registerTextStyle}>
                      Don't have account ?
                    </Text>
                    <Text
                      style={{textDecorationLine: 'underline', color: 'black'}}
                      onPress={() => navigation.navigate('Register')}>
                      {' '}
                      Register
                    </Text>
                  </View>
                </View>
                <View>
                  <Text
                    style={styles.registerTextStyle}
                    onPress={() => navigation.navigate('ForgotPassword')}>
                    Forgot password?
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainBody: {
    // justifyContent: 'center', //Centered horizontally
    alignItems: 'center', //Centered vertically
    flex: 2,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignContent: 'space-between',
  },
  TopImage: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'space-between',
  },
  Logo: {
    width: '50%',
    height: '30%',
    resizeMode: 'contain',
    justifyContent: 'flex-start',
    position: 'absolute',
    right: 1,
    top: 20,
    //backgroundColor: '#FFFFFF'
  },
  ContentView: {
    width: '90%',
    height: '50%',
    backgroundColor: 'white',
    marginTop: -40,
    borderRadius: 15,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.5,
  },
  SectionStyle: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  buttonStyle: {
    backgroundColor: 'rgba(219, 35, 36, 1.0)',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 44,
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
  },
  registerTextStyle: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 'normal',
    fontSize: 12,
    alignSelf: 'center',
    // textDecorationLine:'underline'
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 12,
  },
  bottomContent: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    //backgroundColor:'red',
    marginLeft: 20,
    marginRight: 20,
  },
});
