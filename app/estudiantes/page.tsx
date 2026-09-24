'use client';
import ResetErrorCounter from '@/components/EasterEgg/ResetErrorCounter';

export default function EstudiantesPage() {
  return (
    <>
      <ResetErrorCounter />
      <div className="row">
        <div className="col-12">
          <div style={{ marginTop: '2rem' }}> <p></p></div>
          <img src="/images/Logo_Integra.png" alt="Integra 2018" className="img-fluid" width="20%" />
          <h3>
            Plataforma Tecnológica en donde se integran los servicios que ofrece la 
            Dirección General de Orientación y Atención Educativa (DGOAE).
          </h3>
        </div>
        <div className="col-12">
          <p>&nbsp;</p>
        </div>
      </div>
    </>
  );
}