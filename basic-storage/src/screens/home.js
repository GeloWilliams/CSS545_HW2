// screens/Home.tsx

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const Home = ({ navigation }) => {
    const { theme, toggleTheme, isDarkTheme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            <Text style={[styles.title, { color: theme.textColor }]}>
                Simple Webtoon Viewer
            </Text>
            <View style={styles.buttonContainer}>
                <Button
                    title="Go to Story"
                    onPress={() => navigation.navigate('Story')}
                    color="blue"
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title={`Switch to ${isDarkTheme ? 'Light' : 'Dark'} Theme`}
                    onPress={toggleTheme}
                    color="red"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    buttonContainer: {
        marginVertical: 10,
        width: '80%',
    },
});

export default Home;
