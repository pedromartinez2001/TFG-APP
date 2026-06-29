import { Button, Modal, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useState } from "react";
import dayjs from "dayjs";

const ModalForm = ({
  options,
  onSubmit,
  title,
  fecha,
  useRadioOptions = false,
  showDescription = false,
  categoryLabel = "Selecciona una opción",
}) => {
  const [show, setShow] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: dayjs().format("YYYY-MM-DD"), // Fecha de hoy por defecto
      category: "",
    },
  });
  const selectedCategory = watch("category");
  const minDate = dayjs(fecha).startOf("month").format("YYYY-MM-DD"); // Primer día del mes
  const maxDate = dayjs(fecha).endOf("month").format("YYYY-MM-DD"); // Último día del mes
  const handleClose = () => {
    (setShow(false), reset());
  };
  const handleShow = () => setShow(true);

  const handleFormSubmit = (data) => {
    onSubmit(data); // Llama a la función onSubmit pasada como prop
    handleClose(); // Cierra el modal después de enviar
    reset(); // Reinicia el formulario
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        {title}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(handleFormSubmit)}>
            {showDescription && (
              <Form.Group controlId="formDescription">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: Compra en supermercado"
                  {...register("description", { required: true })}
                />
              </Form.Group>
            )}

            <Form.Group controlId="formOption">
              <Form.Label>{categoryLabel}</Form.Label>
              {useRadioOptions ? (
                <div>
                  <input
                    type="hidden"
                    {...register("category", { required: true })}
                  />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                      gap: "0.5rem",
                    }}
                  >
                    {options.map((opt, index) => {
                      const isSelected = selectedCategory === opt.value;
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() =>
                            setValue("category", opt.value, {
                              shouldValidate: true,
                            })
                          }
                          style={{
                            border: isSelected
                              ? "2px solid var(--primary)"
                              : "1px solid #D0D7DE",
                            borderRadius: "8px",
                            background: isSelected
                              ? "rgba(37, 99, 235, 0.1)"
                              : "#fff",
                            color: "var(--text)",
                            padding: "0.75rem 0.5rem",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                  {errors.category && (
                    <div
                      style={{
                        color: "#DC2626",
                        marginTop: "0.5rem",
                        fontSize: "0.875rem",
                      }}
                    >
                      Selecciona una categoría.
                    </div>
                  )}
                </div>
              ) : (
                <Form.Control
                  as="select"
                  {...register("category", { required: true })}
                >
                  <option value="">Seleccione...</option>
                  {options.map((opt, index) => (
                    <option key={index} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Form.Control>
              )}
            </Form.Group>

            <Form.Group controlId="formAmount">
              <Form.Label>Monto</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingrese monto"
                {...register("amount", { required: true })}
              />
            </Form.Group>

            <Form.Group controlId="formDate">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                min={minDate} // Fecha mínima
                max={maxDate}
                {...register("date")}
              />
            </Form.Group>

            <Button
              style={{ marginTop: "1rem" }}
              variant="primary"
              type="submit"
            >
              Enviar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default ModalForm;
