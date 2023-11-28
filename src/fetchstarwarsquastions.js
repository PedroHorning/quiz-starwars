async function fetchStarWarsQuestions() {
    try {
      const response = await fetch('https://swapi.dev/api/people/');
      const data = await response.json();
  
      const questions = data.results.map((character, index) => {
        const species = character.species || [];
  
        // Obtendo informações da espécie do personagem
        const speciesQuestion = {
          id: `species_${index}`,
          question: `Qual é a espécie de ${character.name}?`,
          options: species.map((specie, i) => ({
            id: String.fromCharCode(65 + i), // A, B, C, D, ...
            text: `Espécie ${i + 1}`,
            correct: true,
          })),
          score: 10,
        };
  
        return speciesQuestion;
      });
  
      return questions.flat();
    } catch (error) {
      console.error('Erro ao buscar perguntas da API SWAPI:', error);
      return [];
    }
  }
  