import { Routes, Route } from 'react-router-dom';
import { ResultsProvider } from './context/ResultsContext';
import Home from './pages/Home';
import Big5Test from './tests/big5/Big5Test';
import IqTest from './tests/iq/IqTest';
import EqTest from './tests/eq/EqTest';
import CreativeTest from './tests/creative/CreativeTest';
import StrengthsTest from './tests/strengths/StrengthsTest';
import CareerTest from './tests/career/CareerTest';

export default function App() {
  return (
    <ResultsProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test/big5" element={<Big5Test />} />
        <Route path="/test/iq" element={<IqTest />} />
        <Route path="/test/eq" element={<EqTest />} />
        <Route path="/test/creative" element={<CreativeTest />} />
        <Route path="/test/strengths" element={<StrengthsTest />} />
        <Route path="/test/career" element={<CareerTest />} />
      </Routes>
    </ResultsProvider>
  );
}
