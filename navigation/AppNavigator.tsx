import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Index from '@/app/index'; // adjust the path if needed
import Page6 from '@/app/page-6'; // adjust the path if needed
import Page2 from '@/app/page-2';
import { RootStackParamList } from '@/types/types'; // adjust the path if needed
import UserNutrientPage from '@/app/nutrient-page';
import Camera from '@/app/camera';

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="index">
        <Stack.Screen name="index" component={Index} />
        <Stack.Screen name="page-6" component={Page6} />
        <Stack.Screen name="page-2" component={Page2} />
        <Stack.Screen name="nutrient-page" component={UserNutrientPage} />
        <Stack.Screen name="camera" component={Camera} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
