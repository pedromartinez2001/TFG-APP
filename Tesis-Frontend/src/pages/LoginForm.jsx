import { useForm } from "react-hook-form";
import { useState } from "react";
import { useEffect } from "react";
import userService from "../services/userService";
import { useNavigate, Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";

const LoginForm = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/ingresos-gastos");
    }
  }, [navigate]);
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
