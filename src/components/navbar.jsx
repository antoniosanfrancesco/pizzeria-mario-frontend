import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

function NavBar({ categorie }) {
  const navigate = useNavigate();
  const isLogged = !!localStorage.getItem('token');

  const gestisciLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Navbar className="navbar-custom" variant="dark" expand="lg" collapseOnSelect>
      <Container>
        <Navbar.Brand as={Link} to="/" style={{color: 'white'}}>Pizzeria Da Mario</Navbar.Brand>
        
        <Navbar.Toggle aria-controls="responsive-navbar-nav" className='ms-auto' />
        
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="w-100 justify-content-end align-items-lg-center text-end">
            {categorie && categorie.map((cat, index) => (
              <a 
                key={index} 
                href={`#${cat.toLowerCase()}`} 
                className="nav-link text-light me-2"
              >
                {cat}
              </a>
            ))}
          </Nav>
          
          <Nav className="align-items-center">
            {isLogged && (
              <>
                <Link to="/gestione" className="nav-link text-warning me-3 fw-bold">
                  Pannello Gestione
                </Link>
                <Button variant="danger" size="sm" onClick={gestisciLogout} className="mt-2 mt-lg-0">
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;