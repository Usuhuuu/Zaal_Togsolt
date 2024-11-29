import Colors from '@/constants/Colors';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Sections = [
    ];


const ProfileSettings: React.FC = () => {
    return (
        <SafeAreaView style={{flex: 1 , backgroundColor: Colors.primary}}>
            <ScrollView
            contentContainerStyle={styles.container}
            >
                </ScrollView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container : {
        paddingVertical: 24,
    },
    header: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    title:{
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    }
    });


export default ProfileSettings;


