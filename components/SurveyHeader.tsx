import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const SurveyHeader = () => {
    const router = useRouter();

    const handleImagePress = () => {
        router.push('/');
    };

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={handleImagePress}>
                <Image
                    source={require('../assets/images/survey-icon.png')}
                    style={styles.image}
                    resizeMode="contain"
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#3579F6',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    image: {
        width: 400,
        height: 40,
        marginVertical: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default SurveyHeader;