import React from 'react';

export default function HowItWorks() {
  const steps = [
    {
      icon: '🔍',
      title: '1. Elige tu Disfraz',
      desc: 'Selecciona entre cientos de modelos, verifica tu talla y revisa fotos reales.'
    },
    {
      icon: '📅',
      title: '2. Agenda la Fecha',
      desc: 'Escoge los días exactos para tu evento. Te lo entregamos limpio y listo 24h antes.'
    },
    {
      icon: '🥂',
      title: '3. Disfruta tu Evento',
      desc: 'Lúcete en tu fiesta. No te preocupes por arrugas menores ni por lavar la prenda.'
    },
    {
      icon: '📦',
      title: '4. Devuelve Fácil',
      desc: 'Recolectamos el traje en tu puerta. Nos encargamos del lavado y la tintorería.'
    }
  ];

  return (
    <section id="como-funciona" className="how-it-works">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Sencillo & Seguro</span>
          <h2 className="section-title">¿Cómo Funciona el Alquiler?</h2>
          <p className="section-description">
            Cuatro simples pasos para deslumbrar en tu próximo evento sin comprar de más.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}