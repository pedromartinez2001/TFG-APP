import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const SECCIONES = [
  { value: "prestamo", label: "Préstamos" },
  { value: "ahorro", label: "Ahorro" },
];

const TIPOS_POR_SECCION = {
  prestamo: [
    { value: "frances", label: "Francés" },
    { value: "aleman", label: "Alemán" },
  ],
  ahorro: [
    { value: "cda_normal", label: "CDA" },
    { value: "ahorro_compuesto", label: "Ahorro Compuesto" },
  ],
};

const CalculadoraIntereses = () => {
  const [seccion, setSeccion] = useState("prestamo");
  const [capital, setCapital] = useState("");
  const [tasa, setTasa] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [aporteMensual, setAporteMensual] = useState("");
  const [tipo, setTipo] = useState("frances");
  const [resultados, setResultados] = useState(null);

  const cambiarSeccion = (nuevaSeccion) => {
    setSeccion(nuevaSeccion);
    setTipo(TIPOS_POR_SECCION[nuevaSeccion][0].value);
    setResultados(null);
    setCapital("");
    setTasa("");
    setTiempo("");
    setAporteMensual("");
  };

  const calcular = () => {
    const cap = parseFloat(capital);
    const tas = parseFloat(tasa) / 100 / 12; // tasa mensual
    const tiem = parseInt(tiempo);
    const aporte = parseFloat(aporteMensual) || 0;

    if (
      isNaN(cap) ||
      isNaN(tas) ||
      isNaN(tiem) ||
      cap <= 0 ||
      tas <= 0 ||
      tiem <= 0
    ) {
      alert("Por favor, ingrese valores válidos.");
      return;
    }

    if (tipo === "cda_normal") {
      const interesTotal = cap * tas * tiem;
      const montoTotal = cap + interesTotal;

      setResultados({
        tipo: "cda_normal",
        interesTotal,
        montoTotal,
      });
      return;
    }

    if (tipo === "ahorro_compuesto") {
      if (aporte < 0) {
        alert("El aporte mensual no puede ser negativo.");
        return;
      }

      let saldo = cap;
      const tabla = [];

      for (let mes = 1; mes <= tiem; mes++) {
        const intereses = saldo * tas;
        const saldoFinal = saldo + intereses + aporte;
        tabla.push({
          mes,
          saldoInicial: saldo,
          intereses,
          aporte,
          saldoFinal,
        });
        saldo = saldoFinal;
      }

      const totalAportado = cap + aporte * tiem;
      const interesTotal = saldo - totalAportado;

      setResultados({
        tipo: "ahorro_compuesto",
        tabla,
        interesTotal,
        totalAportado,
        montoTotal: saldo,
      });
      return;
    }

    if (tipo === "frances") {
      // Sistema Francés: Amortización con cuotas constantes
      const tasaMensual = parseFloat(tasa) / 100 / 12;
      const cuota =
        (cap * tasaMensual * Math.pow(1 + tasaMensual, tiem)) /
        (Math.pow(1 + tasaMensual, tiem) - 1);
      let saldo = cap;
      const tabla = [];

      for (let mes = 1; mes <= tiem; mes++) {
        const intereses = saldo * tasaMensual;
        const amortizacion = cuota - intereses;
        const saldoFinal = saldo - amortizacion;
        tabla.push({
          mes,
          saldoInicial: saldo,
          intereses,
          amortizacion,
          cuota,
          saldoFinal: saldoFinal > 0 ? saldoFinal : 0,
        });
        saldo = saldoFinal;
      }

      setResultados({
        tipo: "frances",
        tabla,
        interesTotal: tabla.reduce((sum, row) => sum + row.intereses, 0),
        montoTotal: tabla.reduce((sum, row) => sum + row.cuota, 0),
      });
    } else if (tipo === "aleman") {
      // Sistema Alemán: Amortización constante
      const amortizacion = cap / tiem;
      let saldo = cap;
      const tabla = [];

      for (let mes = 1; mes <= tiem; mes++) {
        const intereses = saldo * tas;
        const cuota = amortizacion + intereses;
        const saldoFinal = saldo - amortizacion;
        tabla.push({
          mes,
          saldoInicial: saldo,
          intereses,
          amortizacion,
          cuota,
          saldoFinal: saldoFinal > 0 ? saldoFinal : 0,
        });
        saldo = saldoFinal;
      }

      setResultados({
        tipo: "aleman",
        tabla,
        interesTotal: tabla.reduce((sum, row) => sum + row.intereses, 0),
        montoTotal: tabla.reduce((sum, row) => sum + row.cuota, 0),
      });
    }
  };

  const formatearGs = (valor) => {
    return new Intl.NumberFormat("es-PY", {
      style: "currency",
      currency: "PYG",
    }).format(valor);
  };

  return (
    <Box
      sx={{
        maxWidth: 700,
        mx: "auto",
        mt: 4,
        mb: 3,
        p: { xs: 2, sm: 3 },
        backgroundColor: "#fff",
        border: "1px solid #E2E8F0",
        borderRadius: 3,
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Calculadora de Intereses
      </Typography>

      {/* Selector de sección */}
      <Box sx={{ mb: 3 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "0.5rem",
          }}
        >
          {SECCIONES.map((s) => {
            const isSelected = seccion === s.value;
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => cambiarSeccion(s.value)}
                style={{
                  border: isSelected
                    ? "2px solid var(--primary, #2563eb)"
                    : "1px solid #D0D7DE",
                  borderRadius: "8px",
                  background: isSelected ? "rgba(37, 99, 235, 0.1)" : "#fff",
                  color: "var(--text, #1e293b)",
                  padding: "0.85rem 0.5rem",
                  fontWeight: 700,
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </Box>

      <TextField
        label={
          seccion === "ahorro" ? "Monto Inicial (Gs.)" : "Capital Inicial (Gs.)"
        }
        type="number"
        value={capital}
        onChange={(e) => setCapital(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Tasa de Interés Anual (%)"
        type="number"
        value={tasa}
        onChange={(e) => setTasa(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Tiempo (meses)"
        type="number"
        value={tiempo}
        onChange={(e) => setTiempo(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Box sx={{ mt: 1, mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
          Tipo de Cálculo
        </Typography>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "0.5rem",
          }}
        >
          {TIPOS_POR_SECCION[seccion].map((opcion) => {
            const isSelected = tipo === opcion.value;
            return (
              <button
                key={opcion.value}
                type="button"
                onClick={() => setTipo(opcion.value)}
                style={{
                  border: isSelected
                    ? "2px solid var(--primary, #2563eb)"
                    : "1px solid #D0D7DE",
                  borderRadius: "8px",
                  background: isSelected ? "rgba(37, 99, 235, 0.1)" : "#fff",
                  color: "var(--text, #1e293b)",
                  padding: "0.75rem 0.5rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {opcion.label}
              </button>
            );
          })}
        </div>
      </Box>
      {tipo === "ahorro_compuesto" && (
        <TextField
          label="Agregar mensualmente más dinero (Gs.)"
          type="number"
          value={aporteMensual}
          onChange={(e) => setAporteMensual(e.target.value)}
          fullWidth
          margin="normal"
        />
      )}
      <Button variant="contained" onClick={calcular} fullWidth sx={{ mt: 2 }}>
        Calcular
      </Button>

      {resultados && (
        <Box sx={{ mt: 4 }}>
          {resultados.tipo === "frances" && (
            <>
              <Typography variant="h6">Resultados - Sistema Francés</Typography>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table className="table-mobile-stack">
                  <TableHead>
                    <TableRow>
                      <TableCell>Cuota N°</TableCell>
                      <TableCell>Amortización Capital</TableCell>
                      <TableCell>Amortización Interés</TableCell>
                      <TableCell>Cuota Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {resultados.tabla.map((row) => (
                      <TableRow key={row.mes}>
                        <TableCell data-label="Cuota N°">{row.mes}</TableCell>
                        <TableCell data-label="Amortización Capital">
                          {formatearGs(row.amortizacion)}
                        </TableCell>
                        <TableCell data-label="Amortización Interés">
                          {formatearGs(row.intereses)}
                        </TableCell>
                        <TableCell data-label="Cuota Total">
                          {formatearGs(row.cuota)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="table-summary-row">
                      <TableCell data-label="Resumen">
                        <strong>Total</strong>
                      </TableCell>
                      <TableCell data-label="Amortización Capital">
                        <strong>
                          {formatearGs(
                            resultados.tabla.reduce(
                              (sum, row) => sum + row.amortizacion,
                              0,
                            ),
                          )}
                        </strong>
                      </TableCell>
                      <TableCell data-label="Amortización Interés">
                        <strong>{formatearGs(resultados.interesTotal)}</strong>
                      </TableCell>
                      <TableCell data-label="Cuota Total">
                        <strong>{formatearGs(resultados.montoTotal)}</strong>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
          {resultados.tipo === "aleman" && (
            <>
              <Typography variant="h6">Resultados - Sistema Alemán</Typography>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table className="table-mobile-stack">
                  <TableHead>
                    <TableRow>
                      <TableCell>Cuota N°</TableCell>
                      <TableCell>Amortización Capital</TableCell>
                      <TableCell>Amortización Interés</TableCell>
                      <TableCell>Cuota Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {resultados.tabla.map((row) => (
                      <TableRow key={row.mes}>
                        <TableCell data-label="Cuota N°">{row.mes}</TableCell>
                        <TableCell data-label="Amortización Capital">
                          {formatearGs(row.amortizacion)}
                        </TableCell>
                        <TableCell data-label="Amortización Interés">
                          {formatearGs(row.intereses)}
                        </TableCell>
                        <TableCell data-label="Cuota Total">
                          {formatearGs(row.cuota)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="table-summary-row">
                      <TableCell data-label="Resumen">
                        <strong>Total</strong>
                      </TableCell>
                      <TableCell data-label="Amortización Capital">
                        <strong>
                          {formatearGs(
                            resultados.tabla.reduce(
                              (sum, row) => sum + row.amortizacion,
                              0,
                            ),
                          )}
                        </strong>
                      </TableCell>
                      <TableCell data-label="Amortización Interés">
                        <strong>{formatearGs(resultados.interesTotal)}</strong>
                      </TableCell>
                      <TableCell data-label="Cuota Total">
                        <strong>{formatearGs(resultados.montoTotal)}</strong>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
          {resultados.tipo === "cda_normal" && (
            <>
              <Typography variant="h6">Resultados - CDA Normal</Typography>
              <Typography sx={{ mt: 1 }}>
                Interés generado:{" "}
                <strong>{formatearGs(resultados.interesTotal)}</strong>
              </Typography>
              <Typography>
                Monto final:{" "}
                <strong>{formatearGs(resultados.montoTotal)}</strong>
              </Typography>
            </>
          )}
          {resultados.tipo === "ahorro_compuesto" && (
            <>
              <Typography variant="h6">
                Resultados - Ahorro Compuesto
              </Typography>
              <Typography sx={{ mt: 1 }}>
                Total aportado:{" "}
                <strong>{formatearGs(resultados.totalAportado)}</strong>
              </Typography>
              <Typography>
                Intereses ganados:{" "}
                <strong>{formatearGs(resultados.interesTotal)}</strong>
              </Typography>
              <Typography>
                Monto final acumulado:{" "}
                <strong>{formatearGs(resultados.montoTotal)}</strong>
              </Typography>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table className="table-mobile-stack">
                  <TableHead>
                    <TableRow>
                      <TableCell>Mes</TableCell>
                      <TableCell>Saldo Inicial</TableCell>
                      <TableCell>Interés</TableCell>
                      <TableCell>Aporte Mensual</TableCell>
                      <TableCell>Saldo Final</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {resultados.tabla.map((row) => (
                      <TableRow key={row.mes}>
                        <TableCell data-label="Mes">{row.mes}</TableCell>
                        <TableCell data-label="Saldo Inicial">
                          {formatearGs(row.saldoInicial)}
                        </TableCell>
                        <TableCell data-label="Interés">
                          {formatearGs(row.intereses)}
                        </TableCell>
                        <TableCell data-label="Aporte Mensual">
                          {formatearGs(row.aporte)}
                        </TableCell>
                        <TableCell data-label="Saldo Final">
                          {formatearGs(row.saldoFinal)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CalculadoraIntereses;
