'use client';

import { useEffect } from 'react';

export default function ResetErrorCounter() {
  useEffect(() => {
    // Cada vez que se monta una página válida, reiniciamos el contador a 1
    localStorage.setItem('integra_error_count', '1');
  }, []);

  return null; // Este componente no renderiza nada visual
}