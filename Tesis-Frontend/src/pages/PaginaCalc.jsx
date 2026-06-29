import { Container } from "react-bootstrap";
import CalculadoraIntereses from "../components/Calculadora_Intereses";

const PaginaCalc = () => {
  return (
    <Container style={{ minHeight: "80vh", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        Calculadora de Intereses
      </h1>
      <CalculadoraIntereses />
    </Container>
  );
};

export default PaginaCalc;
