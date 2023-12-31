import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/home';
import Quiz from './src/quiz';
import RankingScreen from './src/rankingScreen';

const Stack = createNativeStackNavigator();


function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
        <Stack.Screen name="Quiz" component={Quiz} options={{ headerShown: false }}/>
        <Stack.Screen name="Ranking" component={RankingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
