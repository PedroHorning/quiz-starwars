import React, { useState, useEffect } from 'react';
import { Platform, View, Text, Image, StyleSheet, Button } from 'react-native';
import questionsData from './questions.json';
import { RadioButton } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid';
import { useNavigation } from '@react-navigation/native';


function Quiz({ route, navigation }) {
  const { nome } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuestions, setShowQuestions] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [ranking, setRanking] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(15);
  const [timerActive, setTimerActive] = useState(false);

  const goHome = () => {
    navigation.navigate('Home');
  };

  const goToRanking = () => {
    navigation.navigate('Ranking');
  };
  
  const handleShowQuestions = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsCorrectAnswer(false);
    setShowNextButton(false);
    if (!showQuestions) { 
      setQuizCompleted(false);
      setScore(0);
      startTimer(); 
    }
    setShowQuestions(true);
  };
 
  useEffect(() => {
    let interval;

    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

  if (timer === 0) {
    setQuizCompleted(true);
    setTimerActive(false);
  }

  return () => clearInterval(interval);
  }, [timer, timerActive]);

  const startTimer = () => {
    setTimer(20);
    setTimerActive(true);
  };


  
  const handleAnswerQuestion = () => {
    const currentQuestion = questionsData[currentQuestionIndex];
  
    if (selectedAnswer === currentQuestion.options.find(option => option.correct)?.id) {
      setIsCorrectAnswer(true);
      setScore(score +currentQuestion.score);
    } else {
      setIsCorrectAnswer(false);
    }
  
    setShowNextButton(true);
  };
  
  const handleNextQuestion = () => {
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questionsData.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setSelectedAnswer(null);
      setIsCorrectAnswer(false);
      setShowNextButton(false);
    } else {
      setQuizCompleted(true);
      saveUserToRanking(); 
    }
  };
  

  const saveUserToRanking = async () => {
    const newRankingEntry = { nome, score };
    let rankingData = [];
    let updatedRanking = [];
  
    if (Platform.OS === 'web') {
      rankingData = localStorage.getItem('ranking');
    } else {
      const fileUri = FileSystem.documentDirectory + 'ranking.json';
      try {
        rankingData = await FileSystem.readAsStringAsync(fileUri);
      } catch (error) {
        console.error('Erro ao ler o ranking:', error);
      }
    }
  
    const rankingArray = rankingData ? JSON.parse(rankingData) : [];
    const existingIndex = rankingArray.findIndex((entry) => entry.nome === nome);
  
    if (existingIndex !== -1) {
      // Atualiza o score do jogador existente
      rankingArray[existingIndex].score = Math.max(rankingArray[existingIndex].score, score);
    } else {
      // Adiciona um novo jogador
      rankingArray.push(newRankingEntry);
    }
  
    updatedRanking = rankingArray.sort((a, b) => b.score - a.score); // Ordena por score decrescente
  
    if (Platform.OS === 'web') {
      localStorage.setItem('ranking', JSON.stringify(updatedRanking));
    } else {
      const fileUri = FileSystem.documentDirectory + 'ranking.json';
      try {
        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(updatedRanking));
      } catch (error) {
        console.error('Erro ao salvar o ranking:', error);
      }
    }
  
    setRanking(updatedRanking); // Atualiza o estado local do ranking
  };
  
  useEffect(() => {
    if (quizCompleted) {
      saveUserToRanking();
      setTimerActive(false);
    }
  }, [quizCompleted]);

  
  const optionStyle = (optionId) => {
    if (showNextButton) {
      const currentQuestion = questionsData[currentQuestionIndex];
      const correctOption = currentQuestion.options.find(option => option.correct);
  
      if (optionId === correctOption.id) {
        return {
          backgroundColor: isCorrectAnswer ? 'green' : '',
        };
      } else if (optionId === selectedAnswer) {
        return {
          backgroundColor: !isCorrectAnswer ? 'red' : '',
        };
      }
    }
    return {};
  };

  const handleQuizComplete = () => {
    setQuizCompleted(true);
    setTimerActive(false); // Para o cronômetro
    // ...código existente para finalizar o quiz
  };

  return (
    <View style={styles.container}>
    <Image source={require('../assets/fundo.jpg')} style={styles.backgroundImage} />
    <View style={styles.topContainer}>
      <Text style={styles.nomeText}>Jogador: {nome}</Text>
      <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.scoreText}>SCORE: {score}</Text>
      <Text style={styles.scoreText}>Timer: {timer}</Text>
    </View>
    
   
    <View style={styles.centerContainer}>
    {quizCompleted ? (
    <View>
      <Button title="Voltar ao Início" onPress={goHome}  />
      <Button title="Ver Ranking" onPress={goToRanking} />
    </View>
  ) : (        showQuestions ? (
          <View>
            <View style={styles.questionContainer}>
              
            <Text style={styles.questionText}>
              {questionsData[currentQuestionIndex].question}
            </Text>
            </View>
            {questionsData[currentQuestionIndex].options.map((option) => (
              <View key={option.id} style={[styles.optionContainer, optionStyle(option.id)]}>
                <View style={styles.optionRow}>
                  <RadioButton
                    value={option.id}
                    status={selectedAnswer === option.id ? 'checked' : 'unchecked'}
                    onPress={() => {
                      if (!showNextButton) {
                        setSelectedAnswer(option.id);
                      }
                    }}
                  />
                  <Text style={styles.optionText}>
                    {option.text}
                  </Text>
                </View>
                
              </View>
            ))}
            
            
            <View style={styles.buttonContainer}>
            {selectedAnswer !== null && !showNextButton && (
              <Button title="Responder" onPress={handleAnswerQuestion} style={styles.answerButton}/>
            )}
            {showNextButton && (
              <Button title="Próxima Pergunta" onPress={handleNextQuestion} />
            )}
            </View>
          </View>
        ) : (
          <Button title="Iniciar QUIZ" onPress={handleShowQuestions} />
        )
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
  questionText: {
    color: 'white',
    fontSize: 20,
    marginBottom: 20,
  },
  optionContainer: {
    marginBottom: 10,
    padding: 3,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  correctAnswerText: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: -10, 
  },
  questionContainer: {
    marginBottom: 20,
  },
  answerButton: {
    marginTop: 40, 
    width: 150, 
    height: 30, 
  },

  rankingTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  rankingEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 5,
  },
  rankingText: {
    color: 'white',
    fontSize: 18,
  },
  timerText: {
    color: 'white',
    fontSize: 25,
  },
  

  });

export default Quiz;
