'use client';

import { useEffect, useState, ReactNode } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user, logout, checkEncuestaStatus } = useAuth();
  const pathname = usePathname();
  
  const [showEncuestaAlert, setShowEncuestaAlert] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [encuestaChecked, setEncuestaChecked] = useState(false);
  const [isBecasOpen, setIsBecasOpen] = useState(true); // 👈 Estado para el acordeón

  useEffect(() => {
    if (encuestaChecked || !user) return;

    const abortController = new AbortController();

    const checkStatus = async () => {
      try {
        const realizada = await checkEncuestaStatus(abortController.signal);
        if (!realizada) {
          setShowEncuestaAlert(true);
        }
        setEncuestaChecked(true);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Error al verificar encuesta:', error);
        }
      }
    };
    
    checkStatus();

    return () => {
      abortController.abort(); // 👈 Cancela la petición si Strict Mode desmonta el componente
    };
  }, [user, encuestaChecked, checkEncuestaStatus]);

  const menuItems = [
    { name: 'Tutorías', href: '/responsables/Tutoria' },
    { name: 'Preguntas Frecuentes', href: '/administrativos/PreguntasFrecuentes' },
    { name: 'Scotiabank Tutorias', href: '/administrativos/AdmScotianbank' },
    { name: 'Datos Personales', href: '/estudiantes/Personales' },
    { name: 'Mensajes', href: '/estudiantes/Mensajes' },
    { name: 'Solicitudes', href: '/estudiantes/Solicitudes' },
    { name: 'Archivos', href: '/estudiantes/Archivos' },
    { name: 'Datos de Pago', href: '/estudiantes/ClabeInterbancaria' },
    { name: 'Pagos', href: '/estudiantes/Pagos' },
    { name: 'Encuesta', href: '/estudiantes/Encuesta' },
    { name: 'Renuncias', href: '/estudiantes/Renuncias' },
    { name: 'Reintegros', href: '/estudiantes/Reintegros' },
    { name: 'Eventos', href: '/estudiantes/Eventos' },
  ];

  return (
    // 👇 Agregamos la clase dinámica 'sidenav-toggled' para que el CSS funcione
    <div className={`fixed-nav sticky-footer bg-dark ${!sidebarOpen ? 'sidenav-toggled' : ''}`} id="page-top">
      
      {/* 👇 Overlay oscuro para móvil */}
      <div 
        className={`sidenav-overlay ${sidebarOpen && typeof window !== 'undefined' && window.innerWidth < 992 ? 'show' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav">
        <Link className="navbar-brand" href="/estudiantes/">
          <img src="/images/Logo_Integra_Oro.png" alt="Integra" className="img-fluid" width="150" />
        </Link>

        {showEncuestaAlert && (
          <div className="ml-3 d-none d-lg-block">
            <Link 
              href="/estudiantes/actualizar-datos"
              className="encuesta-alert-btn"
              onClick={() => setShowEncuestaAlert(false)}
            >
              <i className="fa fa-exclamation-triangle"></i> Actualizar Datos
            </Link>
          </div>
        )}

        <ul className="navbar-nav ml-auto d-none d-lg-flex">
          <li className="nav-item">
            <span className="nav-link user-info">
              <i className="fa fa-user fa-fw"></i>
              {user?.cuenta_unam} - Estudiante
            </span>
          </li>
        </ul>

        <button 
          className="navbar-toggler navbar-toggler-right" 
          type="button" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${sidebarOpen ? 'show' : ''}`} id="navbarResponsive">
          <ul className="navbar-nav navbar-sidenav" id="exampleAccordion">
            <br/><br/>
            <li className="nav-item">
              {/* 👇 Acordeón controlado por React, NO por data-toggle */}
              <a 
                className="nav-link titsubtext" 
                href="#" 
                onClick={(e) => { e.preventDefault(); setIsBecasOpen(!isBecasOpen); }}
                aria-expanded={isBecasOpen}
              >
                <i className="fa fa-angle-double-right"></i> Becas 
                <i className="fa fa-fw fa-angle-down pull-right"></i>
              </a>
              
              <ul className={`over-link collapse ${isBecasOpen ? 'show' : ''}`} style={{backgroundColor: 'rgb(52, 58, 64)', borderRadius: '10px'}}>
                {menuItems.map((item) => (
                  <li key={item.href}>
                    <Link 
                      className={`nav-link over ${pathname === item.href ? 'active' : ''}`} 
                      href={item.href}
                      onClick={() => {
                        // Cierra el sidebar en móvil al hacer clic en un enlace
                        if (typeof window !== 'undefined' && window.innerWidth < 992) {
                          setSidebarOpen(false);
                        }
                      }}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>

          <ul className="navbar-nav sidenav-toggler">
            <li className="nav-item">
              <a className="nav-link text-center" id="sidenavToggler" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <i className={`fa fa-fw ${sidebarOpen ? 'fa-angle-left' : 'fa-angle-right'}`}></i>
              </a>
            </li>
          </ul>

          <ul className="navbar-nav ml-auto">
            <li className="nav-item d-lg-none">
              <span className="nav-link user-info">
                <i className="fa fa-user fa-fw"></i> {user?.cuenta_unam}
              </span>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/configuracion/CambioPassword">
                <i className="fa fa-fw fa-key"></i> Cambiar Contraseña
              </Link> 
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/configuracion/CambioCorreo">
                <i className="fa fa-fw fa-envelope"></i> Cambiar Correo
              </Link>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link text-left" onClick={logout}>
                <i className="fa fa-fw fa-sign-out"></i> Salir
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <div className="content-wrapper">
        <div className="container-fluid">
          {children}
        </div>

        <footer className="sticky-footer">
          <div className="container">
            <div className="copyright text-center text-muted" style={{fontSize: '0.85rem'}}>
              Copyright © Integra 2026, todos los derechos reservados. 
              Administrado por la: <Link href="/creditos" className="text-dark">Coordinación de Sistemas</Link> de DGOAE. 
              <Link href="/avisoprivacidad" className="text-dark ml-2"> Aviso de privacidad</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function EstudiantesLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardContent>{children}</DashboardContent>
    </AuthProvider>
  );
}