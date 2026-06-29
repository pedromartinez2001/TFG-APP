import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Container, Form, Modal, Table } from "react-bootstrap";
import dayjs from "dayjs";
import savingGoalService from "../services/savingGoalService";

const formatGs = (value) =>
  `Gs. ${Number(value || 0).toLocaleString("es-PY", {
    minimumFractionDigits: 0,
  })}`;

const PaginaMetasAhorro = () => {
  const [metas, setMetas] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [selectedMeta, setSelectedMeta] = useState(null);
  const [nombre, setNombre] = useState("");
  const [montoObjetivo, setMontoObjetivo] = useState("");
  const [plazoMeses, setPlazoMeses] = useState("");
  const [montoAgregar, setMontoAgregar] = useState("");

  const resetCreateForm = () => {
    setNombre("");
    setMontoObjetivo("");
    setPlazoMeses("");
  };

  const fetchMetas = useCallback(async () => {
    try {
      const data = await savingGoalService.getAll();
      setMetas(data);
    } catch (error) {
      console.error("Error al cargar metas de ahorro:", error);
    }
  }, []);

  useEffect(() => {
    fetchMetas();
  }, [fetchMetas]);

  const crearMeta = async () => {
    if (!nombre.trim()) {
      alert("Ingrese un nombre para la meta.");
      return;
    }

    if (!montoObjetivo || Number(montoObjetivo) <= 0) {
      alert("Ingrese un monto objetivo válido.");
      return;
    }

    if (!plazoMeses || Number(plazoMeses) <= 0) {
      alert("Ingrese un plazo en meses válido.");
      return;
    }

    try {
      const nuevaMeta = await savingGoalService.create({
        nombre: nombre.trim(),
        montoObjetivo: Number(montoObjetivo),
        plazoMeses: Number(plazoMeses),
      });
      setMetas((prev) => [nuevaMeta, ...prev]);
      setShowCreate(false);
      resetCreateForm();
    } catch (error) {
      console.error("Error al crear meta:", error);
      alert("No se pudo crear la meta de ahorro.");
    }
  };

  const eliminarMeta = async (id) => {
    const confirmacion = window.confirm(
      "¿Está seguro que quiere eliminar esta meta de ahorro?",
    );

    if (!confirmacion) return;

    try {
      await savingGoalService.deleteData(id);
      setMetas((prev) => prev.filter((meta) => meta._id !== id));
    } catch (error) {
      console.error("Error al eliminar meta:", error);
      alert("No se pudo eliminar la meta de ahorro.");
    }
  };

  const abrirModalAhorro = (meta) => {
    setSelectedMeta(meta);
    setMontoAgregar("");
    setShowSave(true);
  };

  const sumarAhorro = async () => {
    if (!selectedMeta) return;

    if (!montoAgregar || Number(montoAgregar) <= 0) {
      alert("Ingrese un monto válido para sumar al ahorro.");
      return;
    }

    try {
      const updatedMeta = await savingGoalService.update(selectedMeta._id, {
        amountToAdd: Number(montoAgregar),
      });
      setMetas((prev) =>
        prev.map((meta) => (meta._id === updatedMeta._id ? updatedMeta : meta)),
      );
      setShowSave(false);
      setSelectedMeta(null);
      setMontoAgregar("");
    } catch (error) {
      console.error("Error al sumar ahorro:", error);
      alert("No se pudo registrar el ahorro.");
    }
  };

  const metasCalculadas = useMemo(
    () =>
      metas.map((meta) => {
        const ahorroMensual = meta.montoObjetivo / meta.plazoMeses;
        const mesesTranscurridos = Math.max(
          0,
          dayjs().diff(dayjs(meta.fechaInicio), "month"),
        );
        const ahorroEsperado = Math.min(
          meta.montoObjetivo,
          ahorroMensual * mesesTranscurridos,
        );
        const faltantePlan = Math.max(0, ahorroEsperado - meta.montoAhorrado);
        const faltanteMeta = Math.max(
          0,
          meta.montoObjetivo - meta.montoAhorrado,
        );

        let estadoTexto = "En tiempo";
        let estadoColor = "#2563EB";

        if (meta.completada || meta.montoAhorrado >= meta.montoObjetivo) {
          estadoTexto = "Meta cumplida";
          estadoColor = "#16A34A";
        } else if (faltantePlan > 0) {
          estadoTexto = `Debe ahorrar ${formatGs(faltantePlan)}`;
          estadoColor = "#DC2626";
        }

        return {
          ...meta,
          ahorroMensual,
          faltantePlan,
          faltanteMeta,
          estadoTexto,
          estadoColor,
        };
      }),
    [metas],
  );

  return (
    <Container style={{ minHeight: "80vh", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        Metas de ahorro
      </h1>

      <div style={{ marginBottom: "1rem" }}>
        <Button variant="primary" onClick={() => setShowCreate(true)}>
          Crear meta de ahorro
        </Button>
      </div>

      <Table striped bordered hover className="table-mobile-stack">
        <thead>
          <tr>
            <th>Meta</th>
            <th>Objetivo</th>
            <th>Plazo</th>
            <th>Ahorro mensual</th>
            <th>Ahorrado</th>
            <th>Falta para cumplir</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {metasCalculadas.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center text-muted">
                No hay metas de ahorro registradas.
              </td>
            </tr>
          )}
          {metasCalculadas.map((meta) => (
            <tr key={meta._id}>
              <td data-label="Meta">
                <div style={{ fontWeight: 600 }}>{meta.nombre}</div>
                <div style={{ fontSize: "0.85rem", color: "#64748B" }}>
                  Inicio: {dayjs(meta.fechaInicio).format("DD/MM/YYYY")}
                </div>
              </td>
              <td data-label="Objetivo">{formatGs(meta.montoObjetivo)}</td>
              <td data-label="Plazo">{meta.plazoMeses} mes(es)</td>
              <td data-label="Ahorro mensual">
                {formatGs(meta.ahorroMensual)}
              </td>
              <td data-label="Ahorrado">{formatGs(meta.montoAhorrado)}</td>
              <td data-label="Falta para cumplir">
                {formatGs(meta.faltanteMeta)}
              </td>
              <td
                data-label="Estado"
                style={{ color: meta.estadoColor, fontWeight: 600 }}
              >
                {meta.estadoTexto}
              </td>
              <td data-label="Acciones">
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                  }}
                >
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => abrirModalAhorro(meta)}
                    disabled={meta.completada}
                  >
                    Ahorrado
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    className="btn-delete-modern"
                    onClick={() => eliminarMeta(meta._id)}
                    aria-label="Eliminar meta"
                  >
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showCreate} onHide={() => setShowCreate(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear meta de ahorro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de la meta</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Fondo de emergencia"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Monto que quiere ahorrar</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ej: 3000000"
                value={montoObjetivo}
                onChange={(e) => setMontoObjetivo(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Plazo en meses</Form.Label>
              <Form.Control
                type="number"
                min="1"
                placeholder="Ej: 6"
                value={plazoMeses}
                onChange={(e) => setPlazoMeses(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowCreate(false);
              resetCreateForm();
            }}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={crearMeta}>
            Guardar meta
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showSave}
        onHide={() => {
          setShowSave(false);
          setSelectedMeta(null);
          setMontoAgregar("");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Registrar ahorro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ marginBottom: "0.75rem", color: "#475569" }}>
            Meta: <strong>{selectedMeta?.nombre}</strong>
          </p>
          <Form.Group>
            <Form.Label>Monto ahorrado</Form.Label>
            <Form.Control
              type="number"
              min="1"
              placeholder="Ingrese el monto ahorrado"
              value={montoAgregar}
              onChange={(e) => setMontoAgregar(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowSave(false);
              setSelectedMeta(null);
              setMontoAgregar("");
            }}
          >
            Cancelar
          </Button>
          <Button variant="success" onClick={sumarAhorro}>
            Guardar ahorro
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PaginaMetasAhorro;
