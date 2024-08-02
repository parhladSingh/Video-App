import {Routes , Route} from 'react-router-dom'
import './App.css'
import LobyScreen from './screens/LobyScreen'
import RoomPage from './screens/Room'


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LobyScreen />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
      </Routes>
    </div>
  );
}

export default App;
