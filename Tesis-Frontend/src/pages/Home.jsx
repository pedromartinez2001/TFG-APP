import { useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import alcanciaCerdito from "../images/alcancia_cerdito.png";
import grafico from "../images/grafico.png";

const herramientas = [
  {
    id: "ingresos-gastos",
    title: "Registro de ingresos y gastos",
    description:
      "Organiza tus movimientos mensuales y visualiza tu ahorro con información clara.",
    to: "/ingresos-gastos",
    badge: "Control",
    requiresLogin: true,
  },
  {
    id: "calculadora",
    title: "Calculadora de préstamos y ahorro",
    description:
      "Simula escenarios con sistemas de pago y ahorro compuesto para tomar mejores decisiones.",
    to: "/calculadora",
    badge: "Simulación",
    requiresLogin: false,
  },
  {
    id: "avisos",
    title: "Registro de pago de mensualidades",
    description:
      "Registra mensualidades, marca pagos y controla los próximos vencimientos.",
    to: "/avisos",
    badge: "Recordatorios",
    requiresLogin: true,
  },
  {
    id: "metas-ahorro",
    title: "Metas de ahorro",
    description:
      "Define objetivos, mide avance y sigue el ritmo mensual para cumplir tus metas.",
    to: "/metas-ahorro",
    badge: "Objetivos",
    requiresLogin: true,
  },
  {
    id: "aprender",
    title: "Módulo Aprender",
    description:
      "Espacio educativo para reforzar conceptos clave y mejorar tus hábitos financieros.",
    to: "/aprender",
    badge: "Educación",
    requiresLogin: false,
  },
];

const Home = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <Container className="home-page">
      <section className="home-hero">
        <Row className="align-items-center g-4">
          <Col md="6">
            <div className="image-container home-hero-image" data-aos="fade-up">
              <Image src={alcanciaCerdito} fluid />
            </div>
          </Col>
          <Col md="6">
            <h1>Educación financiera para decidir mejor</h1>
            <p className="home-lead">
              Esta aplicación te ayuda a entender tus hábitos de dinero con
              herramientas prácticas y una experiencia simple. La idea es que
              puedas aprender, planificar y actuar con más confianza en tu día a
              día.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <Button as={Link} to="/aprender" variant="primary">
                Ir a Aprender
              </Button>
              <Button as={Link} to="/calculadora" variant="outline-primary">
                Probar calculadora
              </Button>
            </div>
          </Col>
        </Row>
      </section>

      <section className="home-section" data-aos="fade-up">
        <h2>¿Por qué enfocarse en educación financiera?</h2>
        <Row className="g-3">
          <Col md={4}>
            <Card className="home-info-card h-100">
              <Card.Body>
                <h5>Más claridad</h5>
                <p>
                  Entender en qué entra y sale tu dinero te permite tomar
                  decisiones con criterio y no por impulso.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="home-info-card h-100">
              <Card.Body>
                <h5>Mejores hábitos</h5>
                <p>
                  Con seguimiento constante, puedes transformar pequeños ajustes
                  en resultados sostenibles.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="home-info-card h-100">
              <Card.Body>
                <h5>Objetivos alcanzables</h5>
                <p>
                  Definir metas y medir avance facilita mantener disciplina para
                  cumplir planes personales.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>

      <section className="home-section" data-aos="fade-up">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
          <h2 className="mb-0">Herramientas que ofrece la app</h2>
          <span className="home-hint">
            Disponibles para explorar según tu flujo
          </span>
        </div>

        <Row className="g-3">
          {herramientas.map((tool) => (
            <Col key={tool.id} xs={12} md={6} lg={4}>
              <Card className="home-tool-card h-100">
                <Card.Body className="d-flex flex-column">
                  <div className="mb-2">
                    <Badge
                      bg="primary-subtle"
                      text="primary"
                      className="home-tool-badge"
                    >
                      {tool.badge}
                    </Badge>
                  </div>
                  <Card.Title>{tool.title}</Card.Title>
                  <Card.Text className="home-tool-desc">
                    {tool.description}
                  </Card.Text>
                  <div className="mb-2">
                    {tool.requiresLogin ? (
                      <small className="text-danger fw-semibold">
                        Requiere inicio de sesión
                      </small>
                    ) : (
                      <small className="text-success fw-semibold">
                        Disponible sin iniciar sesión
                      </small>
                    )}
                  </div>
                  <Button
                    as={Link}
                    to={tool.to}
                    variant="outline-primary"
                    size="sm"
                    className="mt-auto"
                  >
                    Ver herramienta
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="home-section" data-aos="fade-up">
        <Row className="align-items-center g-4">
          <Col md="6">
            <h3>Empieza con pasos simples</h3>
            <p>
              Puedes comenzar registrando movimientos, luego usar la calculadora
              y finalmente fijar metas. Cada herramienta complementa a la otra
              para darte una visión más completa de tus finanzas personales.
            </p>
          </Col>
          <Col md="6">
            <div className="image-container home-hero-image" data-aos="fade-up">
              <Image src={grafico} fluid />
            </div>
          </Col>
        </Row>
      </section>
    </Container>
  );
};

export default Home;
