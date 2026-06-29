import { useState, useEffect, useCallback } from "react";
import { Button as BsButton, Modal, Form, Table } from "react-bootstrap";
import dayjs from "dayjs";
import vencimientoService from "../services/vencimientoService";

const CATEGORIAS = [
  { value: "necesidades", label: "Necesidades" },
  { value: "deseos", label: "Deseos" },
  { value: "ahorro_deudas", label: "Ahorros / Deudas" },
];

const formatearGs = (valor) =>
  `Gs. ${Number(valor).toLocaleString("es-PY", { minimumFractionDigits: 0 })}`;

const RegistrosPagoMensualidades = () => {
  const [obligaciones, setObligaciones] = useState([]);
  const [mostrarCompletadas, setMostrarCompletadas] = useState(false);
  const [show, setShow] = useState(false);

  // Form state
  const [descripcion, setDescripcion] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [esCuotaFija, setEsCuotaFija] = useState(false);
  const [cantidadTotalCuotas, setCantidadTotalCuotas] = useState("");
  const [montoCuota, setMontoCuota] = useState("");
  const [categoria, setCategoria] = useState("necesidades");

  const resetForm = () => {
    setDescripcion("");
    setFechaVencimiento("");
    setEsCuotaFija(false);
    setCantidadTotalCuotas("");
    setMontoCuota("");
    setCategoria("necesidades");
  };

  const handleClose = () => {
    setShow(false);
    resetForm();
  };

  useEffect(() => {
    const fetchObligaciones = async () => {
      try {
        const data = await vencimientoService.getAll();
        setObligaciones(data);
      } catch (error) {
        console.error("Error al cargar obligaciones:", error);
      }
    };
    fetchObligaciones();
    window.addEventListener("update", fetchObligaciones);
    return () => window.removeEventListener("update", fetchObligaciones);
  }, []);

  const agregarObligacion = useCallback(async () => {
    if (!descripcion) {
      alert("Por favor, ingrese la descripción.");
      return;
    }
    if (!montoCuota) {
      alert("Por favor, ingrese el monto de la cuota.");
      return;
    }
    if (!fechaVencimiento) {
      alert("Por favor, seleccione la fecha de vencimiento.");
      return;
    }
    if (!esCuotaFija && !cantidadTotalCuotas) {
      alert("Por favor, ingrese la cantidad total de cuotas.");
      return;
    }

    const nueva = {
      descripcion,
      fechaVencimiento,
      esCuotaFija,
      cantidadTotalCuotas: esCuotaFija ? null : parseInt(cantidadTotalCuotas),
      montoCuota: parseFloat(montoCuota),
      categoria,
    };
    try {
      const saved = await vencimientoService.create(nueva);
      setObligaciones((prev) => [...prev, saved]);
      setShow(false);
      resetForm();
    } catch (error) {
      console.error("Error al agregar mensualidad:", error);
      alert("Error al agregar mensualidad");
    }
  }, [
    descripcion,
    fechaVencimiento,
    esCuotaFija,
    cantidadTotalCuotas,
    montoCuota,
    categoria,
  ]);

  const eliminarObligacion = useCallback(async (id) => {
    if (!window.confirm("¿Está seguro que quiere eliminar esta mensualidad?"))
      return;
    try {
      await vencimientoService.deleteData(id);
      setObligaciones((prev) => prev.filter((ob) => ob._id !== id));
    } catch (error) {
      console.error("Error al eliminar mensualidad:", error);
      alert("Error al eliminar mensualidad");
    }
  }, []);

  const pagarObligacion = useCallback(async (ob) => {
    try {
      const updated = await vencimientoService.update(ob._id, { pagado: true });
      setObligaciones((prev) =>
        prev.map((o) => (o._id === ob._id ? updated : o)),
      );
      alert(
        updated.completado
          ? `Mensualidad completada. Pagos totales: ${updated.pagosRealizados}.`
          : `Cuota pagada. Se creó un gasto para el próximo mes.`,
      );
    } catch (error) {
      console.error("Error al pagar mensualidad:", error);
      alert("Error al pagar mensualidad");
    }
  }, []);

  const visibles = obligaciones.filter(
    (ob) => mostrarCompletadas || !ob.completado,
  );

  const estadoInfo = (ob) => {
    if (ob.completado) return { label: "Completada", color: "#2563eb" };
    if (dayjs().isAfter(dayjs(ob.fechaVencimiento), "day"))
      return { label: "Vencida", color: "#dc2626" };
    return { label: "Al día", color: "#16a34a" };
  };

  return (
    <div>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <BsButton variant="primary" onClick={() => setShow(true)}>
          Agregar Mensualidad
        </BsButton>
        <Form.Check
          type="checkbox"
          label="Mostrar completadas"
          checked={mostrarCompletadas}
          onChange={(e) => setMostrarCompletadas(e.target.checked)}
        />
      </div>

      {/* Tabla */}
      <Table striped bordered hover className="table-mobile-stack">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Monto</th>
            <th>Categoría</th>
            <th>Vencimiento</th>
            <th>Estado</th>
            <th>Cuotas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {visibles.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center text-muted">
                No hay mensualidades registradas.
              </td>
            </tr>
          )}
          {visibles.map((ob) => {
            const { label, color } = estadoInfo(ob);
            const catLabel =
              CATEGORIAS.find((c) => c.value === ob.categoria)?.label ??
              ob.categoria;
            return (
              <tr key={ob._id} style={{ opacity: ob.completado ? 0.7 : 1 }}>
                <td data-label="Descripción">{ob.descripcion}</td>
                <td data-label="Monto">{formatearGs(ob.montoCuota)}</td>
                <td data-label="Categoría">{catLabel}</td>
                <td data-label="Vencimiento">
                  {dayjs(ob.fechaVencimiento).format("DD/MM/YYYY")}
                </td>
                <td data-label="Estado">
                  <span style={{ color, fontWeight: 600 }}>{label}</span>
                </td>
                <td data-label="Cuotas">
                  {ob.esCuotaFija
                    ? "Fija"
                    : `${ob.cantidadTotalCuotas} (${ob.pagosRealizados} pagadas)`}
                </td>
                <td data-label="Acciones">
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <BsButton
                      size="sm"
                      variant="success"
                      onClick={() => pagarObligacion(ob)}
                      disabled={ob.completado}
                    >
                      Pagar
                    </BsButton>
                    <BsButton
                      size="sm"
                      variant="outline-danger"
                      className="btn-delete-modern"
                      onClick={() => eliminarObligacion(ob._id)}
                      aria-label="Eliminar mensualidad"
                    >
                      Eliminar
                    </BsButton>
                  </div>
                </td>
              </tr>
            );
          })}
          {visibles.length > 0 && (
            <tr className="table-summary-row">
              <td data-label="Resumen" colSpan="2">
                <strong>
                  Total:{" "}
                  {formatearGs(
                    visibles.reduce((sum, ob) => sum + ob.montoCuota, 0),
                  )}
                </strong>
              </td>
              <td data-label="" colSpan="5"></td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Mensualidad</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Cuota del auto"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Monto de la cuota (Gs.)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingrese monto"
                value={montoCuota}
                onChange={(e) => setMontoCuota(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: "0.5rem",
                }}
              >
                {CATEGORIAS.map((opt) => {
                  const isSelected = categoria === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setCategoria(opt.value)}
                      style={{
                        border: isSelected
                          ? "2px solid var(--primary, #2563eb)"
                          : "1px solid #D0D7DE",
                        borderRadius: "8px",
                        background: isSelected
                          ? "rgba(37, 99, 235, 0.1)"
                          : "#fff",
                        color: "var(--text, #1e293b)",
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
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fecha de Vencimiento</Form.Label>
              <Form.Control
                type="date"
                value={fechaVencimiento}
                onChange={(e) => setFechaVencimiento(e.target.value)}
              />
            </Form.Group>

            <Form.Check
              type="checkbox"
              label="Es cuota fija"
              checked={esCuotaFija}
              onChange={(e) => setEsCuotaFija(e.target.checked)}
              className="mb-3"
            />

            {!esCuotaFija && (
              <Form.Group className="mb-3">
                <Form.Label>Cantidad total de cuotas</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ej: 12"
                  value={cantidadTotalCuotas}
                  onChange={(e) => setCantidadTotalCuotas(e.target.value)}
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <BsButton variant="secondary" onClick={handleClose}>
            Cancelar
          </BsButton>
          <BsButton variant="primary" onClick={agregarObligacion}>
            Agregar
          </BsButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RegistrosPagoMensualidades;
