import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { fetchSurveys } from '@/redux/slices/surveySlice';
import { useRouter } from 'expo-router';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { styles } from '@/components/styles/creator-index';
import { clearFetchSurveysError } from '@/redux/slices/errorSlice';
import CreatorSurveyCard from '@/components/CreatorSurveyCard';
import OwnerSurveyFilter, { FilterParams } from '@/components/OwnerSurveyFilter';
import { loadUserFromStorage } from '@/redux/slices/authSlice';
import { store } from '@/redux/store';
import { UserRole } from '@/redux/types/authTypes';

const CreatorDashboard = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const name = useAppSelector((state) => state.auth.user?.name);
    const surveys = useAppSelector((state) => state.survey.surveys);
    const loading = useAppSelector((state) => state.survey.loading);
    const fetchSurveysError = useAppSelector((state) => state.error.fetchSurveysError);

    let prevFilterParameters = useRef<FilterParams | null>({
        statusFilter: 'all',
        searchQuery: '',
        sortOrder: 'asc',
    });

    const [filters, setFilters] = useState({
        statusFilter: 'all',
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
                        dispatch(fetchSurveys({ status: filters.statusFilter, search: filters.searchQuery, sort: filters.sortOrder }));
                        return;
                    } else if (authState.user.role == UserRole.USER) {
                        router.push('/user');
                    }
                } else {
                    router.push({
                        pathname: '/',
                        params: { wishPath: 'creator' },
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

    const handleCreateSurvey = () => {
        router.push('/creator/create');
    };

    const handleFilterChange = (newFilters: FilterParams) => {
        if (prevFilterParameters.current?.statusFilter == newFilters.statusFilter &&
            prevFilterParameters.current?.searchQuery == newFilters.searchQuery &&
            prevFilterParameters.current?.sortOrder == newFilters.sortOrder
        ) {
            return;
        }
        console.log(1);
        console.log(newFilters);
        setFilters(newFilters);
        prevFilterParameters.current = newFilters;
    };

    useEffect(() => {
        if (prevFilterParameters.current != null) {
            dispatch(fetchSurveys({
                status: prevFilterParameters.current.statusFilter,
                search: prevFilterParameters.current.searchQuery,
                sort: prevFilterParameters.current.sortOrder 
            }));
        }
    }, [prevFilterParameters.current]);

    return (
        <ScrollView style={styles.container}>

            <Text style={styles.emailText}>С возвращением, {name}!</Text>

            <View style={styles.viewContainer}>
                <Text style={styles.surveysTitle}>Ваши опросы:</Text>
                <TouchableOpacity onPress={handleCreateSurvey} style={styles.createButtonContainer}>
                    <Text style={styles.createButtonText}>Создать новый опрос</Text>
                    <Image
                        source={require('../../assets/images/add.png')}
                        style={styles.createButtonIcon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>

            <OwnerSurveyFilter onFilterChange={handleFilterChange} />

            {
                loading ? (
                    <Text style={styles.loadingText}>Загрузка...</Text>
                ) : (fetchSurveysError !== null) ? (
                    <Text style={styles.errorText}>{fetchSurveysError}</Text>
                ) : surveys.length === 0 ? (
                    <Text style={styles.emptyText}>У вас пока нет созданных опросов</Text>
                ) : (
                    <FlatList
                        style={styles.flatList}
                        contentContainerStyle={styles.flatListContent}
                        data={surveys}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <CreatorSurveyCard survey={item} onPress={() => router.push(`/creator/survey/${item.id}`)} />
                        )}
                    />
                )
            }
        </ScrollView >
    );
};

export default CreatorDashboard;