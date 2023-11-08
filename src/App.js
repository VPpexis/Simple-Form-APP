import './App.css';
import DashboardPage from './screens/DashboardPage';
import ReportPage from './screens/ReportPage';
import { Route, Router, Routes } from 'react-router-dom';
import TopNav from './components/TopNav.js';
import FormUI from './/screens/FormUI.js';
import FinishUI from './/screens/FinishUI.js';
import BarChartButton from './components/BarChartButton/BarChartButton';

function App() {
  return (
      <div>
        <TopNav />
        <Routes>
          <Route path='/' element={<FormUI />}></Route>
          <Route path='/finish' element={<FinishUI />}></Route>
          <Route path='/dashboard' element={<DashboardPage />}></Route>
          <Route path='/dashboard/report/:id' element={<ReportPage />}></Route>
          <Route path='/button' element={<BarChartButton />}></Route>
        </Routes>
      </div>
  );
}

export default App;
