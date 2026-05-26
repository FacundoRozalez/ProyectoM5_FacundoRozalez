import { describe, test, expect } from "vitest";
import { formatErrorForLLM, ValidationError } from "../src/errors/index.js";

describe("🧪 PRUEBAS DE TRANSFORMACIÓN DE ERRORES A LENGUAJE NATURAL", () => {

  test("7. Un error 404 de GitHub debe convertirse en una alerta comprensible del recurso", () => {
    const errorDeAPI = { status: 404 };
    const mensajeFormateado = formatErrorForLLM(errorDeAPI, "listar los issues abiertos");
    
    expect(mensajeFormateado).toContain("no existe. Verificá los nombres");
    expect(mensajeFormateado).not.toContain("stack trace");
    expect(mensajeFormateado).not.toContain("Error [Object]");
  });

  test("8. Un error de tipo ValidationError debe propagar la regla rota con su contexto", () => {
    const errorDeValidacion = new ValidationError("El campo 'path' es obligatorio para hacer commits.");
    const mensajeFormateado = formatErrorForLLM(errorDeValidacion, "crear un archivo");

    expect(mensajeFormateado).toContain("Error de validación al crear un archivo:");
    expect(mensajeFormateado).toContain("El campo 'path' es obligatorio");
  });
});