import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Colors from '@/constants/Colors'
import { Ionicons,FontAwesome6} from '@expo/vector-icons';

const Layout = () => {
  return (
    //tab hesnii ongo todorhoilno
    //index huudasni buyu undsen huudasnii tab hesgiin ner 
    <Tabs screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarStyle: {
            backgroundColor: `#ffffff`,
            borderColor: `#000046`,
            borderWidth : 3,
            borderStyle: 'solid',
            borderTopWidth: 3,
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            position: 'absolute',
            left: 5,
            right: 5,
            bottom: 5,
        },
        }}>
        <Tabs.Screen name = "index" 
        options ={{
            tabBarLabel: `Undsen Tses`,
            tabBarIcon: ({color,size})=>
                <Ionicons name="home" size={24} color="black" />
        }}
    />
        <Tabs.Screen name = "inbox" 
        options ={{
            tabBarLabel: `Hamtdaa`,
            tabBarIcon: ({color,size})=>
                <FontAwesome6 name="people-line" size={24} color="black" />
        }}
    />
        <Tabs.Screen name = "explore" 
        options ={{
            tabBarLabel: `zahialga`,
            tabBarIcon: ({color,size})=>
                <FontAwesome6 name="basket-shopping" size={24} color="black" />
        }}
    />
        <Tabs.Screen name = "profile" 
        options ={{
            tabBarLabel: `minii huudas`,
            tabBarIcon: ({color,size})=>
                <FontAwesome6 name="user" size={24} color="black" />
        }}
    />
   </Tabs>  
  )
}

export default Layout