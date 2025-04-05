import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ScrollView, useWindowDimensions } from 'react-native';
import { fetchSurveys } from '@/redux/slices/surveySlice';
import { useRouter } from 'expo-router';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { styles } from '@/components/styles/user-index';
import { clearFetchSurveysError } from '@/redux/slices/errorSlice';
import UserSurveyFilter, { FilterParams } from '@/components/UserSurveyFilter';
import UserSurveyCard from '@/components/UserSurveyCard';

const UserDashboard = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const name = useAppSelector((state) => state.auth.user?.name);
    const surveys = useAppSelector((state) => state.survey.surveys);
    const loading = useAppSelector((state) => state.survey.loading);
    const fetchSurveysError = useAppSelector((state) => state.error.fetchSurveysError);

    const [filters, setFilters] = useState({
        searchQuery: '',
        sortOrder: 'asc',
    });

    useEffect(() => {
        dispatch(fetchSurveys({ search: filters.searchQuery, sort: filters.sortOrder }));
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
        setFilters(newFilters);
        dispatch(fetchSurveys({ status: "open", search: newFilters.searchQuery, sort: newFilters.sortOrder }));
    };

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
                            <UserSurveyCard survey={item} onPress={() => router.push(`/user/survey/${item.id}`)}/>
                        )}
                    />
                )
            }
        </ScrollView >
    );
};

export default UserDashboard;