import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Login from './screen/components/Login';
import Reg from './screen/components/Reg';
import NavigationScreen from './screen/tabScreens/NavigationScreen';
import Comment from './screen/externalScreens/Comment';

// Create a Reference of the Stack which will display in the screen stack wise
const Stack = createStackNavigator();

// This is the Class Which extends the React Components
// and Render function is the Compulsary in the React.Components class
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Reg" component={Reg} />
        <Stack.Screen name="NavigationScreen" component={NavigationScreen} />
        <Stack.Screen name="Comment" component={Comment} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
