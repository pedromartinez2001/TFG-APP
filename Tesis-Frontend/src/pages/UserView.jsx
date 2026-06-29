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
    <Container style={{ padding: " 0.1rem" }}>
      <h1 style={{ display: "flex", justifyContent: "center" }}>
        Listado de ingresos y gastos
      </h1>
      <Row style={{ display: "flex", justifyContent: "center" }}>
        <Col>
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
      <Container>
        <Row style={{ justifyContent: "space-between", display: "flex" }}>
          <Col>
            <IngresosGastos
              title={"Ingresos"}
              service={incomeService}
              options={optionsIngresos}
              fecha={fecha}
              extraInfo={`Ahorro: Gs. ${ahorroMes.toLocaleString("es-PY")}`}
              extraInfoColor="#16A34A"
            />
          </Col>
          <Col>
            <IngresosGastos
              title={"Gastos"}
              service={expenseService}
              options={optionsGastos}
              fecha={fecha}
              useRadioOptions={true}
              showDescription={true}
              categoryLabel={"Categoría"}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <MiDoughnutChart
              fecha={fecha}
              service={expenseService}
              incomeService={incomeService}
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
};
export default UserView;
