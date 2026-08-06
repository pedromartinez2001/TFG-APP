import { useForm } from "react-hook-form";
import userService from "../services/userService";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import viruMark from "../images/viru-mark.svg";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      await userService.registerUser(data);
      navigate("/login");
    } catch (error) {
      console.log(error);
      setErrorMessage(
        error.response?.data?.message || "Error al iniciar sesión"
      );
    }
  };

  return (
    <Container className="register-page">
      <Card className="register-card">
        <Card.Body>
        <Link to="/" className="register-brand">
          <img src={viruMark} alt="" />
          <span><strong>VIRU</strong><small>Educación financiera</small></span>
        </Link>
        <div className="register-heading">
          <span className="page-eyebrow">Comienza hoy</span>
          <Card.Title>Crear una cuenta</Card.Title>
          <p>Registra tus movimientos y convierte tu presupuesto en un hábito.</p>
        </div>
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
          <Form.Group className="mb-3">
            <Form.Label>Nombre de Usuario</Form.Label>
            <Form.Control
              {...register("username", {
                required: "Nombre de usuario requerido.",
              })}
              type="text"
              placeholder="Nombre de Usuario"
            />
            <Form.Text className="text-danger">{errors.username?.message}</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              {...register("email", {
                required: "Email requerido.",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Ingrese un correo electrónico válido",
                },
              })}
              type="email"
              placeholder="Correo electrónico"
            />
            <Form.Text className="text-danger">{errors.email?.message}</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              {...register("password", {
                required: "Contraseña requerida.",
                minLength: {
                  value: 8,
                  message: "Contraseña mínima de 8 caracteres.",
                },
              })}
              type="password"
              placeholder="Contraseña"
            />
            <Form.Text className="text-danger">{errors.password?.message}</Form.Text>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Registrarse
          </Button>
          <div className="register-login-link">
            <span>¿Ya tienes una cuenta?</span>
            <Link to="/login">Inicia sesión</Link>
          </div>
        </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RegisterForm;
