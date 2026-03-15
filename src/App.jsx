import { Routes, Route } from 'react-router-dom';
import { ResultsProvider } from './context/ResultsContext';
import Home from './pages/Home';
import Big5Test from './tests/big5/Big5Test';

export default function App() {
  return (
    <ResultsProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test/big5" element={<Big5Test />} />
      </Routes>
    </ResultsProvider>
  );
}
