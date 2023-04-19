import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, Image, StyleSheet, BlurView} from 'react-native';
import Home from '../screen/Screens/Home';
import Account from './../screen/Screens/Account';
const TabNavigation = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: 'white',
        tabBarActiveBackgroundColor: 'lightgrey',
        tabBarLabelStyle: {fontWeight: 'bold', color: 'black'},
      }}
      initialRouteName="login">
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({color, size}) => (
            <Image source={require('../asset/home.png')} style={styles.Icon} />
          ),
        }}
      />
      <Tab.Screen
        name="test"
        component={Account}
        // options={{
        //   tabBarIcon: ({color, size}) => (
        //     <Image
        //       source={require('../asset/branch.png')}
        //       style={styles.Icon}
        //     />
        //   ),
        // }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;

const styles = StyleSheet.create({
  Icon: {
    width: 32,
    height: 30,
  },
});
