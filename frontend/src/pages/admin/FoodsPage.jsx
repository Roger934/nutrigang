import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FoodRow from "../../components/FoodRow";
import alimentos from "../../data/alimentos.json";

// #Renderizado de listas
// Muestra alimentos desde un archivo JSON local.
const FoodsPage = () => {
  // #useState
  // Controla búsqueda y alimentos seleccionados temporalmente.
  const [search, setSearch] = useState("");
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [noteMessage, setNoteMessage] = useState("");
  const [noteError, setNoteError] = useState("");

  // #Formulario no controlado con useRef
  // Referencia directa al buscador de alimentos.
  const searchInputRef = useRef(null);
  const noteInputRef = useRef(null);

  // #useEffect - montaje de componentes
  // Al abrir FoodsPage enfoca automáticamente el buscador usando useRef.
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // #useEffect - limpieza de efectos
  // Atajo F2 para enfocar rápidamente el buscador de alimentos.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "F2") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // #Query params
  // Lee y actualiza la categoría desde la URL.
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("categoria") || "";

  // #Aportacion 1: useMemo reutiliza calculos mientras sus datos no cambien.
  const categories = useMemo(() => {
    return [...new Set(alimentos.map((item) => item.categoria))];
  }, []);

  // #Manejo de datos y lógica
  // Filtra alimentos por categoría y texto de búsqueda.
  const filteredFoods = useMemo(() => {
    return alimentos.filter((item) => {
      const matchesCategory = selectedCategory
        ? item.categoria === selectedCategory
        : true;

      const matchesSearch = item.alimento
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  // #Manejo de eventos en React
  // Actualiza el query param de categoría.
  const handleCategoryChange = (event) => {
    const value = event.target.value;

    if (value) {
      setSearchParams({ categoria: value });
    } else {
      setSearchParams({});
    }
  };

  // #Manejo de eventos en React
  // Agrega un alimento a la lista temporal de selección.
  const handleAddFood = useCallback((food) => {
    setSelectedFoods((currentFoods) => [...currentFoods, food]);
  }, []);

  // #Formulario no controlado: lee y valida el valor directamente con useRef.
  const handleNoteSubmit = (event) => {
    event.preventDefault();
    const note = noteInputRef.current.value.trim();

    setNoteMessage("");
    setNoteError("");

    if (!note) {
      setNoteError("Escribe una nota antes de guardarla.");
      noteInputRef.current.focus();
      return;
    }

    setNoteMessage(`Nota guardada: ${note}`);
    noteInputRef.current.value = "";
  };

  // #Manejo de eventos en React
  // Quita un alimento seleccionado.
  const handleRemoveFood = (indexToRemove) => {
    setSelectedFoods(
      selectedFoods.filter((_, index) => index !== indexToRemove),
    );
  };

  const selectedText = selectedFoods
    .map((food) => `${food.alimento} (${food.cantidad}, ${food.peso})`)
    .join(", ");

  return (
    <section>
      <h2>Catálogo de alimentos</h2>

      <p>
        Catálogo local de porciones. Estos alimentos no se guardan en MySQL.
      </p>

      <div>
        <label htmlFor="search">Buscar alimento</label>
        <input
          ref={searchInputRef}
          id="search"
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Ejemplo: pollo, arroz, manzana"
          className="input"
        />
      </div>

      <div>
        <label htmlFor="category">Filtrar por categoría</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="select"
        >
          <option value="">Todas</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <h3>Resultados</h3>

      {filteredFoods.length === 0 ? (
        <p>No hay alimentos con esos filtros.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Categoría</th>
                <th>Alimento</th>
                <th>Cantidad</th>
                <th>Peso</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {filteredFoods.map((food) => (
                <FoodRow key={food.id} food={food} onAdd={handleAddFood} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h3>Alimentos seleccionados</h3>

      {selectedFoods.length === 0 ? (
        <p>No hay alimentos seleccionados.</p>
      ) : (
        <ul className="grid gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3">
          {selectedFoods.map((food, index) => (
            <li key={`${food.id}-${index}`} className="flex flex-col gap-3 rounded-xl border border-emerald-100 bg-white p-3 text-sm text-gray-700 sm:flex-row sm:items-center sm:justify-between">
              <span>{food.alimento} - {food.cantidad} - {food.peso}</span>
              <button type="button" onClick={() => handleRemoveFood(index)} className="inline-flex min-h-9 items-center justify-center rounded-lg border border-red-200 bg-white px-3 text-xs font-semibold text-red-600 transition hover:bg-red-50">
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}

      <h3>Texto para copiar a dieta</h3>

      <textarea
        value={selectedText}
        readOnly
        rows="5"
        cols="80"
        className="textarea min-h-32 border-emerald-200 bg-white shadow-sm"
        placeholder="Los alimentos que agregues apareceran aqui."
      />

      <form onSubmit={handleNoteSubmit} className="foods-note-form mt-6">
        <div className="form-group">
          <label htmlFor="diet-note" className="label">Nota rapida para la dieta</label>
          <input
            ref={noteInputRef}
            id="diet-note"
            name="dietNote"
            type="text"
            className="input"
            placeholder="Ejemplo: evitar lacteos"
          />
          {noteMessage && <p className="alert-success mt-2">{noteMessage}</p>}
          {noteError && <p className="alert-error mt-2" role="alert">{noteError}</p>}
        </div>
        <button type="submit" className="btn btn-primary">Guardar nota</button>
      </form>
    </section>
  );
};

export default FoodsPage;
