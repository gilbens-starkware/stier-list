import './App.css';
import { StarkitchenApp } from './components/StarkitchenApp';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { StarknetProvider } from './providers/StarknetProvider';

// The main file of the Starkitchen app. It wraps the StarkitchenApp component with the StarknetProvider and ErrorBoundary components.
// ErrorBoundary - a component that catches errors in its children components and displays a
//                 fallback UI, you probably won't need to modify it.
// StarknetProvider - a component that wraps the main app component with some Starknet related
//                    configuration, you probably won't need to modify it either.
// StarkitchenApp - the main component of the Starkitchen app, this is where you will write your app.
const App = () => (
  <ErrorBoundary>
    <StarknetProvider>
      <StarkitchenApp />
    </StarknetProvider>
  </ErrorBoundary>
);

export default App;
