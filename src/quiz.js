import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';
import questionsData from './questions.json';
import { RadioButton } from 'react-native-paper';

function Quiz({ route }) {
  const { nome } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuestions, setShowQuestions] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);


  const [score, setScore] = useState(0);

  const handleShowQuestions = () => {
    setCurrentQuestionIndex(0);
    setShowQuestions(true);
    setSelectedAnswer(null);
    setIsCorrectAnswer(false);
    setShowNextButton(false);
    setQuizCompleted(false);
    setScore(0);
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
    if (currentQuestionIndex === questionsData.length -1) {
      setQuizCompleted(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsCorrectAnswer(false);
      setShowNextButton(false);
    }
  };
  

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

  return (
    <View style={styles.container}>
    <Image source={require('../assets/fundo.jpg')} style={styles.backgroundImage} />
    <View style={styles.topContainer}>
      <Text style={styles.nomeText}>Jogador: {nome}</Text>
      <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.scoreText}>SCORE: {score}</Text>
    </View>
  
    <View style={styles.centerContainer}>
      {quizCompleted ? (
        <Button title="Voltar ao Início" onPress={handleShowQuestions} />
      ) : (
        showQuestions ? (
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


  });

export default Quiz;
