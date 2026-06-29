import { useEffect, useState, useCallback } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Container } from "react-bootstrap";
import dayjs from "dayjs";

Chart.register(...registerables, ChartDataLabels);

const MiDoughnutChart = (props) => {
  const [gastos, setGastos] = useState([]);
  const [ingresos, setIngresos] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const [resultGastos, resultIngresos] = await Promise.all([
        props.service.getAll(),
        props.incomeService.getAll(),
      ]);

      const filteredGastos = resultGastos.filter((item) =>
        dayjs(item.date).isSame(props.fecha, "month"),
      );

      const filteredIngresos = resultIngresos.filter((item) =>
        dayjs(item.date).isSame(props.fecha, "month"),
      );

      setGastos(filteredGastos);
      setIngresos(filteredIngresos);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }, [props.service, props.incomeService, props.fecha]);

  useEffect(() => {
    fetchData();
    window.addEventListener("update", fetchData);
    return () => {
      window.removeEventListener("update", fetchData);
    };
  }, [fetchData]);

  const necesidades = gastos.filter(
    (gasto) =>
      gasto.category === "necesidades" ||
      gasto.category === "alquiler" ||
      gasto.category === "comida" ||
      gasto.category === "transporte" ||
      gasto.category === "servicios" ||
      gasto.category === "salud" ||
      gasto.category === "educacion",
  );
  const totalNecesidades =
    necesidades.reduce((total, gasto) => total + gasto.amount, 0) || 0;

  const deseos = gastos.filter(
    (gasto) =>
      gasto.category === "deseos" ||
      gasto.category === "entretenimiento" ||
      gasto.category === "ropa" ||
      gasto.category === "otro",
  );
  const totalDeseos =
    deseos.reduce((total, gasto) => total + gasto.amount, 0) || 0;

  const ahorroDeudas = gastos.filter(
    (gasto) =>
      gasto.category === "ahorro_deudas" ||
      gasto.category === "ahorro" ||
      gasto.category === "deudas",
  );
  const totalAhorroDeudas =
    ahorroDeudas.reduce((total, gasto) => total + gasto.amount, 0) || 0;
  const totalIngresos =
    ingresos.reduce((total, ingreso) => total + ingreso.amount, 0) || 0;
  const totalGastos =
    gastos.reduce((total, gasto) => total + gasto.amount, 0) || 0;
  const ahorroPorDiferencia = Math.max(totalIngresos - totalGastos, 0);
  const totalAhorros = totalAhorroDeudas + ahorroPorDiferencia;

  const totalDistribucion = totalNecesidades + totalDeseos + totalAhorros;
  const hasData = totalDistribucion > 0;

  const data = hasData
    ? {
        labels: ["Necesidades", "Deseos", "Ahorro"],
        datasets: [
          {
            label: "Distribución mensual",
            data: [totalNecesidades, totalDeseos, totalAhorros],
            backgroundColor: [
              "#22C55E" /* verde - necesidades */,
              "#F59E0B" /* amarillo/naranja - deseos */,
              "#3B82F6" /* azul - ahorro/deudas */,
            ],
            hoverOffset: 4,
          },
        ],
      }
    : {
        labels: ["Sin datos"],
        datasets: [
          {
            label: "Sin datos",
            data: [100], // Valor predeterminado para llenar el gráfico
            backgroundColor: ["#e0e0e0"], // Color gris o cualquier otro para el gráfico vacío
            hoverOffset: 4,
          },
        ],
      };
  const options = {
    plugins: {
      datalabels: {
        display: (context) => {
          if (!hasData) return false;
          const value = context.dataset.data[context.dataIndex] || 0;
          if (value <= 0) return false;
          const percentage = (value / totalDistribucion) * 100;
          return percentage >= 5;
        },
        formatter: (value) => {
          if (!hasData) return ""; // No mostrar etiquetas si no hay datos
          const percentage =
            ((value / totalDistribucion) * 100).toFixed(0) + "%";
          return percentage;
        },
        color: "#fff",
        clamp: true,
        font: {
          weight: "bold",
          size: 11,
        },
      },
    },
    type: "doughnut",
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
    },
  };

  const healthyData = {
    labels: ["Necesidades", "Deseos", "Ahorro"],
    datasets: [
      {
        label: "Distribución saludable",
        data: [50, 30, 20],
        backgroundColor: ["#22C55E", "#F59E0B", "#3B82F6"],
        hoverOffset: 4,
      },
    ],
  };

  const healthyOptions = {
    responsive: true,
    plugins: {
      datalabels: {
        formatter: (value) => `${value}%`,
        color: "#fff",
        clamp: true,
        font: {
          weight: "bold",
          size: 11,
        },
      },
      legend: {
        position: "top",
      },
    },
  };

  return (
    <Container
      style={{
        minHeight: "14rem",
        maxWidth: "100%",
        margin: "0 auto",
        padding: "0",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          alignItems: "start",
        }}
      >
        <div
          style={{ maxWidth: "clamp(180px, 40vw, 240px)", margin: "0 auto" }}
        >
          <div
            style={{
              minHeight: "2.2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "0.4rem",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "transparent",
                textAlign: "center",
                visibility: "hidden",
              }}
            >
              Un grafico saludable deberia verse asi:
            </p>
          </div>
          <Doughnut data={data} options={options} />
        </div>
        <div
          style={{ maxWidth: "clamp(180px, 40vw, 240px)", margin: "0 auto" }}
        >
          <div
            style={{
              minHeight: "2.2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "0.4rem",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#334155",
                textAlign: "center",
              }}
            >
              Un grafico saludable deberia verse asi:
            </p>
          </div>
          <Doughnut data={healthyData} options={healthyOptions} />
        </div>
      </div>
    </Container>
  );
};

export default MiDoughnutChart;
