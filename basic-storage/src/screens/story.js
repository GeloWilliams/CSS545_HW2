import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text, Button, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import axios from 'axios';

const StoryPage = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://www.gelostory.com/dd-images.php?endpoint=banners', {
            });
            // Check if response.data is an array and has items
            if (Array.isArray(response.data) && response.data.length > 0) {
                setImages(response.data);
            } else {
                setError('No images found');
            }
        } catch (err) {
            console.error('Error fetching images:', err);
            setError('Error fetching images');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

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
                <Button title="Retry" onPress={fetchImages} />
            </View>
        );
    }

    const handleScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.floor(contentOffsetX / width);
        setCurrentIndex(newIndex);
    };

    return (
        <View style={styles.container}>
            <ScrollView 
                horizontal 
                pagingEnabled 
                onScroll={handleScroll} 
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16} // Improves performance
            >
                {images.map((item, index) => (
                    <View key={index} style={styles.carouselItem}>
                        <Image source={{ uri: item.url }} style={styles.image} />
                        <Text style={styles.title}>{item.title}</Text>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.indicatorContainer}>
                {images.map((_, index) => (
                    <View 
                        key={index} 
                        style={[styles.indicator, currentIndex === index && styles.activeIndicator]} 
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    carouselItem: {
        width: Dimensions.get('window').width,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: 400, // Adjust the height as needed
        resizeMode: 'contain',
    },
    title: {
        marginTop: 10,
        fontSize: 18,
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    indicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ccc',
        margin: 5,
    },
    activeIndicator: {
        backgroundColor: '#000',
    },
});

export default StoryPage;
