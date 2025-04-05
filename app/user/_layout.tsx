import { Stack } from 'expo-router';
import SurveyUserHeader from '@/components/SurveyUserHeader';

export default function UserLayout() {
    return (
        <>
            <SurveyUserHeader />
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
        </>
    );
}