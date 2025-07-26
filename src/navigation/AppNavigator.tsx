import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { CreateMemoScreen } from '../screens/CreateMemoScreen';
import { EditMemoScreen } from '../screens/EditMemoScreen';

const Stack = createStackNavigator();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: 'Tunnel Notes',
          }}
        />
        <Stack.Screen 
          name="CreateMemo" 
          component={CreateMemoScreen}
          options={{
            title: '新しいメモ',
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="EditMemo" 
          component={EditMemoScreen}
          options={{
            title: 'メモを編集',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
