import { Container } from "react-bootstrap";
import CalculadoraIntereses from "../components/Calculadora_Intereses";

const PaginaCalc = () => {
  return (
    <Container className="page-container">
      <header className="page-header">
        <span className="page-eyebrow">Simula antes de decidir</span>
        <h1>Calculadora de intereses</h1>
        <p>Compara préstamos y alternativas de ahorro con resultados claros.</p>
      </header>
      <section className="content-panel"><CalculadoraIntereses /></section>
    </Container>
  );
};

export default PaginaCalc;
