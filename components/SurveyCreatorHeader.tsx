import { useRouter } from 'expo-router';
import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';

const SurveyCreatorHeader = () => {
    const router = useRouter();

    const handleHomePress = () => {
        router.push('/creator');
    };

    const handleLogoutPress = () => {
        router.push('/auth/login');
    };

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={handleHomePress}>
                <Image
                    source={require('../assets/images/survey-icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </TouchableOpacity>

            <View style={styles.iconsContainer}>
                <TouchableOpacity onPress={handleHomePress}>
                    <Image
                        source={require('../assets/images/home.png')}
                        style={styles.icon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleLogoutPress}>
                    <Image
                        source={require('../assets/images/logout.png')}
                        style={styles.icon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: "2%",
        backgroundColor: '#3579F6',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    logo: {
        width: 120,
        height: 40,
        marginVertical: 10,
    },
    iconsContainer: {
        flexDirection: 'row',
        gap: 30,
    },
    icon: {
        width: 30,
        height: 30,
    },
});

export default SurveyCreatorHeader;