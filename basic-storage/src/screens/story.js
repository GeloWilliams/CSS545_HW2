import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text, Button, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'cachedImages';

const StoryPage = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadImages();
    }, []);

    const loadImages = async () => {
        setLoading(true);
        /*
            try to load cached images if any, otherwise fetch them
        */
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

    /* fetchAndCacheImages
        - Use FileSystem to create a directory structure where cached images can be
        stored (currently in the 'cacheDirectory' location)
        - Use AsyncStorage to get & set storage keys acting as a manager that maps the
        remote image addresses to their cached locations locally */
    const fetchAndCacheImages = async () => {
        try {
            // use created API from website to test response
            const response = await axios.get('https://www.gelostory.com/dd-images.php?endpoint=banners');
            const newImages = await Promise.all(response.data.map(async (img) => {
                const fileUri = `${FileSystem.cacheDirectory}${img.title}.jpg`;
                await FileSystem.downloadAsync(img.url, fileUri);
                return { uri: fileUri, title: img.title };
            }));
            setImages(newImages);
            // Cache the new image paths in AsyncStorage
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newImages));
        } catch (err) {
            setError('Error fetching images');
            console.error('Error fetching images:', err);
        }
    };

    const { width } = Dimensions.get('window');

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>{error}</Text>
                <Button title="Retry" onPress={loadImages} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView horizontal pagingEnabled>
                {images.map((item, index) => (
                    <View key={index} style={styles.carouselItem}>
                        <Image source={{ uri: item.uri }} style={styles.image} />
                        <Text style={styles.title}>{item.title}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    carouselItem: { width: Dimensions.get('window').width, alignItems: 'center' },
    image: { width: '100%', height: 400, resizeMode: 'contain' },
    title: { marginTop: 10, fontSize: 18 },
});

export default StoryPage;
