# booking

Aplicação desenvolvida com Vue 3, Vuetify, Pinia, Vue Router e typescript .

## Configuração do Projeto

```sh
npm install
```

### Para compilar e Rodar o Projeto localmente

```sh
npm run dev
```

### Para rodar o Mock da api feita com Json-Server

```sh
npm run backend
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Escolhas de design e arquitetura

O foco do projeto foi apresentar um comportamento o mais próximo possível de uma aplicação real, levando em conta as limitações de não ter um back-end. Não acredito que aplicar tantas regras de negócio no front-end seja ideal, mas foi necessário para simular um ambiente real e demonstrar a capacidade de trabalhar tratando dados complexos.

As chamadas foram feitas para manter a consistência dos dados. A primeira, retornando apenas as cidades, foi para simular um comportamento comum em sites de hotéis, onde o campo apresenta uma lista com destinos populares. Isso também ajudou a limitar o comportamento do usuário sem causar fricção ao tentar executar uma tarefa. Por esse motivo, na segunda tela, já disponibilizei um controle maior de personalização ao usuário.

O Pinia foi usado para manter o estado entre as telas, permitindo que o usuário navegue sem ter que pesquisar novamente as informações.

Optei por focar mais em apresentar uma aplicação funcional, em vez de uma estilização mais elaborada, mas mantive a ideia de responsividade em toda a aplicação.

Organizei o código separando funções e componentes que usei ou poderia usar em mais de um lugar. Poderia componentizar ainda mais, mas o objetivo é manter os prazos de entrega combinados.

Obrigado.
