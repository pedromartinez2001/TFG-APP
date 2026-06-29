import { Container } from "react-bootstrap";
import RegistrosPagoMensualidades from "../components/RegistrosPagoMensualidades";

const PaginaAvisos = () => {
  return (
    <Container style={{ minHeight: "80vh", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        Registros de Pago de Mensualidades
      </h1>
      <RegistrosPagoMensualidades />
    </Container>
  );
};

export default PaginaAvisos;
