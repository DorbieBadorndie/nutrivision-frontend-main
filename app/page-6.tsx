import React from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function Page6() {
  return (
    <ThemedView style={styles.container}>
      <Image
        source={require('@/assets/images/NutriVision.png')}
        style={styles.logo}
        accessibilityRole="image"
        accessibilityLabel="NutriVision logo"
      />
      <View style={styles.detailBox}>
        {/* Row 1: Legends (2 columns: 1/3 and 2/3 split) */}
        <View style={styles.row}>
          <View style={styles.legendCol1}>
            <View style={styles.legend}>
              <View style={[styles.square, { backgroundColor: 'black' }]} />
              <ThemedText style={styles.legendText}>User input</ThemedText>
            </View>
          </View>
          <View style={styles.legendCol2}>
            <View style={styles.legend}>
              <View style={[styles.square, { backgroundColor: '#9AB106' }]} />
              <ThemedText style={styles.legendText}>Average intake</ThemedText>
            </View>
          </View>
        </View>
        {/* Row 2: Sugar */}
        <View style={styles.row}>
          <View style={styles.dataCol1}>
            <View style={styles.labelIconRow}>
              <ThemedText style={styles.itemText}>Sugar</ThemedText>
              <Image
                source={require('@/assets/images/Sugar Icon.png')}
                style={styles.icon}
              />
            </View>
          </View>
          <View style={styles.dataCol2}>
            <View style={styles.progressBarRow}>
              <View style={styles.progressBarContainer}>
                <View
                  style={[styles.progressBarSegment, { backgroundColor: 'black', width: '60%' }]}
                />
              </View>
            </View>
            <View style={styles.progressBarRow}>
              <View style={styles.progressBarContainer}>
                <View
                  style={[styles.progressBarSegment, { backgroundColor: '#9AB106', width: '49%' }]}
                />
              </View>
            </View>
          </View>
          <View style={styles.dataCol3}>
            <View style={styles.measurementRow}>
              <ThemedText style={styles.measurementTextUp}>53 g</ThemedText>
            </View>
            <View style={styles.measurementRow}>
              <ThemedText style={styles.measurementTextDown}>49 g</ThemedText>
            </View>
          </View>
        </View>
        {/* Row 3: Sodium */}
        <View style={styles.row}>
          <View style={styles.dataCol1}>
            <View style={styles.labelIconRow}>
              <ThemedText style={styles.itemText}>Sodium</ThemedText>
              <Image
                source={require('@/assets/images/Sodium Icon.png')}
                style={styles.icon}
              />
            </View>
          </View>
          <View style={styles.dataCol2}>
            <View style={styles.progressBarRow}>
              <View style={styles.progressBarContainer}>
                <View
                  style={[styles.progressBarSegment, { backgroundColor: 'black', width: '33%' }]}
                />
              </View>
            </View>
            <View style={styles.progressBarRow}>
              <View style={styles.progressBarContainer}>
                <View
                  style={[styles.progressBarSegment, { backgroundColor: '#9AB106', width: '27%' }]}
                />
              </View>
            </View>
          </View>
          <View style={styles.dataCol3}>
            <View style={styles.measurementRow}>
              <ThemedText style={styles.measurementTextUp}>15 g</ThemedText>
            </View>
            <View style={styles.measurementRow}>
              <ThemedText style={styles.measurementTextDown}>11 g</ThemedText>
            </View>
          </View>
        </View>
        {/* Row 4: Calories */}
        <View style={styles.row}>
          <View style={styles.dataCol1}>
            <View style={styles.labelIconRow}>
              <ThemedText style={styles.itemText}>Calories</ThemedText>
              <Image
                source={require('@/assets/images/Cholesterol Icon.png')}
                style={styles.icon}
              />
            </View>
          </View>
          <View style={styles.dataCol2}>
            <View style={styles.progressBarRow}>
              <View style={styles.progressBarContainer}>
                <View
                  style={[styles.progressBarSegment, { backgroundColor: 'black', width: '45%' }]}
                />
              </View>
            </View>
            <View style={styles.progressBarRow}>
              <View style={styles.progressBarContainer}>
                <View
                  style={[styles.progressBarSegment, { backgroundColor: '#9AB106', width: '40%' }]}
                />
              </View>
            </View>
          </View>
          <View style={styles.dataCol3}>
            <View style={styles.measurementRow}>
              <ThemedText style={styles.measurementTextUp}>180 g</ThemedText>
            </View>
            <View style={styles.measurementRow}>
              <ThemedText style={styles.measurementTextDown}>147 g</ThemedText>
            </View>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff1f6',
  },
  logo: {
    position: 'absolute',
    top: -15,
    left: -7,
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  detailBox: {
    marginTop: 120,
    marginHorizontal: 10,
    width: screenWidth - 20,
    height: 180,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  // Common row style
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  // Row 1 (Legends)
  legendCol1: {
    flex: 1, // 1/3 of row
    justifyContent: 'center',
  },
  legendCol2: {
    flex: 3.3, // 2/3 of row
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  square: {
    width: 15,
    height: 15,
    marginRight: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    color: '#333',
  },
  // Data rows (Rows 2-4): 3 columns
  dataCol1: {
    flex: 2,
    justifyContent: 'center',
  },
  dataCol2: {
    flex: 5.5,
    justifyContent: 'center',
  },
  dataCol3: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  // Label and icon row in data rows
  labelIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 14,
    color: '#333',
    marginRight: 4,
    fontWeight: 'bold'
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  // Progress bar subrows in data rows (column 2)
  progressBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1,
  },
  progressBarContainer: {
    flex: 1,
    height: 3,
    backgroundColor: '#ddd',
    borderRadius: 100,
    overflow: 'hidden',
    marginRight: 4,
    marginVertical: 2,
  },
  progressBarSegment: {
    height: '100%',
    borderRadius: 100,
  },
  // Measurement rows in data rows (column 3)
  measurementRow: {
    justifyContent: 'flex-start',
  },
  measurementTextUp: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold'
  },
  measurementTextDown: {
    fontSize: 12,
    color: '#9AB106',
    marginTop: -8,
    fontWeight: 'bold'
  },

});

