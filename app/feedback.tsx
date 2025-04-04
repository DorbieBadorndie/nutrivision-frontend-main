import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

function Sugar() {
    return(
        <View style={styles.container}>
            <Text>Sugar</Text>
        </View>
    )
}

function Feedback() {
    return(
        <View style={styles.container}>
            <Text>Feedback</Text>
        </View>
    )
}

export default Feedback;