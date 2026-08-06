export const formatThousandsInput = (value) => {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits ? Number(digits).toLocaleString("es-PY") : "";
};

export const parseThousandsInput = (value) =>
  Number(String(value ?? "").replace(/\./g, "")) || 0;
