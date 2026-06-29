import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  FormControlLabel,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import vencimientoService from "../services/vencimientoService";

const AvisoVencimientos = () => {
  const [descripcion, setDescripcion] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [esCuotaFija, setEsCuotaFija] = useState(false);
  const [cantidadTotalCuotas, setCantidadTotalCuotas] = useState("");
  const [montoCuota, setMontoCuota] = useState("");
  const [categoria, setCategoria] = useState("servicio");
  const [obligaciones, setObligaciones] = useState([]);

  // Cargar obligaciones desde API al montar
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
  }, []);

  const agregarObligacion = async () => {
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
      setObligaciones([...obligaciones, saved]);
      setDescripcion("");
      setFechaVencimiento("");
      setEsCuotaFija(false);
      setCantidadTotalCuotas("");
      setMontoCuota("");
      setCategoria("servicio");

      const categoriaGasto = categoria === "servicio" ? "Servicios" : "Deudas";
      alert(
        `Obligación agregada. Se creó un gasto en la categoría "${categoriaGasto}"`,
      );
    } catch (error) {
      console.error("Error al agregar obligación:", error);
      alert("Error al agregar obligación");
    }
  };

  const eliminarObligacion = async (id) => {
    try {
      await vencimientoService.deleteData(id);
      setObligaciones(obligaciones.filter((ob) => ob._id !== id));
      alert("Obligación eliminada. El gasto asociado también fue eliminado.");
    } catch (error) {
      console.error("Error al eliminar obligación:", error);
      alert("Error al eliminar obligación");
    }
  };

  const pagarObligacion = async (ob) => {
    try {
      const updated = await vencimientoService.update(ob._id, { pagado: true });
      setObligaciones(
        obligaciones.map((o) => (o._id === ob._id ? updated : o)),
      );

      if (updated.completado) {
        alert(
          `Obligación completada. Pagos totales: ${updated.pagosRealizados}. (Registro mantenido en historial)`,
        );
      } else {
        alert(
          `Cuota pagada. El registro de abril se mantiene, se creó un gasto para el próximo mes.`,
        );
      }
    } catch (error) {
      console.error("Error al pagar obligación:", error);
      alert("Error al pagar obligación");
    }
  };

  const formatearGs = (valor) => {
    return new Intl.NumberFormat("es-PY", {
      style: "currency",
      currency: "PYG",
    }).format(valor);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Avisos de Vencimientos
      </Typography>

      {/* Formulario para agregar */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6">Agregar Obligación</Typography>
        <TextField
          label="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Monto de la cuota (Gs.)"
          type="number"
          value={montoCuota}
          onChange={(e) => setMontoCuota(e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Categoría</InputLabel>
          <Select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <MenuItem value="servicio">Servicio</MenuItem>
            <MenuItem value="deuda">Deuda</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Fecha de Vencimiento"
          type="date"
          value={fechaVencimiento}
          onChange={(e) => setFechaVencimiento(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={esCuotaFija}
              onChange={(e) => setEsCuotaFija(e.target.checked)}
            />
          }
          label="Es cuota fija"
        />
        {!esCuotaFija && (
          <TextField
            label="Cantidad total de cuotas"
            type="number"
            value={cantidadTotalCuotas}
            onChange={(e) => setCantidadTotalCuotas(e.target.value)}
            fullWidth
            margin="normal"
          />
        )}
        <Button
          variant="contained"
          onClick={agregarObligacion}
          fullWidth
          sx={{ mt: 2 }}
        >
          Agregar
        </Button>
      </Paper>

      {/* Lista de obligaciones */}
      <Typography variant="h6">Obligaciones</Typography>
      <List>
        {obligaciones.map((ob) => {
          let estado = ob.completado
            ? "Completada"
            : dayjs().isAfter(dayjs(ob.fechaVencimiento), "day")
              ? "Vencida"
              : "Al día";

          const getEstadoColor = () => {
            if (ob.completado) return "blue";
            if (estado === "Vencida") return "red";
            return "green";
          };

          return (
            <ListItem
              key={ob._id}
              divider
              sx={{
                opacity: ob.completado ? 0.7 : 1,
                backgroundColor: ob.completado
                  ? "rgba(0, 0, 255, 0.05)"
                  : "transparent",
              }}
            >
              <ListItemText
                primary={`${ob.descripcion} - ${formatearGs(ob.montoCuota)}`}
                secondary={
                  <>
                    Fecha de vencimiento:{" "}
                    {dayjs(ob.fechaVencimiento).format("DD/MM/YYYY")} - Estado:{" "}
                    <span
                      style={{
                        color: getEstadoColor(),
                        fontWeight: "bold",
                      }}
                    >
                      {estado}
                    </span>{" "}
                    - Categoría: {ob.categoria}
                    {ob.esCuotaFija
                      ? " (Cuota fija)"
                      : ` Cuotas restantes: ${ob.cantidadTotalCuotas}`}
                    {ob.pagosRealizados > 0 &&
                      ` - Pagos realizados: ${ob.pagosRealizados}`}
                  </>
                }
              />
              <Button
                variant="contained"
                color="success"
                onClick={() => pagarObligacion(ob)}
                disabled={ob.completado}
                sx={{ mr: 1 }}
              >
                Pagar
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => eliminarObligacion(ob._id)}
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                <DeleteIcon sx={{ mr: 0.5, fontSize: "1rem" }} /> Eliminar
              </Button>
            </ListItem>
          );
        })}
      </List>
      {obligaciones.length > 0 && (
        <Typography variant="h6" sx={{ mt: 2 }}>
          Total de cuotas:{" "}
          {formatearGs(
            obligaciones.reduce((sum, ob) => sum + ob.montoCuota, 0),
          )}
        </Typography>
      )}
      {obligaciones.length === 0 && (
        <Typography>No hay obligaciones.</Typography>
      )}
    </Box>
  );
};

export default AvisoVencimientos;
