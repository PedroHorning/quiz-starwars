import { StyleSheet } from 'react-native';

export const questions = [
  {
    id: 1,
    question: 'Qual é o nome do protagonista da trilogia original de Star Wars?',
    options: [
      { id: 'A', text: 'Darth Vader' },
      { id: 'B', text: 'Obi-Wan Kenobi' },
      { id: 'C', text: 'Han Solo' },
      { id: 'D', text: 'Luke Skywalker', correct: true },
    ],
  },
  {
    id: 2,
    question: 'Qual é o nome da princesa de Alderaan?',
    options: [
      { id: 'A', text: 'Leia Organa', correct: true },
      { id: 'B', text: 'Padmé Amidala' },
      { id: 'C', text: 'Rey' },
      { id: 'D', text: 'Ahsoka Tano' },
    ],
  },
];

// Estilos


export const questionStyles = StyleSheet.create({
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    questionText: {

           fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
    },
    optionText: {

        
            fontSize: 16,
            marginLeft: 10,
  },
    
  });
  


