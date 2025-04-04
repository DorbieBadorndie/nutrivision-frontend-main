import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Dimensions, Text, DimensionValue, SafeAreaView, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import PieChart from 'react-native-pie-chart';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/types/types'; // adjust path as needed
import { StackNavigationProp } from '@react-navigation/stack';
// Helper functions with proper typing
const toProgressWidth = (value: number): DimensionValue => `${value}%` as DimensionValue;
const toPercentageText = (value: number): string => `${value}%`;
const formatValue = (value: number, unit: string = 'g'): string => `${value} ${unit}`;

type Page6ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'page-6'>;
interface NutritionData {
  progress: {
    sugar: { user: number; avg: number };
    sodium: { user: number; avg: number };
    calories: { user: number; avg: number };
  };
  values: {
    sugar: { user: number; avg: number };
    sodium: { user: number; avg: number };
    calories: { user: number; avg: number };
  };
  intake: {
    breakdown: { calories: number; sugar: number; sodium: number };
    total: number;
  };
  avg: {
    breakdown: { calories: number; sugar: number; sodium: number };
    total: number;
  }
}

export default function Page6() {
  const [nutritionData] = useState<NutritionData>({
    progress: {
      sugar: { user: 88, avg: 50 },
      sodium: { user: 33, avg: 50 },
      calories: { user: 45, avg: 50 },
    },
    values: {
      sugar: { user: 53, avg: 49 },
      sodium: { user: 15, avg: 11 },
      calories: { user: 180, avg: 147 }, 
    },
    intake: { 
      breakdown: { calories: 33, sugar: 45, sodium: 22 },
      total: 209
    },
    avg: { 
      breakdown: { calories: 22, sugar: 45, sodium: 11 },
      total: 210
    },
  });
  

  // Progress widths (for style width)
  const progressWidthUserSugar = toProgressWidth(nutritionData.progress.sugar.user);
  const progressWidthAvgSugar = toProgressWidth(nutritionData.progress.sugar.avg);
  const progressWidthUserSodium = toProgressWidth(nutritionData.progress.sodium.user);
  const progressWidthAvgSodium = toProgressWidth(nutritionData.progress.sodium.avg);
  const progressWidthUserCalories = toProgressWidth(nutritionData.progress.calories.user);
  const progressWidthAvgCalories = toProgressWidth(nutritionData.progress.calories.avg);

  // Text values
  const textUserSugar = formatValue(nutritionData.values.sugar.user);
  const textAvgSugar = formatValue(nutritionData.values.sugar.avg);
  const textUserSodium = formatValue(nutritionData.values.sodium.user);
  const textAvgSodium = formatValue(nutritionData.values.sodium.avg);
  const textUserCalories = formatValue(nutritionData.values.calories.user);
  const textAvgCalories = formatValue(nutritionData.values.calories.avg);
  const textUserIntakeCalories = toPercentageText(nutritionData.intake.breakdown.calories);
  const textUserIntakeSugar = toPercentageText(nutritionData.intake.breakdown.sugar);
  const textUserIntake = toPercentageText(nutritionData.intake.breakdown.sodium);
  const textAvgIntakeCalories = toPercentageText(nutritionData.avg.breakdown.calories);
  const textAvgIntakeSugar = toPercentageText(nutritionData.avg.breakdown.sugar);
  const textAvgIntake = toPercentageText(nutritionData.avg.breakdown.sodium);
  const totalAvgIntake = formatValue(nutritionData.avg.total);
  const totalUserIntake = formatValue(nutritionData.intake.total);

  // Donut series
  const donutSeries = [
    { value: nutritionData.intake.breakdown.sodium, color: '#000000' },
    { value: nutritionData.intake.breakdown.sugar, color: '#c0b4b4' },
    { value: nutritionData.intake.breakdown.calories, color: '#7ca844' },
  ];

  const handleCheck = () => {
    navigation.navigate('page-2');
  };

  
  

  type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'page-6'>;
  const navigation = useNavigation<HomeScreenNavigationProp>();
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('@/assets/images/NutriVision.png')}
        style={styles.logo}
        accessibilityRole="image"
        accessibilityLabel="NutriVision logo"
      />
    <ThemedView style={styles.container}>
      
      <View style={styles.detailBox}>
        {/* Row 1: Legends */}
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

        {/* Sugar Row */}
        <View style={styles.row}>
          <View style={styles.dataCol1}>
            <View style={styles.labelIconRow}>
              <ThemedText style={styles.itemText}>Sugar</ThemedText>
              <Image source={require('@/assets/images/Sugar Icon.png')} style={styles.icon} />
            </View>
          </View>
          <View style={styles.dataCol2}>
            <View style={styles.progressBarRow}>
              <View style={styles.progressBarContainer}>
                <View style={[
                  styles.progressBarSegment, 
                  { backgroundColor: 'black', width: progressWidthUserSugar }
                ]} />
              </View>
            </View>
            <View style={styles.progressBarRow}>
              <View style={styles.progressBarContainer}>
                <View style={[
                  styles.progressBarSegment, 
                  { backgroundColor: '#9AB106', width: progressWidthAvgSugar }
                ]} />
              </View>
            </View>
          </View>
          <View style={styles.dataCol3}>
            <View style={styles.measurementRow}>
              <ThemedText style={styles.measurementTextUp}>{textUserSugar}</ThemedText>
            </View>
            <View style={styles.measurementRow}>
              <ThemedText style={styles.measurementTextDown}>{textAvgSugar}</ThemedText>
            </View>
          </View>
        </View>

        {/* Sodium Row */}
        <View style={styles.row}>
          <View style={styles.dataCol1}>
            <View style={styles.labelIconRow}>
              <ThemedText style={styles.itemText}>Sodium</ThemedText>
              <Image source={require('@/assets/images/Sodium Icon.png')} style={styles.icon} />
            </View>
          </View>
          <View style={styles.dataCol2}>
            <View style={styles.progressBarRow}>
              <View style={styles.progressBarContainer}>
                <View style={[
                  styles.progressBarSegment, 
                  { backgroundColor: 'black', width: progressWidthUserSodium }
                ]} />
              </View>
            </View>
            <View style={styles.progressBarRow}>
              <View style={styles.progressBarContainer}>
                <View style={[
                  styles.progressBarSegment, 
                  { backgroundColor: '#9AB106', width: progressWidthAvgSodium }
                ]} />
              </View>
            </View>
          </View>
          <View style={styles.dataCol3}>
            <View style={styles.measurementRow}>
              <ThemedText style={styles.measurementTextUp}>{textUserSodium}</ThemedText>
            </View>
            <View style={styles.measurementRow}>
              <ThemedText style={styles.measurementTextDown}>{textAvgSodium}</ThemedText>
            </View>
          </View>
        </View>

        {/* Calories Row */}
        <View style={styles.row}>
          <View style={styles.dataCol1}>
            <View style={styles.labelIconRow}>
              <ThemedText style={styles.itemText}>Calories</ThemedText>
              <Image source={require('@/assets/images/Cholesterol Icon.png')} style={styles.icon} />
            </View>
          </View>
          <View style={styles.dataCol2}>
            <View style={styles.progressBarRow}>
              <View style={styles.progressBarContainer}>
                <View style={[
                  styles.progressBarSegment, 
                  { backgroundColor: 'black', width: progressWidthUserCalories }
                ]} />
              </View>
            </View>
            <View style={styles.progressBarRow}>
              <View style={styles.progressBarContainer}>
                <View style={[
                  styles.progressBarSegment, 
                  { backgroundColor: '#9AB106', width: progressWidthAvgCalories }
                ]} />
              </View>
            </View>
          </View>
          <View style={styles.dataCol3}>
            <View style={styles.measurementRow}>
              <ThemedText style={styles.measurementTextUp}>{textUserCalories}</ThemedText>
            </View>
            <View style={styles.measurementRow}>
              <ThemedText style={styles.measurementTextDown}>{textAvgCalories}</ThemedText>
            </View>
          </View>
        </View>
      </View>

      {/* Donut Chart Boxes */}
      {/* User Intake Donut Chart */}
