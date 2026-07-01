import { BrowserRouter, Route, Routes } from "react-router-dom";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

import Renovation from "./Components/Renovation";
import Slider from "./Components/Slider";
import Home from "./Components/Home";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Renovation />
                <Slider />
                <Home/>
                {/* <Header /> */}

                {/* <NavBar1 /> */}
                {/* <Home /> */}
                {/* <Footer /> */}
              </>
            }
          />
        </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;
