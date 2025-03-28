import { Survey } from '@/redux/types/surveysTypes';
import React from 'react';
import { TouchableOpacity, Text, View, Image, StyleSheet } from 'react-native';

interface SurveyCardProps {
    survey: Survey;
    onPress: () => void;
}

const SurveyCard: React.FC<SurveyCardProps> = ({ survey, onPress }) => {
    const { imageUrl, title, description, isClosed } = survey;

    return (
        <TouchableOpacity style={styles.surveyItem} onPress={onPress}>
            {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.surveyImage} />
            ) : (
                <Image source={require('../assets/images/placeholder.png')} style={styles.surveyImage} />
            )}

            <View style={styles.surveyInfo}>
                <Text style={styles.surveyTitle}>{title}</Text>
                { isClosed ? (
                    <Text style={styles.surveyStatusClosed}>
                        Закрыт
                    </Text>
                ) : (
                    <Text style={styles.surveyStatusOpen}>
                        Открыт
                    </Text>
                )}
                
                <Text style={styles.surveyDescription} numberOfLines={3}>
                    {description || "Нет описания"}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    surveyItem: {
        flexDirection: 'row',
        marginBottom: 22,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    surveyImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 10,
    },
    surveyInfo: {
        flex: 1,
    },
    surveyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    surveyStatusOpen: {
        fontSize: 14,
        color: 'green',
        fontWeight: '700',
        marginBottom: 5,
    },
    surveyStatusClosed: {
        fontSize: 14,
        color: '#888',
        fontWeight: '700',
        marginBottom: 5,
    },
    surveyDescription: {
        fontSize: 14,
        color: '#333',
    },
});

export default SurveyCard;