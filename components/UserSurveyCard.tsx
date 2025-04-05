import { Survey } from '@/redux/types/surveysTypes';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, View, Image, StyleSheet } from 'react-native';

interface SurveyCardProps {
    survey: Survey;
    onPress: () => void;
}

const UserSurveyCard: React.FC<SurveyCardProps> = ({ survey, onPress }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [loadError, setLoadError] = useState(false);

    const imageUrl = survey?.imageUrl;
    const placeholderImage = require("../assets/images/placeholder.png");

    const [loadingImage, setLoading] = useState(true);

    useEffect(() => {
        if (imageUrl && !loadError) {
            setLoading(true);
            Image.prefetch(imageUrl)
                .then(() => setLoading(false))
                .catch(() => {
                    setLoading(false);
                    setLoadError(true);
                });
        } else {
            setLoading(false);
        }
    }, [imageUrl, loadError]);

    const isImgUrl = survey.imageUrl !== undefined

    const imageSource = !isImgUrl || loadError || loadingImage || (survey?.imageUrl === null) ? placeholderImage : { uri: imageUrl };

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.imageContainer}>
                <Image
                    source={imageSource}
                    style={styles.image}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setLoadError(true)}
                    resizeMode="cover"
                />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{survey.title}</Text>
                <Text style={styles.description}>{survey.description}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        width: "100%",
        aspectRatio: 5 / 2,
        overflow: "hidden",
        marginVertical: 0,
        borderRadius: 0,
    },
    image: {
        width: "100%",
        height: "100%",
    },
    card: {
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#fff",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
        flex: 1,
        margin: 12,
    },
    infoContainer: {
        padding: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    description: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
});

export default UserSurveyCard;