import React from 'react';

import { Container, Name, Price, Button, ButtonText, CenterView } from './styles';

export const Books = ({ data, editInfos, deleteInfos }) => {
  return (
    <Container>
      <Name>{data.id} - {data.name}</Name>
      <Price>R$ {data.price}</Price>

      <CenterView>
        <Button onPress={() => editInfos(data)}>
          <ButtonText>Editar</ButtonText>
        </Button>

        <Button onPress={() => deleteInfos(data)}>
          <ButtonText>Excluir</ButtonText>
        </Button>
      </CenterView>
    </Container>
  );
}
