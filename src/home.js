import React, { useState } from 'react';
import { StatusBar, Image, TextInput, TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const [nome, setNome] = useState('');
  const navigation = useNavigation();

  const handleJogarPress = () => {
    // Verifica se o nome não está vazio
    if (nome.trim() === '') {
      alert('Por favor, insira seu nome antes de jogar!');
    } else {
      // Navega para a tela 'quiz' passando o nome como parâmetro
      navigation.navigate('Quiz', { nome });
    }
  };  

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/fundo.jpg')}
        style={styles.backgroundImage}
      />
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain" 
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Insira o seu nome"
          value={nome}
          onChangeText={setNome}
        />
        <TouchableOpacity style={styles.button} onPress={handleJogarPress}>
          <Text style={styles.buttonText}>Jogar</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
      },
      backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
      },
      logo: {
        width: 400,
        height: 400,
        marginBottom: 20,
      },
      inputContainer: {
        width: '80%',
        marginBottom: 20,
      },
      input: {
        backgroundColor: 'white',
        width: '40%',  // Largura do TextInput é 100% do inputContainer
        height: 40,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
        alignSelf: 'center',
      },
      button: {
        backgroundColor: 'blue',
        height: 40,
        width: '40%',  // Largura do botão é 100% do inputContainer
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
      },
      buttonText: {
        color: 'white',
        fontSize: 18,
      },
});
