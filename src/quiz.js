import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';
import { questionStyles } from './ask'; //  estilos do arquivo ask.js
import { questions } from './ask';

function Quiz({ route }) {
  const { nome } = route.params; // Recebe o nome como parâmetro
  const [showQuestions, setShowQuestions] = useState(false); 

  const handleShowQuestions = () => {
    setShowQuestions(true); 
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/fundo.jpg')} style={styles.backgroundImage} />

      <View style={styles.topContainer}>
        <Text style={styles.nomeText}>Jogador: {nome}</Text>
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.scoreText}>SCORE: 0</Text>
        
      </View>


      <View style={questionStyles.centerContainer}>
        {showQuestions ? (
           questions.map((question) => (
            <View key={question.id}>
              <Text style={questionStyles.questionText}>{question.question}</Text>
              {question.options.map((option) => (
                <Text key={option.id} style={questionStyles.optionText}>
                  {option.id}: {option.text}
                </Text>
              ))}
            </View>
          ))
        ) : (
          ///// Botão teste para mostrar as perguntas
          <Button title="Mostrar Perguntas" onPress={handleShowQuestions} />
           
        )}
      </View>
    </View>
  );
}

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
    topContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 20,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    nomeText: {
      color: 'white',
      fontSize: 25,
    },
    scoreText: {
      color: 'white',
      fontSize: 25,
    },
    logo: {
      width: 300,
      height: 300,
      marginBottom: 0,
    },
  });
  




export default Quiz;



