import { useState, useEffect } from 'react';
import { Container, Form, Button, Table, Row, Col, Badge, Card} from 'react-bootstrap';
import { Link } from 'react-router-dom';

function GestioneMenu() {
  const [menu, setMenu] = useState([]);
  const API_URL = 'http://localhost:5001/api/piatti';

  const statoInizialeForm = {nome: '', prezzo: '', ingredienti: '', categoria: 'Pizze', vegano: false};
  const [formData, setFormData] = useState(statoInizialeForm);

  const [idInModifica, setIdInModifica] = useState(null);

  // carica i piatti all'avvio (Resta pubblica, non serve il token)
  const caricaPiatti = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(dati => setMenu(dati))
      .catch(err => console.error("Errore nel caricamento:", err ));
  };

  useEffect(() => {
    caricaPiatti();
  }, []);

  // gestisce i cambiamenti nei campi del form 
  const gestisciCambioInput = (e) => {
    const {name, value, type, checked} = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked: value
    });
  };

  // invia i dati (inserimento o modifica) - PROTETTA 
  const gestisciInvio = (e) => {
    e.preventDefault();

    const metodo = idInModifica ? 'PUT' : 'POST';
    const urlSpecifico = idInModifica ? `${API_URL}/${idInModifica}`: API_URL;
    
    // 1. Recuperiamo il token di autenticazione
    const token = localStorage.getItem('token');

    fetch(urlSpecifico, {
      method: metodo,
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': `Bearer ${token}` // Spediamo il token negli headers
      },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if(!res.ok) throw new Error("Errore nel salvataggio. Sessione scaduta o non autorizzata.");
        return res.json();
      })
      .then(() => {
        caricaPiatti(); // refresha la tabella
        setFormData(statoInizialeForm); //svuota il form
        setIdInModifica(null); //resetta lo stato di modifica
      })
      .catch(err => alert(err.message));
  }

  // attiva la modifica 
  const attivaModifica = (piatto) => {
    setIdInModifica(piatto._id);
    setFormData({
      nome: piatto.nome,
      prezzo: piatto.prezzo,
      ingredienti: piatto.ingredienti,
      categoria: piatto.categoria,
      vegano: piatto.vegano
    });
  };

  // cancella un piatto - PROTETTA 🔒
  const cancellaPiatto = (id) => {
    if(window.confirm("Sei sicuro di voler eliminare questo piatto dal menu?")) {
      
      // 1. Recuperiamo il token di autenticazione
      const token = localStorage.getItem('token');

      fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` // Spediamo il token negli headers
        }
      })
        .then(res => {
          if(!res.ok) throw new Error("Errore nella cancellazione. Sessione scaduta o non autorizzata.");
          caricaPiatti(); //refresh dei piatti
        })
        .catch(err => alert(err.message));
    }
  };

  return (
    <Container className='my-5'>
      <h2 className='text-center mb-4'>Gestione del Menu</h2>
      <div className="text-center mb-4">
        <Link to="/" className="btn btn-secondary">
         Torna al Menu Pubblico
        </Link>
      </div>

      {/* Inserimento o modifica */}
      <Card className="p-4 shadow-sm mb-5 bg-light">
        <h4>{idInModifica ? 'Modifica Piatto' : 'Aggiungi un Nuovo Piatto'}</h4>
        <Form onSubmit={gestisciInvio}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nome Piatto</Form.Label>
                <Form.Control type="text" name="nome" value={formData.nome} onChange={gestisciCambioInput} required placeholder="Es. Pizza Diavola" />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Prezzo (€)</Form.Label>
                <Form.Control type="number" step="0.1" name="prezzo" value={formData.prezzo} onChange={gestisciCambioInput} required placeholder="Es. 8.50" />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Categoria</Form.Label>
                <Form.Select name="categoria" value={formData.categoria} onChange={gestisciCambioInput}>
                  <option value="Pizze">Pizze</option>
                  <option value="Primi">Primi</option>
                  <option value="Secondi">Secondi</option>
                  <option value="Dolci">Dolci</option>
                  <option value="Bevande">Bevande</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label>Ingredienti</Form.Label>
                <Form.Control type="text" name="ingredienti" value={formData.ingredienti} onChange={gestisciCambioInput} required placeholder="Es. Pomodoro, mozzarella, salame piccante" />
              </Form.Group>
            </Col>
            <Col md={12} className="d-flex align-items-center justify-content-between">
              <Form.Check type="checkbox" label="Questo piatto è Vegano 🌱" name="vegano" checked={formData.vegano} onChange={gestisciCambioInput} id="checkbox-vegano" />
              <div>
                {idInModifica && (
                  <Button variant="secondary" className="me-2" onClick={() => { setFormData(statoInizialeForm); setIdInModifica(null); }}>
                    Annulla
                  </Button>
                )}
                <Button className="btn-custom-success" variant={idInModifica ? "warning" : "success"} type="submit">
                  {idInModifica ? 'Salva Modifiche' : 'Inserisci nel Menu'}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* TABELLA DI RIEPILOGO */}
      <h4>📋 Piatti Attualmente nel Menu</h4>
      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Prezzo</th>
            <th>Ingredienti</th>
            <th>Note</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {menu.map(piatto => (
            <tr key={piatto._id}>
              <td><strong>{piatto.nome}</strong></td>
              <td><Badge bg="info" text="dark">{piatto.categoria}</Badge></td>
              <td>€{Number(piatto.prezzo).toFixed(2)}</td>
              <td className="small text-muted">{piatto.ingredienti}</td>
              <td>{piatto.vegano ? <Badge bg="success">Vegano 🌱</Badge> : '-'}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => attivaModifica(piatto)}>
                  Modifica
                </Button>
                <Button variant="danger" size="sm" onClick={() => cancellaPiatto(piatto._id)}>
                  Elimina
                </Button>
              </td>
            </tr>
          ))}
          {menu.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center text-muted">Nessun piatto nel menu. Aggiungine uno sopra!</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  )
}

export default GestioneMenu;