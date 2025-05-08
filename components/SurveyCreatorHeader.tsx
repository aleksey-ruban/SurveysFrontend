import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { loadUserFromStorage, logoutUser } from '@/redux/slices/authSlice';
import { RootState } from '@/redux/store';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';

const SurveyCreatorHeader = () => {
    const router = useRouter();
    
    const dispatch = useAppDispatch();

    const handleHomePress = () => {
        router.push('/creator');
    };

    useEffect(() => {
        dispatch(loadUserFromStorage());
    }, [dispatch]);

    const handleLogoutPress = async () => {
        try {
            let result = await dispatch(logoutUser());
            if (logoutUser.fulfilled.match(result)) {
                router.push('/auth/login');
            }
        } catch (error) {
            console.error("Ошибка выхода:", error);
        }
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
