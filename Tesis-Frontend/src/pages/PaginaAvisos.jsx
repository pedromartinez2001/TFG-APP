import { Container } from "react-bootstrap";
import RegistrosPagoMensualidades from "../components/RegistrosPagoMensualidades";

const PaginaAvisos = () => {
  return (
    <Container className="page-container">
      <header className="page-header">
        <span className="page-eyebrow">Mantén tus pagos al día</span>
        <h1>Registro de mensualidades</h1>
        <p>Organiza cuotas, vencimientos y pagos desde un solo lugar.</p>
      </header>
      <section className="content-panel"><RegistrosPagoMensualidades /></section>
    </Container>
  );
};

export default PaginaAvisos;
