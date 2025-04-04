import { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sugarContainer: {
        width: 380,
        height: 94,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFBFB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    image: {
        position: 'absolute',
        top: -15,
        left: -7,
        width: 200,
        height: 200,
        resizeMode: 'contain',
      },
})

function Logo() {
    return(
        <View>
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
    const [sugar, setSugar] = useState(0);
    return(
        <View style={styles.sugarContainer}>
            <Text>Sugar: {sugar}</Text> 

        </View>
    )
}

function Feedback() { 
    return(
        <View style={styles.container}>
            <Sugar />
        </View>
    )
}

export default Feedback;