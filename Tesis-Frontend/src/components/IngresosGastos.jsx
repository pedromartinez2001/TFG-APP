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

  const getCategoryColorClass = (category = "") => {
    const normalizedCategory = category.toLowerCase();
    const needs = [
      "necesidades",
      "alquiler",
      "comida",
      "transporte",
      "servicios",
      "salud",
      "educacion",
    ];
    const wants = ["deseos", "entretenimiento", "ropa", "otro"];
    const savings = ["ahorro_deudas", "ahorro", "deudas"];

    if (needs.includes(normalizedCategory)) return "expense-type-badge--needs";
    if (wants.includes(normalizedCategory)) return "expense-type-badge--wants";
    if (savings.includes(normalizedCategory)) {
      return "expense-type-badge--savings";
    }
    return "expense-type-badge--other";
  };

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
    if (sortBy === "date-desc") {
      return items.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
    }
    if (sortBy === "date-asc") {
      return items.sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());
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
    <section className="records-panel">
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
            <option value="date-desc">Fecha: más reciente</option>
            <option value="date-asc">Fecha: más antigua</option>
          </Form.Select>
        )}
      </div>
      <Table striped bordered hover responsive className="records-table table-mobile-stack">
        <thead>
          <tr>
            <th>Concepto</th>
            {props.showCategory && <th>Tipo</th>}
            <th>Monto</th>
            <th>Fecha</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {sortedViews.length === 0 && (
            <tr className="records-empty-row">
              <td colSpan={props.showCategory ? 5 : 4}>
                No hay {props.title.toLowerCase()} registrados en este mes.
              </td>
            </tr>
          )}
          {sortedViews.map((view) => (
            <tr key={view._id}>
              <td className="record-cell record-cell--concept" data-label="Concepto">
                {view.description || getCategoryLabel(view.category)}
              </td>
              {props.showCategory && (
                <td className="record-cell record-cell--type" data-label="Tipo">
                  <span
                    className={`expense-type-badge ${getCategoryColorClass(view.category)}`}
                  >
                    {getCategoryLabel(view.category)}
                  </span>
                </td>
              )}
              <td className="record-cell record-cell--amount" data-label="Monto">{`Gs. ${view.amount.toLocaleString("es-PY", {
                minimumFractionDigits: 0,
              })}`}</td>
              <td className="record-cell record-cell--date" data-label="Fecha">
                {dayjs(view.date).format("DD/MM/YYYY")}
              </td>
              <td className="record-cell record-cell--actions" data-label="Acciones">
                <div className="records-actions">
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
          <tr className="table-summary-row records-total-row">
            <td colSpan={props.showCategory ? 5 : 4}>
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
          </tr>
        </tbody>
      </Table>
      <div className="records-create-action">
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
    </section>
  );
};

export default IngresosGastos;
