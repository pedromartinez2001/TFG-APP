import { useForm } from "react-hook-form";
import { useState, useEffect, useRef, useCallback } from "react";
import userService from "../services/userService";
import { useNavigate, Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { BarChart3, CheckCircle2, ShieldCheck } from "lucide-react";
import viruMark from "../images/viru-mark.svg";
import useAuth from "../hooks/useAuth";

const LoginForm = () => {
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { user: authenticatedUser, isChecking, establishSession } = useAuth();

  const handleGoogleResponse = useCallback(
    async (response) => {
      try {
        const user = await userService.loginWithGoogle({
          credential: response.credential,
        });
        if (user?.data) {
          establishSession(user.data);
          navigate("/ingresos-gastos");
        }
      } catch (error) {
        console.error("Error en login con Google:", error);
        setErrorMessage(
          error.response?.data?.message || "Error al iniciar sesión con Google",
        );
      }
    },
    [establishSession, navigate],
  );

  const renderGoogleButton = useCallback(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || !googleButtonRef.current) return;

    const initializeGoogleButton = () => {
      if (!window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
        logo_alignment: "left",
        width: "100%",
      });
    };

    const existingScript = document.querySelector("script[data-google-gsi]");
    if (existingScript) {
      initializeGoogleButton();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.dataset.googleGsi = "true";
    script.onload = initializeGoogleButton;
    document.body.appendChild(script);
  }, [handleGoogleResponse]);

  useEffect(() => {
    if (!isChecking && authenticatedUser) navigate("/ingresos-gastos");
  }, [authenticatedUser, isChecking, navigate]);

  useEffect(() => {
    renderGoogleButton();
  }, [renderGoogleButton]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setErrorMessage("");
      const user = await userService.loginUser(data);
      if (user?.data) {
        establishSession(user.data);
        navigate("/ingresos-gastos");
      }
    } catch (error) {
      console.error("Error en login:", error);
      setErrorMessage(
        error.response?.data?.message || "Error al iniciar sesión",
      );
    }
  };

  return (
    <Container className="login-page">
      <Row className="login-shell g-0">
        <Col lg={6} className="login-showcase">
          <div className="login-showcase-content">
            <Link to="/" className="login-brand">
              <img src={viruMark} alt="" />
              <span><strong>VIRU</strong><small>Educación financiera</small></span>
            </Link>
            <div className="login-showcase-copy">
              <span className="login-eyebrow">Tus finanzas, más claras</span>
              <h1>Convierte tus movimientos en mejores decisiones.</h1>
              <p>
                Accede a tus ingresos, gastos y metas en un solo lugar para
                entender cada mes y avanzar con confianza.
              </p>
              <ul>
                <li><CheckCircle2 /> Control mensual de ingresos y gastos</li>
                <li><BarChart3 /> Visualización simple de tus hábitos</li>
                <li><ShieldCheck /> Información personal protegida</li>
              </ul>
            </div>
          </div>
        </Col>

        <Col lg={6} className="login-form-column">
          <Card className="login-card">
            <Card.Body>
              <div className="login-form-heading">
                <span className="login-mobile-brand">VIRU · Educación financiera</span>
                <h2>Bienvenido de nuevo</h2>
                <p>Ingresa tus datos para continuar con tu planificación.</p>
              </div>

              {errorMessage && (
                <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible>
                  {errorMessage}
                </Alert>
              )}

              <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    autoComplete="email"
                    placeholder="nombre@correo.com"
                    isInvalid={Boolean(errors.email)}
                    {...register("email", {
                      required: "El correo electrónico es obligatorio",
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    autoComplete="current-password"
                    placeholder="Ingresa tu contraseña"
                    isInvalid={Boolean(errors.password)}
                    {...register("password", {
                      required: "La contraseña es obligatoria",
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="login-submit-btn w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
                </Button>

                <div className="login-divider"><span>o continúa con</span></div>
                <div className="login-google-wrap">
                  <div ref={googleButtonRef} className="login-google-button" />
                </div>

                <div className="login-register-link">
                  <span>¿Todavía no tienes una cuenta?</span>
                  <Link to="/register">Crear cuenta gratis</Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
