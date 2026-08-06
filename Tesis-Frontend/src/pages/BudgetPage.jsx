import { useMemo, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CheckCircle2, PiggyBank, ShoppingBag, WalletCards } from "lucide-react";
import { formatThousandsInput, parseThousandsInput } from "../utils/numberFormat";

const formatGs = (amount) =>
  `Gs. ${Math.round(amount).toLocaleString("es-PY", {
    maximumFractionDigits: 0,
  })}`;

const budgetCategories = [
  {
    key: "needs",
    percentage: 50,
    title: "Necesidades",
    description:
      "Gastos esenciales para vivir y cumplir tus obligaciones mensuales.",
    examples: "Vivienda, alimentación, servicios, salud y transporte.",
    icon: WalletCards,
  },
  {
    key: "wants",
    percentage: 30,
    title: "Deseos",
    description:
      "Gastos que mejoran tu estilo de vida, pero que puedes ajustar.",
    examples: "Salidas, entretenimiento, compras, viajes y suscripciones.",
    icon: ShoppingBag,
  },
  {
    key: "savings",
    percentage: 20,
    title: "Ahorro y deudas",
    description:
      "Dinero para construir estabilidad y reducir compromisos financieros.",
    examples: "Fondo de emergencia, metas, inversión y pago extra de deudas.",
    icon: PiggyBank,
  },
];

const BudgetPage = () => {
  const [householdType, setHouseholdType] = useState("single");
  const [salary, setSalary] = useState("");
  const [partnerSalary, setPartnerSalary] = useState("");
  const [showResults, setShowResults] = useState(false);

  const totalIncome = useMemo(() => {
    const ownIncome = parseThousandsInput(salary);
    const secondIncome = householdType === "couple" ? parseThousandsInput(partnerSalary) : 0;
    return ownIncome + secondIncome;
  }, [householdType, partnerSalary, salary]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (totalIncome > 0) setShowResults(true);
  };

  const changeHouseholdType = (type) => {
    setHouseholdType(type);
    setShowResults(false);
    if (type === "single") setPartnerSalary("");
  };

  return (
    <Container className="budget-page">
      <section className="budget-hero">
        <span className="budget-eyebrow">Planifica antes de gastar</span>
        <h1>Construye tu presupuesto con la regla 50/30/20</h1>
        <p>
          Distribuye tus ingresos mensuales de manera simple y descubre cuánto
          puedes destinar a tus necesidades, deseos y futuro financiero.
        </p>
      </section>

      <Row className="g-4 align-items-start">
        <Col lg={5}>
          <Card className="budget-form-card">
            <Card.Body>
              <h2>Calcula tu distribución</h2>
              <p className="budget-muted">
                Indica si planificas tus finanzas de forma individual o en pareja.
              </p>

              <Form onSubmit={handleSubmit}>
                <div className="budget-household-options" role="group" aria-label="Tipo de presupuesto">
                  <button
                    type="button"
                    className={householdType === "single" ? "active" : ""}
                    onClick={() => changeHouseholdType("single")}
                  >
                    Presupuesto individual
                  </button>
                  <button
                    type="button"
                    className={householdType === "couple" ? "active" : ""}
                    onClick={() => changeHouseholdType("couple")}
                  >
                    Presupuesto en pareja
                  </button>
                </div>

                <Form.Group className="mt-4">
                  <Form.Label>Tu salario mensual</Form.Label>
                  <div className="budget-input-wrap">
                    <span>Gs.</span>
                    <Form.Control
                      type="text"
                      inputMode="numeric"
                      value={salary}
                      onChange={(event) => {
                        setSalary(formatThousandsInput(event.target.value));
                        setShowResults(false);
                      }}
                      placeholder="Ej: 4.500.000"
                      required
                    />
                  </div>
                </Form.Group>

                {householdType === "couple" && (
                  <Form.Group className="mt-3">
                    <Form.Label>Salario mensual de tu pareja</Form.Label>
                    <div className="budget-input-wrap">
                      <span>Gs.</span>
                      <Form.Control
                        type="text"
                        inputMode="numeric"
                        value={partnerSalary}
                        onChange={(event) => {
                          setPartnerSalary(formatThousandsInput(event.target.value));
                          setShowResults(false);
                        }}
                        placeholder="Ej: 3.500.000"
                        required
                      />
                    </div>
                  </Form.Group>
                )}

                {householdType === "couple" && totalIncome > 0 && (
                  <div className="budget-household-total">
                    Ingreso total del hogar: <strong>{formatGs(totalIncome)}</strong>
                  </div>
                )}

                <Button className="w-100 mt-4" size="lg" type="submit">
                  Calcular mi presupuesto
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={7}>
          <div className={`budget-results ${showResults ? "is-ready" : ""}`}>
            <div className="budget-results-header">
              <div>
                <span>Ingreso mensual considerado</span>
                <strong>{showResults ? formatGs(totalIncome) : "Completa tus datos"}</strong>
              </div>
              <div className="budget-rule-chip">50 / 30 / 20</div>
            </div>

            <div className="budget-category-list">
              {budgetCategories.map((category) => {
                const Icon = category.icon;
                const amount = totalIncome * (category.percentage / 100);
                return (
                  <article key={category.key} className={`budget-category budget-category--${category.key}`}>
                    <div className="budget-category-icon"><Icon size={23} /></div>
                    <div className="budget-category-copy">
                      <div className="budget-category-title">
                        <h3>{category.percentage}% {category.title}</h3>
                        <strong>{showResults ? formatGs(amount) : "—"}</strong>
                      </div>
                      <p>{category.description}</p>
                      <small>{category.examples}</small>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </Col>
      </Row>

      <section className="budget-funnel">
        <div className="budget-funnel-copy">
          <span className="budget-eyebrow">El cálculo es solo el comienzo</span>
          <h2>Convierte este plan en un hábito mensual</h2>
          <p>
            Crea una cuenta gratuita para registrar tus ingresos y gastos,
            comparar tus movimientos con el presupuesto y medir cuánto consigues ahorrar.
          </p>
          <Button as={Link} to="/register" size="lg">
            Crear mi cuenta gratis
          </Button>
          <small>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link></small>
        </div>
        <ol className="budget-funnel-steps">
          <li><CheckCircle2 /><span><strong>1. Calcula</strong> una distribución realista.</span></li>
          <li><CheckCircle2 /><span><strong>2. Regístrate</strong> para guardar tu progreso.</span></li>
          <li><CheckCircle2 /><span><strong>3. Anota</strong> tus movimientos cada mes.</span></li>
        </ol>
      </section>
    </Container>
  );
};

export default BudgetPage;
