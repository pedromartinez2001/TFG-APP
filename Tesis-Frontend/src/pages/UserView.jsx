import IngresosGastos from "../components/IngresosGastos";
import expenseService from "../services/expenseService";
import incomeService from "../services/incomeService";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { Container, Row, Col } from "react-bootstrap";
import MiDoughnutChart from "../components/DonnutChart";

dayjs.locale("es");

const UserView = () => {
  const [fecha, setFecha] = useState(new Date());
  const [ahorroMes, setAhorroMes] = useState(0);
  const [mobileSection, setMobileSection] = useState("expenses");
  const optionsIngresos = [
    { value: "salario", label: "Salario" },
    { value: "freelance", label: "Trabajo Freelance" },
    { value: "negocio", label: "Ingreso por Negocio" },
    { value: "alquiler", label: "Alquiler de Propiedades" },
    { value: "inversiones", label: "Ingresos por Inversiones" },
    { value: "intereses", label: "Intereses Bancarios" },
    { value: "dividendos", label: "Dividendos" },
    { value: "regalos", label: "Regalos o Donaciones" },
    { value: "bonos", label: "Bonos" },
    { value: "comisiones", label: "Comisiones de Ventas" },
    { value: "otro", label: "Otro" },
  ];

  const optionsGastos = [
    { value: "necesidades", label: "Necesidades" },
    { value: "deseos", label: "Deseos" },
    { value: "ahorro_deudas", label: "Ahorros / Deudas" },
  ];

  const calcularAhorroMes = useCallback(async () => {
    try {
      const [ingresos, gastos] = await Promise.all([
        incomeService.getAll(),
        expenseService.getAll(),
      ]);

      const totalIngresosMes = ingresos
        .filter((item) => dayjs(item.date).isSame(fecha, "month"))
        .reduce((acc, item) => acc + item.amount, 0);

      const totalGastosMes = gastos
        .filter((item) => dayjs(item.date).isSame(fecha, "month"))
        .reduce((acc, item) => acc + item.amount, 0);

      setAhorroMes(Math.max(totalIngresosMes - totalGastosMes, 0));
    } catch (error) {
      console.error("Error calculando ahorro mensual:", error);
      setAhorroMes(0);
    }
  }, [fecha]);

  useEffect(() => {
    calcularAhorroMes();
    window.addEventListener("update", calcularAhorroMes);
    return () => {
      window.removeEventListener("update", calcularAhorroMes);
    };
  }, [calcularAhorroMes]);

  return (
    <Container className="page-container movements-page">
      <header className="page-header">
        <span className="page-eyebrow">Tu mes en números</span>
        <h1>Ingresos y gastos</h1>
        <p>Registra tus movimientos y entiende cómo se distribuye tu dinero.</p>
      </header>
      <Row className="justify-content-center mb-4">
        <Col xs="auto" className="month-picker-panel">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DatePicker
              label="Elige un mes"
              openTo="month"
              views={["year", "month"]}
              value={dayjs(fecha)}
              onChange={(value) => setFecha(value)}
            />
          </LocalizationProvider>
        </Col>
      </Row>
      <div className="movements-content">
        <div className="movement-mobile-tabs" role="tablist" aria-label="Ver movimientos">
          <button
            type="button"
            role="tab"
            aria-selected={mobileSection === "income"}
            className={mobileSection === "income" ? "active" : ""}
            onClick={() => setMobileSection("income")}
          >
            Ingresos
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileSection === "expenses"}
            className={mobileSection === "expenses" ? "active" : ""}
            onClick={() => setMobileSection("expenses")}
          >
            Gastos
          </button>
        </div>
        <Row className="g-4">
          <Col xs={12} className={`movement-section movement-section--income ${mobileSection === "income" ? "is-mobile-active" : ""}`}>
            <IngresosGastos
              title={"Ingresos"}
              service={incomeService}
              options={optionsIngresos}
              fecha={fecha}
              extraInfo={`Ahorro: Gs. ${ahorroMes.toLocaleString("es-PY")}`}
              extraInfoColor="#16A34A"
            />
          </Col>
          <Col xs={12} className={`movement-section movement-section--expenses ${mobileSection === "expenses" ? "is-mobile-active" : ""}`}>
            <IngresosGastos
              title={"Gastos"}
              service={expenseService}
              options={optionsGastos}
              fecha={fecha}
              useRadioOptions={true}
              showDescription={true}
              showCategory={true}
              categoryLabel={"Categoría"}
            />
          </Col>
        </Row>
        <Row className="mt-4">
          <Col xs={12}>
            <section className="movement-charts-panel">
              <div className="movement-charts-heading">
                <span className="page-eyebrow">Distribución del mes</span>
                <h2>Así se comportan tus finanzas</h2>
                <p>Compara tus resultados con una distribución financiera saludable.</p>
              </div>
            <MiDoughnutChart
              fecha={fecha}
              service={expenseService}
              incomeService={incomeService}
            />
            </section>
          </Col>
        </Row>
      </div>
    </Container>
  );
};
export default UserView;
