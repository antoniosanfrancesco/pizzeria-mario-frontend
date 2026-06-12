import { Container, Col, Card, Row, Badge } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import fotoPizza from '../assets/img/pizza.jpg';

function Menu() {
  
  const [menu, setMenu] = useState([]);
  const [caricamento, setCaricamento] = useState(true);

  useEffect(() => {
    fetch('https://pizzeria-mario-backend.vercel.app/api/piatti')
      .then(res => res.json())
      .then(dati => {
        setMenu(dati);
        setCaricamento(false);
      })
      .catch(err => {
        console.error("Errore nel caricamento:", err);
        setCaricamento(false);
      });
  }, []);

  
  const categorie = [...new Set(menu?.map(p => p.categoria))];

  if (caricamento) {
    return <Container className='text-center my-5'><h3>Caricamento del menu in corso... </h3></Container>;
  }

  return (
		
		<Container>
				<Row className='mb-4'>
					<Col xs={12}>
						<img
							src={fotoPizza}
							className="img-fluid w-100 shadow-sm"
							style={{ 
								height: '300px', 
								objectFit: 'cover', 
								borderRadius: '24px'
        			}}
							data-aos='fade-up'
						/>
					</Col>
				</Row>
				<h2 className="text-center mb-5 mt-4 pt-6" data-aos='fade-up'>Il Nostro Menu</h2>

				{Array.isArray(categorie) && Array.isArray(menu) ? (
				
				categorie?.map(cat => (
					<div key={cat} className="mb-5">
						<h3 id={cat} className=" p-2 border-bottom pb-2 mb-4 card-piatto rounded-3" data-aos='fade-up'>{cat}</h3>
						<Row>
							{/* Cicliamo sui piatti che appartengono a QUESTA categoria */}
							{menu?.filter(p => p.categoria === cat).map(piatto => (
								<Col key={piatto._id} xs={12} md={6} lg={4} className='mb-4'>
									<Card className='h-100 shadow-sm rounded-5' data-aos='fade-up'>
										<Card.Body className='border-0'>
											<div className='d-flex justify-content-between align-items-start'>
												<Card.Title>{piatto.nome}</Card.Title>
												<span className='fw-bold'>€{Number(piatto.prezzo).toFixed(2)}</span>
											</div>
											<div 
												className="my-2" 
												style={{ 
													borderBottom: '1px solid #85937a', 
													opacity: 0.4                     
												}} 
											/>
											<Card.Text className='text-muted small'>{piatto.ingredienti}</Card.Text>
											{piatto.vegano && <Badge bg='success'>Vegano 🌱</Badge>}
										</Card.Body>
									</Card>
								</Col>
							))}
						</Row>
					</div>
				)) 
				) : (
					<p className="text-center text-muted my-5">
            Il server gratuito sta impiegando più tempo del previsto a svegliarsi. 
            Il menu apparirà automaticamente tra pochi istanti...
          </p>

				)}	
				{Array.isArray(menu) && menu.length === 0 && (
					<p className="text-center text-muted">Il menu è attualmente vuoto. Aggiungi dei piatti dalla pagina di gestione!</p>
				)}
			</Container>
  );
}

export default Menu;