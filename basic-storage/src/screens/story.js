import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text, Button, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

const STORAGE_KEY = 'cachedImages';

const StoryPage = () => {
    const { theme } = useTheme();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadImages();
    }, []);

    const loadImages = async () => {
        setLoading(true);
        try {
            const cachedImages = await AsyncStorage.getItem(STORAGE_KEY);
            if (cachedImages) {
                setImages(JSON.parse(cachedImages));
            } else {
                await fetchAndCacheImages();
            }
        } catch (err) {
            setError('Error loading images');
            console.error('Error loading images:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAndCacheImages = async () => {
        try {
            const response = await axios.get('https://www.gelostory.com/dd-images.php?endpoint=banners');
            const newImages = await Promise.all(response.data.map(async (img) => {
                const fileUri = `${FileSystem.cacheDirectory}${img.title}.jpg`;
                await FileSystem.downloadAsync(img.url, fileUri);
                return { uri: fileUri, title: img.title };
            }));
            setImages(newImages);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newImages));
        } catch (err) {
            setError('Error fetching images');
            console.error('Error fetching images:', err);
        }
    };

    const { width } = Dimensions.get('window');

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
                <ActivityIndicator size="large" color={theme.textColor} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
                <Text style={{ color: theme.textColor }}>{error}</Text>
                <Button title="Retry" onPress={loadImages} color={theme.buttonColor} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            <ScrollView horizontal pagingEnabled>
                {images.map((item, index) => (
                    <View key={index} style={styles.carouselItem}>
                        <Image source={{ uri: item.uri }} style={styles.image} />
                        <Text style={[styles.title, { color: theme.textColor }]}>{item.title}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    carouselItem: { width: Dimensions.get('window').width, alignItems: 'center' },
    image: { width: '100%', height: 400, resizeMode: 'contain' },
    title: { marginTop: 10, fontSize: 18 },
});

export default StoryPage;