<View style={styles.newBox}>
  <View style={styles.innerRow}>
    <View style={styles.newLeftColumn}>
      <PieChart
        widthAndHeight={170}
        series={[
          { value: nutritionData.intake.breakdown.sodium, color: '#000000' },
          { value: nutritionData.intake.breakdown.sugar, color: '#c0b4b4' },
          { value: nutritionData.intake.breakdown.calories, color: '#7ca844' },
        ]}
        cover={0.55}
      />
    </View>
    <View style={styles.newRightColumn}>
      <Text style={styles.newLegendTitle}>User Intake</Text>
      <View style={styles.newLegendItem}>
        <View style={[styles.newCircle, { backgroundColor: '#7ca844' }]} />
        <Text style={styles.newLegendText}>Calories ({textUserIntakeCalories})</Text>
      </View>
      <View style={styles.newLegendItem}>
        <View style={[styles.newCircle, { backgroundColor: '#c0b4b4' }]} />
        <Text style={styles.newLegendText}>Sugar ({textUserIntakeSugar})</Text>
      </View>
      <View style={styles.newLegendItem}>
        <View style={[styles.newCircle, { backgroundColor: '#000000' }]} />
        <Text style={styles.newLegendText}>Sodium ({textUserIntake})</Text>
      </View>
      <View style={styles.newTotalBox}>
        <Text style={styles.newTotalText}>
          Total Nutrient{'\n'}Amount = {totalUserIntake}
        </Text>
      </View>
    </View>
  </View>
