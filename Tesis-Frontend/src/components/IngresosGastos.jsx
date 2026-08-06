import { useEffect, useState, useCallback, useMemo } from "react";
import ModalForm from "../components/ModalForm";
import { Button, Form, Table } from "react-bootstrap";
import dayjs from "dayjs";

const IngresosGastos = (props) => {
  const [view, setView] = useState([]);
  const [sortBy, setSortBy] = useState("default");

  const categoryLabels = useMemo(
    () =>
      Object.fromEntries(
        (props.options || []).map((option) => [option.value, option.label]),
      ),
    [props.options],
  );

  const getCategoryLabel = useCallback(
    (category) => {
      if (!category) return "Sin tipo";
      if (categoryLabels[category]) return categoryLabels[category];

      return category
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
    },
    [categoryLabels],
  );

  const sortedViews = useMemo(() => {
    const items = [...view];

    if (sortBy === "amount-desc") {
      return items.sort((a, b) => Number(b.amount) - Number(a.amount));
    }
    if (sortBy === "amount-asc") {
      return items.sort((a, b) => Number(a.amount) - Number(b.amount));
    }
    if (sortBy === "category-asc") {
      return items.sort((a, b) =>
        getCategoryLabel(a.category).localeCompare(
          getCategoryLabel(b.category),
          "es",
        ),
      );
    }
    if (sortBy === "category-desc") {
      return items.sort((a, b) =>
        getCategoryLabel(b.category).localeCompare(
          getCategoryLabel(a.category),
          "es",
        ),
      );
    }

    return items;
  }, [getCategoryLabel, sortBy, view]);

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
      <div className="records-table-heading">
        <h1>{props.title}</h1>
        {props.showCategory && (
          <Form.Select
            className="records-sort-select"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            aria-label="Ordenar gastos"
          >
            <option value="default">Orden original</option>
            <option value="amount-desc">Monto: mayor a menor</option>
            <option value="amount-asc">Monto: menor a mayor</option>
            <option value="category-asc">Tipo: A a Z</option>
            <option value="category-desc">Tipo: Z a A</option>
          </Form.Select>
        )}
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Concepto</th>
            {props.showCategory && <th>Tipo</th>}
            <th>Monto</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {sortedViews.map((view) => (
            <tr key={view._id}>
              <td>{view.description || view.category}</td>
              {props.showCategory && (
                <td>
                  <span className="expense-type-badge">
                    {getCategoryLabel(view.category)}
                  </span>
                </td>
              )}
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
            <td colSpan={props.showCategory ? 3 : 2}>
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
