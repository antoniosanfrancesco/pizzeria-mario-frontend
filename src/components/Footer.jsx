import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';


function Footer () {
	return (
		<footer className='bg-dark text.light py-5 mt-5 border-top border-secondary footer-custom'>
			<Container>
				<Row className='gy-4 text center text-md-start'>

					{/* chi siamo */}
					<Col xs={12} md={4}>
						<h5 className='text-white fw-bold mb-3'>Pizzeria Da Mario</h5>
						<p className='small text-white'>
							Dal 1990 portiamo in tavola la vera tradizione italiana. 
              Ingredienti freschi, passione e ricette tramandate di generazione in generazione.
						</p>
					</Col>

					{/* orari di apertura */}
					<Col xs={12} md={4}>
						<h5 className='text-white text-uppercase fw-bold mb-3 small tracking-wider'>🕒 Orari di Apertura</h5>
						<ul className="list-unstyled text-muted small lh-lg">
              <li className="fw-bold text-white"><span className="fw-bold text-white">Mar - Dom:</span> 12:30 - 15:00</li>
              <li className="fw-bold text-white"><span className="fw-bold text-white">Sera:</span> 19:30 - 23:30</li>
              <li className="text-danger"><span className="fw-bold">Lunedì:</span> Chiuso</li>
            </ul>
 					</Col>

					{/* Colonna 3: Contatti e Dove Siamo */}
          <Col xs={12} md={4}>
            <h5 className="text-uppercase fw-bold text-white mb-3 small tracking-wider">📞 Contatti</h5>
            <ul className="list-unstyled text-muted small lh-lg">
              <li className="fw-bold text-white">📍 Via Roma 12, Milano</li>
              <li className="fw-bold text-white">📞 Tel: +39 02 1234567</li>
              <li className="fw-bold text-white">✉️ Email: info@ristorantedamario.com</li>
            </ul>
          </Col>
				</Row>

				{/* Linea di separazione */}
        <hr className="bg-secondary my-4" />

        {/* Copyright in fondo */}
       <div className="text-white d-flex flex-column flex-sm-row justify-content-between align-items-center text-muted small text-center">
					<p className="text-white mb-2 mb-sm-0">
						{/* 🔑 IL TUO PASSAGGIO SEGRETO: se non sei loggato, la © diventa un link invisibile */}
						{!localStorage.getItem('token') ? (
							<Link 
								to="/login" 
								className="text-white text-decoration-none fw-bold"
								style={{ cursor: 'default', marginRight: '4px' }}
							>
								&copy;
							</Link>
						) : (
							// Se sei già loggato, torna a essere un testo normale non cliccabile
							<span style={{ marginRight: '4px' }}>&copy;</span>
						)}
						
						{new Date().getFullYear()} Ristorante Da Mario. Tutti i diritti riservati.
					</p>
					
					<div className="d-flex gap-3">
						<a href="#privacy" className="text-white text-decoration-none hover-white">Privacy Policy</a>
						<a href="#cookies" className="text-white text-decoration-none hover-white">Cookie Policy</a>
					</div>
				</div>
			</Container>
		</footer>
	)
}

export default Footer;