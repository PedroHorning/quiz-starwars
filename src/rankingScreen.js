import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';


const RankingScreen = () => {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await fetch('http://localhost:8080/rank/');
        const data = await response.json();
        setRanking(data.sort((a, b) => b.pontuacao - a.pontuacao));

      } catch (error) {
        console.error('Erro ao buscar o ranking:', error);
      }
    };

    fetchRanking();
  }, []);

  
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/fundo.jpg')}
        style={styles.backgroundImage}
      />
      <Text style={styles.title}>Ranking</Text>
      <ScrollView style={styles.contentContainer}> {/* Use ScrollView do React Native */}
      <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        {ranking.map((entry) => (
          <View key={entry.id} style={styles.rankingEntry}>
            <Text style={styles.rankingText}>{entry.nome}: {entry.pontuacao} pontos</Text>
          </View>
        ))}
        {/* Fim do conteúdo dentro do ScrollView */}
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
    color: 'black',
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
