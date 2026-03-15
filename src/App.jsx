import { Routes, Route } from 'react-router-dom';
import { ResultsProvider } from './context/ResultsContext';
import Home from './pages/Home';

export default function App() {
  return (
    <ResultsProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Testy se přidají později:
            <Route path="/test/:testId" element={<TestRouter />} />
            <Route path="/integrator" element={<Integrator />} />
        */}
      </Routes>
    </ResultsProvider>
  );
}
