import { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// #Aportacion 2: React.memo evita renderizar de nuevo filas que no cambiaron.
const FoodRow = memo(({ food, onAdd }) => {
  return (
    <tr>
      <td>{food.id}</td>
      <td>{food.categoria}</td>
      <td>{food.alimento}</td>
      <td>{food.cantidad}</td>
      <td>{food.peso}</td>
      <td>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => onAdd(food)}>
            Agregar
          </button>
          <Link to={`/admin/foods/${food.id}`} className="font-semibold text-emerald-700">
            Ver detalle
          </Link>
        </div>
      </td>
    </tr>
  );
});

FoodRow.displayName = 'FoodRow';

FoodRow.propTypes = {
  food: PropTypes.shape({
    id: PropTypes.number.isRequired,
    categoria: PropTypes.string.isRequired,
    alimento: PropTypes.string.isRequired,
    cantidad: PropTypes.string.isRequired,
    peso: PropTypes.string.isRequired
  }).isRequired,
  onAdd: PropTypes.func.isRequired
};

export default FoodRow;
