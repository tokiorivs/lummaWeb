/* Configuración editable de la web de Lumma.
   Todos los datos de locales y enlaces son de ejemplo: reemplazarlos por los reales. */
window.LUMMA_CONFIG = {
  nombre: 'Lumma Bubble Tea',

  locales: [
    { nombre: 'Local 1', direccion: 'Dirección por completar', horario: 'Horario por completar', telefono: 'Teléfono por completar', mapa: '#' },
    { nombre: 'Local 2', direccion: 'Dirección por completar', horario: 'Horario por completar', telefono: 'Teléfono por completar', mapa: '#' },
    { nombre: 'Local 3', direccion: 'Dirección por completar', horario: 'Horario por completar', telefono: 'Teléfono por completar', mapa: '#' },
  ],

  enlaces: {
    rappi: '#',
    pedidosya: '#',
    whatsapp: '#',
    instagram: '#',
    facebook: '#',
  },

  /* Bebidas */
  extra_grande: 2.5,
  topping_gratis: [
    'Boba de fresa', 'Boba de mango', 'Boba de arándano', 'Boba de maracuyá', 'Boba de chocolate',
    'Boba de durazno', 'Boba de manzana', 'Boba de lychee', 'Tapioca', 'Jelly mix', 'Jelly de coco',
  ],

  /* Ramen */
  picantes: ['Sin picante', 'Picante medio', 'Muy picante'],
  extras_ramen: [
    { n: 'Huevo duro', p: 1 },
    { n: 'Huevo frito', p: 1 },
    { n: 'Queso cheddar', p: 1 },
    { n: 'Queso mozzarella', p: 1 },
    { n: 'Chorizo', p: 2 },
  ],

  /* Productos que se sugieren antes de mostrar el pedido en caja (ids de la carta) */
  sugerencias: ['dim-sum-mochi', 'dim-sum-taiyaki', 'dim-sum-onigiri'],
};
