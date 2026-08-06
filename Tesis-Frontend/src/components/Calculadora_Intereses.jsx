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

const formatInputAmount = (value) => {
  const digits = String(value).replace(/\D/g, "");
  return digits ? Number(digits).toLocaleString("es-PY") : "";
};

const parseInputAmount = (value) =>
  Number(String(value).replace(/\./g, "")) || 0;

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
    const cap = parseInputAmount(capital);
    const tas = parseFloat(String(tasa).replace(",", ".")) / 100 / 12;
    const tiem = parseInt(tiempo);
    const aporte = parseInputAmount(aporteMensual);

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
      const tasaMensual = parseFloat(String(tasa).replace(",", ".")) / 100 / 12;
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
    <Box className="calculator-shell">
      <div className="calculator-form-heading">
        <span className="page-eyebrow">Configura tu escenario</span>
        <Typography variant="h4">¿Qué quieres calcular?</Typography>
        <p>Completa los datos y obtén una proyección detallada en guaraníes.</p>
      </div>

      {/* Selector de sección */}
      <Box sx={{ mb: 3 }}>
        <div className="calculator-options">
          {SECCIONES.map((s) => {
            const isSelected = seccion === s.value;
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => cambiarSeccion(s.value)}
                className={`calculator-option ${isSelected ? "active" : ""}`}
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
        type="text"
        inputMode="numeric"
        value={capital}
        onChange={(e) => setCapital(formatInputAmount(e.target.value))}
        placeholder="Ej: 10.000.000"
        className="calculator-field"
        fullWidth
        margin="normal"
      />
      <TextField
        label="Tasa de Interés Anual (%)"
        type="number"
        inputProps={{ step: "0.01", min: "0" }}
        value={tasa}
        onChange={(e) => setTasa(e.target.value)}
        fullWidth
        margin="normal"
        className="calculator-field"
      />
      <TextField
        label="Tiempo (meses)"
        type="number"
        value={tiempo}
        onChange={(e) => setTiempo(e.target.value)}
        fullWidth
        margin="normal"
        className="calculator-field"
      />
      <Box sx={{ mt: 1, mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
          Tipo de Cálculo
        </Typography>
        <div className="calculator-options calculator-options--secondary">
          {TIPOS_POR_SECCION[seccion].map((opcion) => {
            const isSelected = tipo === opcion.value;
            return (
              <button
                key={opcion.value}
                type="button"
                onClick={() => setTipo(opcion.value)}
                className={`calculator-option ${isSelected ? "active" : ""}`}
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
          type="text"
          inputMode="numeric"
          value={aporteMensual}
          onChange={(e) => setAporteMensual(formatInputAmount(e.target.value))}
          placeholder="Ej: 500.000"
          className="calculator-field"
          fullWidth
          margin="normal"
        />
      )}
      <Button className="calculator-submit" variant="contained" onClick={calcular} fullWidth>
        Calcular
      </Button>

      {resultados && (
        <Box className="calculator-results">
          {resultados.tipo === "frances" && (
            <>
              <Typography variant="h6">Resultados - Sistema Francés</Typography>
              <TableContainer component={Paper} className="calculator-table">
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
              <TableContainer component={Paper} className="calculator-table">
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
            <div className="calculator-summary">
              <Typography variant="h6">Resultados - CDA Normal</Typography>
              <Typography sx={{ mt: 1 }}>
                Interés generado:{" "}
                <strong>{formatearGs(resultados.interesTotal)}</strong>
              </Typography>
              <Typography>
                Monto final:{" "}
                <strong>{formatearGs(resultados.montoTotal)}</strong>
              </Typography>
            </div>
          )}
          {resultados.tipo === "ahorro_compuesto" && (
            <div className="calculator-summary">
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
              <TableContainer component={Paper} className="calculator-table">
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
            </div>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CalculadoraIntereses;
