import { useAppDispatch } from "@/hooks/useAppDispatch";
import { getAccount, loadUserFromStorage, logout } from "@/redux/slices/authSlice";
import { store } from "@/redux/store";
import { UserRole } from "@/redux/types/authTypes";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, View } from "react-native";

export default function Index() {

    const dispatch = useAppDispatch();

    const router = useRouter();

    const { wishPath } = useLocalSearchParams();

    useEffect(() => {
        const loadAndCheckUser = async () => {
            let authState = store.getState().auth;
            if (authState.token == null) {
                const resultAction = await dispatch(loadUserFromStorage());
                authState = store.getState().auth;
            }

            if (authState.token !== null) {
                if (authState.user == null) {
                    let result = await dispatch(getAccount());
                    authState = store.getState().auth;
                }
                if (authState.user == null) {
                    dispatch(logout());
                    router.push('/auth/login');
                    return;
                }
                if (wishPath) {
                    if ((wishPath as string).startsWith("creator") && authState.user?.role == UserRole.CREATOR) {
                        router.push(`/${wishPath}` as any);
                        return;
                    }
                    if ((wishPath as string).startsWith("user") && authState.user?.role == UserRole.USER) {
                        router.push(`/${wishPath}` as any);
                        return;
                    }
                }

                if (authState.user?.role == UserRole.CREATOR) {
                    router.push('/creator');
                } else if (authState.user?.role == UserRole.USER) {
                    router.push('/user');
                }
            } else {
                router.push('/auth/login');
            }
        };

        loadAndCheckUser();
    }, [dispatch]);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgb(72, 119, 238)",
            }}
        >
            <Image
                source={require("../assets/images/survey-icon-large.png")}
                style={{
                    width: 350,
                    height: 150,
                    resizeMode: "contain",
                }}
            />
        </View>
    );
}
