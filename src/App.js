import { Routes, Route } from "react-router-dom"; 

import Footer from "./components/footer";
import Header from "./components/header";
import MainPage from "./pages/MainPage";
import MyAccount from "./pages/myAccount";
import PetsAdd from "./pages/petsAdd";
import PetsSearch from "./pages/petsSearch";


import { AuthProvider } from './components/AuthContext'; // Импортируйте AuthProvider
import SearcPet from "./components/SearcPet";


const App = () => {
  return (
    <AuthProvider>
      <div className="w-100">
      <Header />
      <div >
        <Routes> 
          <Route path="/" element={<MainPage />} />
          <Route path="/myAccount" element={<MyAccount />} />
          <Route path="/petsAdd" element={<PetsAdd />} />
          <Route path="/petsSearch" element={<PetsSearch />} />
          <Route path="/searcpet" element={<SearcPet />} />
        </Routes>
      </div>
      <Footer />
    </div>
    </AuthProvider>
  );
};

export default App;
