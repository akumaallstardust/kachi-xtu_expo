import { StatusBar } from 'expo-status-bar';
import React, {useRef, useState,useEffect} from 'react';
import {
  Dimensions,
  Text,
  View,
  Button,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';

import Index from "./contents/index"
import {Search_page,View_history_page,My_post_page,Uni_post_page} from "./contents/display_post_pages"
import {My_page,User_page,Option_page} from "./contents/my_page_user_page"
import Post_page from "./contents/post"
import {Login_page,Signup_page,True_signup_page} from "./contents/login_signup"
import {Change_password_page, Change_user_info_page} from "./contents/change_user_info"
import {Report_page,Contact_page} from "./contents/report"
import Notification_page from "./contents/notification"
import {License_page} from "./contents/other"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as ScreenOrientation from 'expo-screen-orientation';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator screenOptions={{headerShown: false,orientation: 'portrait'}} >
        <Stack.Screen name="Index" component={Index} />
        <Stack.Screen name="Search_page" component={Search_page} />
        <Stack.Screen name="Uni_post_page" component={Uni_post_page} />
        <Stack.Screen name="Post_page" component={Post_page} />
        <Stack.Screen name="Login_page" component={Login_page} />
        <Stack.Screen name="True_signup_page" component={True_signup_page} />
        <Stack.Screen name="Signup_page" component={Signup_page} />
        <Stack.Screen name="Option_page" component={Option_page} />
        <Stack.Screen name="My_page" component={My_page} />
        <Stack.Screen name="User_page" component={User_page} />
        <Stack.Screen name="View_history_page" component={View_history_page} />
        <Stack.Screen name="My_post_page" component={My_post_page} />
        <Stack.Screen name="Change_user_info_page" component={Change_user_info_page} />
        <Stack.Screen name="Change_password_page" component={Change_password_page} />
        <Stack.Screen name="Notification_page" component={Notification_page} />
        <Stack.Screen name="Report_page" component={Report_page}/>
        <Stack.Screen name="Contact_page" component={Contact_page}/>
        <Stack.Screen name="License_page" component={License_page}/>
    </Stack.Navigator>
</NavigationContainer>
  );
}

