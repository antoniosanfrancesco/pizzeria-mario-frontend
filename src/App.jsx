import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/navbar';
import Footer from './components/Footer';
import Menu from './components/Menu';
import GestioneMenu from './components/GestioneMenu';
import Login from './components/Login';
import './App.css';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'


//si evita che tramite indirizzo gestione si scavalchi il login
function ProtectedRoute({ children }) {
	const token = localStorage.getItem('token');

	//se il token non esiste rimanda l'utente al login 
	if(!token) {
		return <Navigate to='/login' replace />
	}

	//se il token esiste mostra la pagina richiesta
	return children;
}



function App() {
	useEffect(() => {
		AOS.init({
			duration: 800,
			once: true,
			offset: 100,
		});
	}, []);

  // Array di sicurezza da passare temporaneamente alla Navbar
  const categorieFisse = ["Pizze", "Primi", "Secondi", "Dolci", "Bevande"];

  return (
  <Router>
    {/* Questo div flessibile occupa SEMPRE almeno il 100% dell'altezza dello schermo */}
    <div className="d-flex flex-column min-vh-100">
      
      <NavBar categorie={categorieFisse} />

     
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Menu />} />
					<Route path="/login" element={<Login />} />
          <Route 
						path="/gestione" 
						element={
							<ProtectedRoute>
								<GestioneMenu/>
							</ProtectedRoute>
						} />
        </Routes>
      </main>

      <Footer />
      
    </div>
  </Router>
);
}

export default App;