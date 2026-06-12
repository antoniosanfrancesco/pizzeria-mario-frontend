import { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // MODIFICA: Importa useNavigate

const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5005' 
  : 'https://pizzeria-mario-backend.vercel.app';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errore, setErrore] = useState('');
  const [caricamento, setCaricamento] = useState(false);

  const navigate = useNavigate(); //  MODIFICA: Inizializza il navigatore

  const gestisciLogin = async (e) => {
    e.preventDefault();
    setCaricamento(true);
    setErrore('');

    try {
      const risposta = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({username: username, password: password})
      });

      const dati = await risposta.json();

      if (!risposta.ok) {
        throw new Error(dati.message || 'Credenziali errate');
      }

      // salvo il token se il login funziona
      localStorage.setItem('token', dati.token);

      //  MODIFICA: Navigazione fluida senza ricaricare la pagina
      navigate('/gestione'); 

    } catch (err) {
      setErrore(err.message);
    } finally {
      setCaricamento(false);
    }
  };

  return (
    <Container className='d-flex align-items-center justify-content-center' style={{minHeight: '70vh'}}>
      <Card style={{width: '100%', maxWidth: '400px'}} className='shadow p-4 border-0 rounded-5'>
        <Card.Body>
          <h3 className='text-center mb-4'>Accesso Admin</h3>

          {errore && <Alert variant="danger">{errore}</Alert>}

          <Form onSubmit={gestisciLogin}>
            <Form.Group className='mb-3'>
              <Form.Label>Username</Form.Label>
              <Form.Control 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder='Inserisci username'
              />  
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder='Inserisci Password'
              />  
            </Form.Group>

            <Button  type='submit' className='w-100 btn-custom-success' disabled={caricamento}>
              {caricamento ? 'Verifica in corso...' : 'Accedi'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  ); 
}

export default Login;