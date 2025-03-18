import { Stack } from 'expo-router';
import SurveyHeader from '../../components/SurveyHeader';

export default function AuthLayout() {
    return (
        <>
            <SurveyHeader />
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
        </>
    );
}