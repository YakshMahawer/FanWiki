import NavigationButtons from "./NavigationButtons";
import Content from "./Content";
import './NavigationButtons.css'
function App() {
  return (
    <div className="App">
      <div className="stick_div"><NavigationButtons /></div>
      <Content />
    </div>
  );
}

export default App;
