import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Image } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from '@react-navigation/native';

const RankingScreen = () => {
  const [ranking, setRanking] = useState([]);

  const loadRankingData = async () => {
    if (Platform.OS === 'web') {
      const rankingData = localStorage.getItem('ranking');
      const rankingArray = rankingData ? JSON.parse(rankingData) : [];
      setRanking(rankingArray);
    } else {
      const fileUri = FileSystem.documentDirectory + 'ranking.json';
      try {
        const rankingData = await FileSystem.readAsStringAsync(fileUri);
        const rankingArray = JSON.parse(rankingData);
        setRanking(rankingArray);
      } catch (error) {
        console.error('Erro ao carregar o ranking:', error);
        setRanking([]); // Em caso de erro, definir ranking para um array vazio
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadRankingData();
    }, [])
  );
  
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/fundo.jpg')}
        style={styles.backgroundImage}
      />
      <ScrollView style={styles.contentContainer}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Ranking</Text>
        {ranking.map((entry, index) => (
          <View key={index} style={styles.rankingEntry}>
            <Text style={styles.rankingText}>{entry.nome}: {entry.score}-Pontos.</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 20,
  },
  logo: {
    width: 300, // Ajuste conforme necessário
    height: 120, // Ajuste conforme necessário
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  rankingEntry: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 25,
    marginVertical: 5,
    width: '50%',
    alignSelf: 'center', 
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rankingText: {
    fontSize: 18,
    color: 'black', 
  },
});

export default RankingScreen;
