import React, { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

import { Books } from './Books';
import { getRealm } from './database/realm';
import { Container, Logo, List, CenterView, ButtonText, Input, Title, Button } from './styles';

export const App = () => {
  const [ name, setName ] = useState('');
  const [ price, setPrice ] = useState('');
  const [ idEdit, setIdEdit ] = useState(null);
  const [ books, setBooks ] = useState([]);

  useEffect(() => {
    const loadBooks = async() => {
      const realm = await getRealm();
      const data = realm.objects('Book');
      setBooks(data);
    }

    loadBooks();
  }, []);

  const saveBook = async() => {
    const realm = await getRealm();
    
    // criando id
    const id = realm.objects('Book').sorted(
      'id', true /* em ordem decrescente */
    ).length > 0
    ? realm.objects('Book').sorted('id', true)[0].id + 1
    : 1;

    // criando json das informações
    const dadosLivro = {
      id,
      name,
      price,
    };

    // salvando
    realm.write(() => {
      realm.create('Book', dadosLivro);
    });
  }

  const addBook = async() => {
    if(!name || !price) {
      alert('Preencha todos os campos!');
      return;
    }

    try {
      await saveBook();
      clearInfos();
    }
    catch(error) { alert(error) }
  }

  const changeInfosToEdit = async({ id, name, price }) => {
    setIdEdit(id);
    setName(name);
    setPrice(price);
  }

  const editBook = async() => {
    if(!idEdit) {
      alert('Você ainda não selecionou nenhum livro para editar!');
      return;
    }
    const realm = await getRealm();

    const response = {
      id: idEdit,
      name,
      price,
    }

    await realm.write(() => {
      realm.create('Book', response, 'modified');
    });

    const dadosAlterados = await realm.objects('Book').sorted('id', false);
    setBooks(dadosAlterados);
    clearInfos();
  }

  const deleteBook = async(data) => {
    const realm = await getRealm();
    const ID = data.id;

    realm.write(() => {
      // verificando se existe
      if(realm.objects('Book').filtered('id =' + ID).length > 0) {
        // deletando
        realm.delete(
          realm.objects('Book').filtered('id =' + ID),
        );
      }
    });

    const atualBooks = await realm.objects('Book').sorted('id', false);
    setBooks(atualBooks);
  }

  const clearInfos = () => {
    setName('');
    setPrice('');
    setIdEdit(null);
    Keyboard.dismiss();
  }

  return (
    <Container>
      <Logo>Próximos livros</Logo>

      <Title>Nome</Title>
      <Input
      autoCaptalize='none'
      autoCorrect={false}
      value={name}
      onChangeText={(ev) => setName(ev)}/>

      <Title>Preço</Title>
      <Input
      autoCaptalize='none'
      autoCorrect={false}
      value={price}
      onChangeText={(ev) => setPrice(ev)}/>

      <CenterView>
        <Button onPress={ idEdit ? clearInfos : addBook }>
          <ButtonText>{ idEdit ? 'Cancelar' : 'Cadastrar' }</ButtonText>
        </Button>

        {idEdit && <Button onPress={editBook}>
          <ButtonText>Editar</ButtonText>
        </Button>}
      </CenterView>

      <List
        showVerticalScrollIndicator={false}
        keyboardShouldPersistTops='handled'
        data={books}
        keyExtractor={ item => String(item.id) }
        renderItem={ ({ item }) => <Books data={item} editInfos={changeInfosToEdit} deleteInfos={deleteBook}/> }
      />

    </Container>
  );
};
