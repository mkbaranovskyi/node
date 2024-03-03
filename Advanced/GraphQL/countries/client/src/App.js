import './App.css';
import { AppoloClient, InMemoryCache, ApolloProvider, ApolloClient } from '@apollo/client';
import { DisplayData } from './components/display-data';

function App() {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: 'http://localhost:4000/graphql',
  });

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <DisplayData />
      </div>
    </ApolloProvider>
  );
}

export default App;
