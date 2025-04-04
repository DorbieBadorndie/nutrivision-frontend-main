import { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, SafeAreaView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sugarContainer: {
        width: SCREEN_WIDTH * 0.9,
        paddingVertical: 20,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFBFB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    logoContainer: {
        position: 'absolute',
        top: -65,
        left: 0,
    },
    image: {
        width: SCREEN_WIDTH * 0.5,
        height: SCREEN_WIDTH * 0.5,
        resizeMode: 'contain',
    },
    textContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
    },
    textHeader: {
        fontFamily: 'AlberSans-Regular',
        fontWeight: 'bold',
        fontSize: 18,
        color: '#000',
        marginBottom: 5,
    },
    textSub: {
        fontSize: 16,
        color: '#333',
        marginBottom: 3,
    }
});

function Logo() {
    return (
        <View style={styles.logoContainer}>
            <Image
                source={require('@/assets/images/NutriVision.png')}
                style={styles.image}
                accessibilityRole="image"
                accessibilityLabel="NutriVision logo"
            />
        </View>
    );
}

function Sugar() {
    const [sugar, setSugar] = useState<number>(0);
    const [approx, setApprox] = useState<number>(0);
    const [tablespoon, setTablespoon] = useState<number>(0);
    
    return (
        <View style={styles.sugarContainer}>
            <View style={styles.textContainer}>
                <Text style={styles.textHeader}>
                    Sugar: {sugar} g
                </Text>
                <Text style={styles.textSub}>
                    Approx. {approx} grams
                </Text>
                <Text style={styles.textSub}>
                    Equivalent {tablespoon} tablespoons
                </Text>
            </View>
        </View>
    );
}

function Feedback() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{flex: 1, paddingHorizontal: 20}}>
                <ThemedView style={[styles.container, { backgroundColor: '#eff1f6' }]}>
                    <Logo />
                    <Sugar />
                </ThemedView>
            </View>
        </SafeAreaView>
    );
}

export default Feedback;
