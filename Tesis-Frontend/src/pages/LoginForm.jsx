import { useForm } from "react-hook-form";
import { useState, useEffect, useRef, useCallback } from "react";
import userService from "../services/userService";
import { useNavigate, Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";

const LoginForm = () => {
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGoogleResponse = useCallback(
    async (response) => {
      try {
        const user = await userService.loginWithGoogle({
          credential: response.credential,
        });

        if (user && user.data) {
          localStorage.setItem("user", JSON.stringify(user.data));
          navigate("/ingresos-gastos");
        }
      } catch (error) {
        console.error("Error en login con Google:", error);
        setErrorMessage(
          error.response?.data?.message || "Error al iniciar sesión con Google",
        );
      }
    },
    [navigate],
  );

  const renderGoogleButton = useCallback(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId || !googleButtonRef.current) return;

    const existingScript = document.querySelector("script[data-google-gsi]");

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
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/ingresos-gastos");
    }
  }, [navigate]);

  useEffect(() => {
    renderGoogleButton();
  }, [renderGoogleButton]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const user = await userService.loginUser(data);
      if (user && user.data) {
        localStorage.setItem("user", JSON.stringify(user.data));
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
    <Container className="d-flex align-items-center justify-content-center vh-100">
      <Card style={{ width: "100%", maxWidth: "400px" }} className="p-4">
        <Card.Title className="text-center">Iniciar sesión</Card.Title>
        {errorMessage && (
          <Alert
            variant="danger"
            onClose={() => setErrorMessage("")}
            dismissible
          >
            {errorMessage}
          </Alert>
        )}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              placeholder="Ingrese un email"
              {...register("email", {
                required: "Email requerido",
              })}
            />
            <p className="text-danger">{errors.email?.message}</p>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Contraseña"
              name="password"
              {...register("password", { required: "Contraseña requerida" })}
            />
            <p className="text-danger">{errors.password?.message}</p>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Iniciar sesión
          </Button>

          <div className="mt-3" style={{ width: "100%" }}>
            <div
              ref={googleButtonRef}
              style={{ width: "100%", minHeight: "44px" }}
            />
          </div>

          <div className="text-center mt-3">
            <span style={{ color: "#64748B" }}>¿No tienes cuenta? </span>
            <Link to="/register" style={{ fontWeight: 600 }}>
              Regístrate
            </Link>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default LoginForm;
