import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import './global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ScreenContent title="Home" path="App.tsx"></ScreenContent>
        <StatusBar style="auto" />
      </QueryClientProvider>
    </>
  );
}