</View>

{/* Average Intake Donut Chart */}
<View style={styles.newBox}>
  <View style={styles.innerRow}>
    <View style={styles.newLeftColumn}>
      <PieChart
        widthAndHeight={170}
        series={[
          { value: nutritionData.avg.breakdown.sodium, color: '#000000' },
          { value: nutritionData.avg.breakdown.sugar, color: '#c0b4b4' },
          { value: nutritionData.avg.breakdown.calories, color: '#7ca844' },
        ]}
        cover={0.55}
      />
    </View>
    <View style={styles.newRightColumn}>
      <Text style={styles.newLegendTitle}>Average Intake</Text>
      <View style={styles.newLegendItem}>
        <View style={[styles.newCircle, { backgroundColor: '#7ca844' }]} />
        <Text style={styles.newLegendText}>Calories ({textAvgIntakeCalories})</Text>
      </View>
      <View style={styles.newLegendItem}>
        <View style={[styles.newCircle, { backgroundColor: '#c0b4b4' }]} />
        <Text style={styles.newLegendText}>Sugar ({textAvgIntakeSugar})</Text>
      </View>
      <View style={styles.newLegendItem}>
        <View style={[styles.newCircle, { backgroundColor: '#000000' }]} />
        <Text style={styles.newLegendText}>Sodium ({textAvgIntake})</Text>
      </View>
      <View style={styles.newTotalBox}>
        <Text style={styles.newTotalText}>
          Total Nutrient{'\n'}Amount = {totalAvgIntake}
        </Text>
      </View>
    </View>
  </View>
</View>
      
    </ThemedView>
    <TouchableOpacity style={styles.checkButton} onPress={handleCheck}>
              <ThemedText style={styles.checkMark}>✓</ThemedText>
            </TouchableOpacity>
    </SafeAreaView>
  );
}

// Keep all your existing styles exactly as they were
const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff1f6',
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 200,
    height: 60,
    resizeMode: 'contain',
    alignSelf: "flex-start"
  },
  detailBox: {
    width: screenWidth - 32,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendCol1: {
    flex: 1,
    justifyContent: 'center',
  },
  legendCol2: {
    flex: 3.3,
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
  labelIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 14,
    color: '#333',
    marginRight: 2,
    fontWeight: 'bold',
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
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
  measurementRow: {
    justifyContent: 'flex-start',
  },
  measurementTextUp: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
  },
  measurementTextDown: {
    fontSize: 12,
    color: '#9AB106',
    marginTop: -5,
    fontWeight: 'bold',
  },
  newBox: {
    width: screenWidth - 32,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  innerRow: {
    flexDirection: 'row',
  },
  newLeftColumn: {
    flex: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newRightColumn: {
    flex: 40,
    paddingLeft: 10,
    justifyContent: 'center',
    gap: 6,
  },
  newLegendTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: -20
  },
  newLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  newCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  newLegendText: {
    fontSize: 14,
    color: '#333',
  },
  newTotalBox: {
    backgroundColor: '#f8e4e4',
    padding: 10,
    borderRadius: 15,
    alignItems: 'flex-start',
    marginLeft: -20,
  },
  newTotalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'left'
  },
  checkButton: {
    position: 'absolute',
    bottom: 35,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    fontSize: 25,
    color: '#9AB106',
    fontWeight: 'bold',
  },
});