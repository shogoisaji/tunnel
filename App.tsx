import React from 'react';
import { AppNavigator } from './src/navigation/AppNavigator';
import { MemoProvider } from './src/context/MemoContext';

export default function App() {
  return (
    <MemoProvider>
      <AppNavigator />
    </MemoProvider>
  );
}
