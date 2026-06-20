import { Link, useParams } from 'react-router-dom';
import alimentos from '../../data/alimentos.json';

const FoodDetail = () => {
  // #Ruta con parametros: useParams obtiene el ID incluido en la URL.
  const { foodId } = useParams();
  const food = alimentos.find((item) => item.id === Number(foodId));

  if (!food) {
    return (
      <section className="card">
        <h2>Alimento no encontrado</h2>
        <Link to="/admin/foods" className="font-semibold text-violet-700">
          Volver al catalogo
        </Link>
      </section>
    );
  }

  return (
    <section className="card">
      <p className="text-sm font-semibold text-violet-600">Detalle del alimento #{food.id}</p>
      <h2 className="mt-2 text-2xl font-bold text-gray-950">{food.alimento}</h2>
      <dl className="mt-5 grid gap-3 text-sm text-gray-700">
        <div><dt className="font-semibold">Categoria</dt><dd>{food.categoria}</dd></div>
        <div><dt className="font-semibold">Cantidad</dt><dd>{food.cantidad}</dd></div>
        <div><dt className="font-semibold">Peso</dt><dd>{food.peso}</dd></div>
      </dl>
      <Link to="/admin/foods" className="mt-6 inline-block font-semibold text-violet-700">
        Volver al catalogo
      </Link>
    </section>
  );
};

export default FoodDetail;
