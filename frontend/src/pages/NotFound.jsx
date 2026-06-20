import { Link } from 'react-router-dom';

// #Manejo de error 404
// Muestra una pantalla cuando la ruta no existe.
const NotFound = () => {
  return (
    <main>
      <h1>Error 404</h1>
      <p>La página solicitada no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </main>
  );
};

export default NotFound;