import { useEffect, useState, useCallback } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { useNavigate, Link, NavLink } from "react-router-dom";
import userService from "../services/userService";
import viruMark from "../images/viru-mark.svg";

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
      collapseOnSelect
      expand="md"
      className="p-2 p-sm-3 navbar-modern"
      style={{ backgroundColor: "var(--card)" }}
    >
      <Navbar.Brand className="navbar-brand-modern" as={Link} to="/">
        <img className="navbar-brand-mark" src={viruMark} alt="" />
        <span className="navbar-brand-copy">
          <span className="navbar-brand-name">VIRU</span>
          <span className="navbar-brand-tagline">Educación financiera</span>
        </span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse
        id="responsive-navbar-nav"
        className={!newUser ? "navbar-collapse-guest" : undefined}
      >
        {!newUser ? (
          <Nav className="align-items-start align-items-md-center navbar-links navbar-links-guest">
              <Nav.Link as={NavLink} to="/" className="nav-link-modern">
                Inicio
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/calculadora"
                className="nav-link-modern"
                title="Calculadora de préstamo y ahorro"
              >
                Calculadora
              </Nav.Link>
              <Nav.Link as={NavLink} to="/aprender" className="nav-link-modern">
                Aprender
              </Nav.Link>
              <Nav.Link as={NavLink} to="/presupuesto" className="nav-link-modern">
                Presupuesto
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/login"
                className="nav-link-modern nav-link-login"
              >
                Iniciar sesión
              </Nav.Link>
          </Nav>
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
                title="Ingresos y gastos"
              >
                Movimientos
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/calculadora"
                className="nav-link-modern"
                title="Calculadora de préstamo y ahorro"
              >
                Calculadora
              </Nav.Link>
              <Nav.Link as={NavLink} to="/aprender" className="nav-link-modern">
                Aprender
              </Nav.Link>
              <Nav.Link as={NavLink} to="/presupuesto" className="nav-link-modern">
                Presupuesto
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/avisos"
                className="nav-link-modern"
                title="Vencimiento de cuotas"
              >
                Vencimientos
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
                <span className="navbar-user-greeting">Hola, </span>
                <strong className="navbar-username">{newUser?.username}</strong>
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
