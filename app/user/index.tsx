import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, ScrollView, useWindowDimensions } from 'react-native';
import { fetchSurveys } from '@/redux/slices/surveySlice';
import { useRouter } from 'expo-router';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { styles } from '@/components/styles/user-index';
import { clearFetchSurveysError } from '@/redux/slices/errorSlice';
import UserSurveyFilter, { FilterParams } from '@/components/UserSurveyFilter';
import UserSurveyCard from '@/components/UserSurveyCard';
import { loadUserFromStorage } from '@/redux/slices/authSlice';
import { store } from '@/redux/store';
import { UserRole } from '@/redux/types/authTypes';

const UserDashboard = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const name = useAppSelector((state) => state.auth.user?.name);
    const surveys = useAppSelector((state) => state.survey.surveys);
    const loading = useAppSelector((state) => state.survey.loading);
    const fetchSurveysError = useAppSelector((state) => state.error.fetchSurveysError);

    let prevFilterParameters = useRef<FilterParams | null>({
        searchQuery: '',
        sortOrder: 'asc',
    });

    const [filters, setFilters] = useState({
        searchQuery: '',
        sortOrder: 'asc',
    });

    useEffect(() => {
        const loadAndCheckUser = async () => {
            let authState = store.getState().auth;
            if (authState.token == null) {
                const resultAction = await dispatch(loadUserFromStorage());
                authState = store.getState().auth;
            }

            if (authState.token !== null) {
                if (authState.user !== null) {
                    if (authState.user.role == UserRole.CREATOR) {
                        router.push('/creator');
                    } else if (authState.user.role == UserRole.USER) {
                        dispatch(fetchSurveys({ status: "open", search: filters.searchQuery, sort: filters.sortOrder }));
                        return;
                    }
                } else {
                    router.push({
                        pathname: '/',
                        params: { wishPath: 'user' },
                    });
                }
            } else {
                router.push('/auth/login');
            }
        };

        loadAndCheckUser();
    }, [dispatch]);

    useEffect(() => {
        dispatch(clearFetchSurveysError());
        return () => {
            dispatch(clearFetchSurveysError());
        };
    }, [dispatch]);

    const { width } = useWindowDimensions();
    const [numColumns, setNumColumns] = useState(width < 600 ? 1 : 2);

    useEffect(() => {
        setNumColumns(width < 1000 ? 1 : 2);
    }, [width]);

    const handleFilterChange = (newFilters: FilterParams) => {
        if (prevFilterParameters.current?.searchQuery == newFilters.searchQuery &&
            prevFilterParameters.current?.sortOrder == newFilters.sortOrder
        ) {
            return;
        }
        setFilters(newFilters);
        prevFilterParameters.current = newFilters;
    };

    useEffect(() => {
        if (prevFilterParameters.current != null) {
            dispatch(fetchSurveys({
                status: "open",
                search: prevFilterParameters.current.searchQuery,
                sort: prevFilterParameters.current.sortOrder 
            }));
        }
        }, [prevFilterParameters.current]);

    return (
        <ScrollView style={styles.container}>

            <Text style={styles.emailText}>С возвращением, {name}!</Text>

            <View style={styles.viewContainer}>
                <Text style={styles.surveysTitle}>Проходите новые опросы:</Text>
            </View>

            <UserSurveyFilter onFilterChange={handleFilterChange} />

            {
                loading ? (
                    <Text style={styles.loadingText}>Загрузка...</Text>
                ) : (fetchSurveysError !== null) ? (
                    <Text style={styles.errorText}>{fetchSurveysError}</Text>
                ) : surveys.length === 0 ? (
                    <Text style={styles.emptyText}>Пока нет опросов для прохождения</Text>
                ) : (
                    <FlatList
                        style={styles.flatList}
                        contentContainerStyle={styles.flatListContent}
                        data={surveys}
                        key={numColumns}
                        numColumns={numColumns}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <UserSurveyCard survey={item} onPress={() => router.push(`/user/survey/${item.id}`)} />
                        )}
                    />
                )
            }
        </ScrollView >
    );
};

export default UserDashboard;