import NavigationButtons from "./NavigationButtons";
import Content from "./Content";
import './NavigationButtons.css'
import { useNavigate } from 'react-router-dom';
import Login from "./Login";
function App() {
  const navigate = useNavigate();
  return (
    <div className="App">
    {
      localStorage.getItem('token') == null?
      <Login />
      :
      <div>
        <div className="stick_div"><NavigationButtons /></div>
        <Content />
      </div>
    }
    </div>
  );
}

export default App;
