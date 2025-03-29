import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Index from '@/app/index'; // adjust the path if needed
import Page6 from '@/app/page-6'; // adjust the path if needed
import { RootStackParamList } from '@/types/types'; // adjust the path if needed

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Index">
        <Stack.Screen name="Index" component={Index} />
        <Stack.Screen name="page-6" component={Page6} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
