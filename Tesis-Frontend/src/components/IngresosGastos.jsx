import { useEffect, useState, useCallback } from "react";
import ModalForm from "../components/ModalForm";
import { Button, Table } from "react-bootstrap";
import dayjs from "dayjs";

const IngresosGastos = (props) => {
  const [view, setView] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await props.service.getAll();
        const filteredViews = result.filter((item) =>
          dayjs(item.date).isSame(props.fecha, "month"),
        );
        setView(filteredViews);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [props.fecha, props.service]);

  const handleCreate = useCallback(
    (data) => {
      props.service
        .create(data)
        .then((response) => {
          const updatedViews = [...view, response];
          setView(updatedViews);
          const event = new Event("update");
          window.dispatchEvent(event);
        })
        .catch((error) => console.error("Create error:", error));
    },
    [view, props.service],
  );

  const handleDelete = useCallback(
    (data) => {
      const confirmacion = window.confirm(
        `¿Está seguro que quiere eliminar este elemento?`,
      );
      if (confirmacion) {
        props.service
          .deleteData(data._id)
          .then((response) => {
            const updatedViews = view.filter(
              (view) => view._id !== response._id,
            );
            setView(updatedViews);
            const event = new Event("update");
            window.dispatchEvent(event);
          })
          .catch((error) => console.error("Delete error:", error));
      }
    },
    [view, props.service],
  );

  return (
    <div>
      <h1>{props.title}</h1>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Concepto</th>
            <th>Monto</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {view.map((view) => (
            <tr key={view._id}>
              <td>{view.description || view.category}</td>
              <td>{`Gs. ${view.amount.toLocaleString("es-PY", {
                minimumFractionDigits: 0,
              })}`}</td>
              <td>
                <div style={{ justifyContent: "center", display: "flex" }}>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    className="btn-delete-modern"
                    onClick={() => handleDelete(view)}
                    aria-label="Eliminar elemento"
                  >
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="2">
              <strong>
                Total:{" "}
                {`Gs. ${view
                  .reduce((acumulador, view) => acumulador + view.amount, 0)
                  .toLocaleString("es-PY", { minimumFractionDigits: 0 })}`}
              </strong>
              {props.extraInfo && (
                <div
                  style={{
                    marginTop: "0.35rem",
                    fontSize: "0.9rem",
                    color: props.extraInfoColor || "#64748B",
                  }}
                >
                  {props.extraInfo}
                </div>
              )}
            </td>
            <td></td>
          </tr>
        </tbody>
      </Table>
      <div style={{ marginTop: "1rem" }}>
        <ModalForm
          options={props.options}
          onSubmit={handleCreate}
          title={"Crear"}
          fecha={props.fecha}
          useRadioOptions={props.useRadioOptions}
          showDescription={props.showDescription}
          categoryLabel={props.categoryLabel}
        />
      </div>
    </div>
  );
};

export default IngresosGastos;
