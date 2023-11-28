import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function Quiz({ route }) {
  const { nome } = route.params; // Recebe o nome como parâmetro
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const countdown = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      } else {
        console.log('Tempo esgotado! Pontuação final:', score);
        clearInterval(countdown); 
        saveScore();
        navigation.navigate('RankingScreen', { nome, score });
        return;
      }
    }, 1000);

    return () => {
      clearInterval(countdown); // Limpa o intervalo quando o componente é desmontado
    };
  }, [timer, score]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const saveScore = async () => {
    try {
      const response = await fetch('http://localhost:8080/rank/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, pontuacao: score }),
      });
  
      if (response.ok) {
        console.log('Pontuação salva com sucesso!');
      } else {
        console.error('Erro ao salvar pontuação.');
      }
    } catch (error) {
      console.error('Erro ao salvar pontuação:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch('https://swapi.dev/api/people/');
      const data = await response.json();

      const characterData = data.results.slice(0, 4); // Limitando a 6 personagens para perguntas
      const shuffledCharacters = shuffleArray(characterData);

      const generatedQuestions = [];

      for (const character of shuffledCharacters) {
        const films = character.films.length > 0 ? await fetchRandomFilms(character.films) : [];
        const homeworld = character.homeworld ? await fetchRandomHomeworld(character.homeworld) : [];
        const vehicles = character.vehicles.length > 0 ? await fetchRandomVehicles(character.vehicles) : [];

        if (films.length > 0) {
          generatedQuestions.push(createQuestion('filme', films, character.name));
        }

        if (homeworld.length > 0) {
          generatedQuestions.push(createQuestion('planeta', homeworld, character.name));
        }

        if (vehicles.length > 0) {
          generatedQuestions.push(createQuestion('veículo', vehicles, character.name));
        }
      }

      setQuestions(generatedQuestions);
    } catch (error) {
      console.error('Erro ao buscar perguntas:', error);
    }
  };

  const fetchRandomFilms = async (filmUrls) => {
    const filmTitles = [];
    try {
      const response = await fetch('https://swapi.dev/api/films/');
      const data = await response.json();
      const allFilms = data.results.map((film) => film.title);
      for (const film of allFilms) {
        if (!filmUrls.includes(film) && filmTitles.length < 3) {
          filmTitles.push(film);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
    }
    return filmTitles;
  };

  const fetchRandomHomeworld = async (homeworldUrl) => {
    try {
      const response = await fetch('https://swapi.dev/api/planets/');
      const data = await response.json();
      const allPlanets = data.results.map((planet) => planet.name);
      const filteredPlanets = allPlanets.filter((planet) => planet !== homeworldUrl);
      return filteredPlanets.slice(0, 3);
    } catch (error) {
      console.error('Erro ao buscar planeta:', error);
      return [];
    }
  };

  const fetchRandomVehicles = async (vehicleUrls) => {
    const vehicleNames = [];
    try {
      const response = await fetch('https://swapi.dev/api/vehicles/');
      const data = await response.json();
      const allVehicles = data.results.map((vehicle) => vehicle.name);
      for (const vehicle of allVehicles) {
        if (!vehicleUrls.includes(vehicle) && vehicleNames.length < 3) {
          vehicleNames.push(vehicle);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
    }
    return vehicleNames;
  };

  const createQuestion = (type, options, characterName) => {
    const correctOption = { text: `${options[0]}`, correct: true };
    const shuffledOptions = shuffleArray(options.slice(1, options.length));
    const otherOptions = shuffledOptions.slice(0, 3).map((option) => ({ text: `${option}`, correct: false }));
    const allOptions = shuffleArray([correctOption, ...otherOptions]);
    return {
      id: questions.length + 1,
      question: `Qual ${type} está relacionado ao personagem ${characterName}?`,
      options: allOptions,
      score: 5,
    };
  };

  const shuffleArray = (array) => {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (option) => {
    setSelectedAnswer(option);

    if (option.correct) {
      setScore(score + currentQuestion.score);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      } else {
        console.log('Quiz finalizado! Pontuação final:', score);
      }
    }, 1500);
  };

  const renderOptions = () => {
    return currentQuestion.options.map((option) => (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.optionButton,
          selectedAnswer === option ? styles.selectedOption : null,
        ]}
        onPress={() => handleAnswer(option)}
        disabled={selectedAnswer !== null}
      >
        <Text style={styles.optionText}>{option.text}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/fundo.jpg')}
        style={styles.backgroundImage}
      />
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>Tempo: {timer}</Text>
        <Text style={styles.timerText}>Score: {score}</Text>
      </View>
      <View style={styles.centerContainer}>
      
        {currentQuestion ? (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </View>
        ) : (
          <Text style={styles.questionText}>Carregando perguntas...</Text>
        )}
        <View style={styles.optionsContainer}>
          {currentQuestion && renderOptions()}
        </View>
      </View>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  timerContainer: {
    alignItems: 'flex-end',
    marginTop: 20,
    marginRight: 20,
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFF00',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFF00',
  },
  optionsContainer: {
    width: '100%',
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  optionText: {
    fontSize: 16,
  },
  selectedOption: {
    backgroundColor: 'lightblue',
  },
});

export default Quiz;
