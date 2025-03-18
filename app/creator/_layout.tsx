import { Stack } from 'expo-router';
import SurveyCreatorHeader from '@/components/SurveyCreatorHeader';

export default function AuthLayout() {
    return (
        <>
            <SurveyCreatorHeader />
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
        </>
    );
}