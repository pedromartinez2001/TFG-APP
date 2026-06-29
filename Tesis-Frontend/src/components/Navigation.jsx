import { useEffect, useState, useCallback } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { useNavigate, Link, NavLink } from "react-router-dom";
import userService from "../services/userService";

const Navigation = () => {
  const [newUser, setNewUser] = useState(
    JSON.parse(localStorage.getItem("user")),
  );

  const navigate = useNavigate();

  // Función para cerrar sesión
  const closeSesion = useCallback(async () => {
    try {
      await userService.logoutUser();
    } catch {
      // Even if logout request fails, local cleanup should continue.
    }
    localStorage.removeItem("user");
    setNewUser(null);
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setNewUser(user);
  }, [closeSesion]);

  return (
    <Navbar
      bg="light"
      data-bs-theme="light"
      collapseOnSelect
      expand="md"
      className="p-2 p-sm-3 navbar-modern"
    >
      <Navbar.Brand className="navbar-brand-modern" as={Link} to="/">
        Gestión de Finanzas
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        {!newUser ? (
          <>
            <Nav className="align-items-start align-items-md-center navbar-links navbar-links-main me-auto">
              <Nav.Link as={NavLink} to="/" className="nav-link-modern">
                Inicio
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/calculadora"
                className="nav-link-modern"
              >
                Calculadora de Prestamo/Ahorro
              </Nav.Link>
              <Nav.Link as={NavLink} to="/aprender" className="nav-link-modern">
                Aprender
              </Nav.Link>
            </Nav>
            <Nav className="align-items-start align-items-md-center mt-2 mt-md-0 ms-md-auto navbar-links navbar-links-login">
              <Nav.Link as={NavLink} to="/login" className="nav-link-modern">
                Iniciar sesión
              </Nav.Link>
            </Nav>
          </>
        ) : (
          <>
            <Nav className="flex-grow-1 justify-content-md-evenly align-items-start align-items-md-center navbar-links navbar-links-main">
              <Nav.Link as={NavLink} to="/" className="nav-link-modern">
                Inicio
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/ingresos-gastos"
                className="nav-link-modern"
              >
                Ingresos y gastos
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/calculadora"
                className="nav-link-modern"
              >
                Calculadora de Prestamo/Ahorro
              </Nav.Link>
              <Nav.Link as={NavLink} to="/aprender" className="nav-link-modern">
                Aprender
              </Nav.Link>
              <Nav.Link as={NavLink} to="/avisos" className="nav-link-modern">
                Vencimiento de cuotas
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/metas-ahorro"
                className="nav-link-modern"
              >
                Metas de ahorro
              </Nav.Link>
            </Nav>
            <div
              className="d-flex flex-column flex-md-row align-items-md-center gap-2 mt-2 mt-md-0 navbar-user-wrap"
              style={{ minWidth: "fit-content" }}
            >
              <Navbar.Text className="navbar-user-text">
                Bienvenido: {newUser?.username}
              </Navbar.Text>
              <Button
                variant="danger"
                onClick={closeSesion}
                className="navbar-logout-btn"
              >
                Cerrar sesión
              </Button>
            </div>
          </>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
