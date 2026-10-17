/* Carta de Lumma. Para cambiar precios o productos, editar solo este archivo.
   arte = tipo de ilustración (ver art.js); c = colores de la ilustración. */
(function () {
  const slug = (s) =>
    s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  /* pre = prefijo para el pedido, cuando el nombre es solo un sabor (ej. "Fruit Tea de Mango") */
  const bebidas = (cat, estilo, precio, lista, pre) =>
    lista.map(([n, c1, c2]) => ({ id: cat + '-' + slug(n), nombre: n, completo: pre ? pre + ' ' + n : n, precio, tipo: 'bebida', arte: estilo, c: [c1, c2 || c1] }));

  const simple = (cat, n, precio, arte, c, extra = {}) =>
    ({ id: cat + '-' + slug(n), nombre: n, precio, tipo: 'simple', arte, c, ...extra });

  const frutas = [
    ['Mango', '#FFC83D'], ['Maracuyá', '#F8B22A'], ['Fresa', '#F26B8A'], ['Uva', '#8E5BB5'], ['Lychee', '#F4D3DA'],
    ['Arándano', '#5B5FC7'], ['Manzana Verde', '#A5D86B'], ['Durazno Rosa', '#F9A8A0'], ['Piña', '#F9D84A'],
  ];
  const FRUIT_TEA_SABORES = frutas.map((f) => f[0]);

  window.LUMMA_MENU = [
    {
      id: 'classics', nombre: 'The Classics', nota: 'A base de leche', icono: 'milk', c: ['#B68AD6', '#B68AD6'],
      items: bebidas('classics', 'milk', 13.9, [
        ['Milk Tea Dream', '#D9A56B'], ['Taro Dream', '#B68AD6'], ['Matcha Dream', '#8DBE5E'], ['Chococo Dream', '#7A4B33'],
        ['Coconut Dream', '#EFE2CB'], ['Thai Tea Dream', '#F0883E'], ['Milk Coffee Dream', '#8B5A3C'], ['Moca Dream', '#6B3E2A'],
        ['Tiger Sugar', '#C98B4E'], ['Blue Matcha', '#6CC4D9'], ['Choco Dream', '#5B3A29'],
      ]),
    },
    {
      id: 'fruit-teas', nombre: 'Fruit Teas', nota: 'Té verde de jazmín', icono: 'fruit', c: ['#F8B22A', '#F8B22A'],
      items: bebidas('fruit-teas', 'fruit', 12.9, frutas, 'Fruit Tea de'),
    },
    {
      id: 'galaxy-teas', nombre: 'Galaxy Teas', nota: 'Té verde de jazmín', icono: 'galaxy', c: ['#6C63FF', '#B07CFF'],
      items: bebidas('galaxy-teas', 'galaxy', 14.9, [
        ['Manzana Zen', '#9BE37A', '#5FD1C8'], ['Fresa Glow', '#FF8FB1', '#C58BFF'], ['Maracumango Golden', '#FFD35C', '#FF9F43'],
        ['Sweet Indigo', '#6C63FF', '#B07CFF'], ['Pink Paradise', '#FF9ECF', '#FFD0E6'], ['Lemon Blue Boom', '#FFF176', '#4FC3F7'],
      ]),
    },
    {
      id: 'sunset-teas', nombre: 'Sunset Teas', nota: 'Té verde de jazmín', icono: 'sunset', c: ['#FFB347', '#F0506E'],
      items: bebidas('sunset-teas', 'sunset', 14.9, [
        ['Sunset Passion', '#FFB347', '#F0506E'], ['Mango Blush', '#FFD15C', '#FF9AA8'], ['Sunny Lychee', '#FFE6A7', '#FFB6C8'],
      ]),
    },
    {
      id: 'slushes', nombre: 'Slushes', nota: 'Bebida de hielo', icono: 'slush', c: ['#6CC4D9', '#6CC4D9'],
      items: bebidas('slushes', 'slush', 14.9, [
        ['Piña Colada', '#F7EBB0'], ['Mango', '#FFC83D'], ['Maracuyá', '#F8B22A'], ['Fresa', '#F26B8A'], ['Arándano', '#5B5FC7'],
        ['Manzana Verde', '#A5D86B'], ['Durazno Rosa', '#F9A8A0'], ['Uva', '#8E5BB5'], ['Lychee', '#F4D3DA'],
        ['Taro', '#B68AD6'], ['Matcha', '#8DBE5E'],
      ], 'Slush de'),
    },
    {
      id: 'frappes', nombre: 'Frappes', nota: 'Batido de leche con hielo', icono: 'frappe', c: ['#8A5A44', '#8A5A44'],
      items: bebidas('frappes', 'frappe', 15.9, [
        ['Fresa', '#F7A1B8'], ['Mango', '#FFD27A'], ['Arándano', '#9C8CE0'], ['Chocolate', '#8A5A44'], ['Ice Coffee', '#A47551'], ['Ice Moca', '#7A5545'],
      ], 'Frappe de'),
    },
    {
      id: 'refreshers', nombre: 'Refreshers', nota: 'Bebida refrescante', icono: 'refresher', c: ['#A5D86B', '#A5D86B'],
      items: bebidas('refreshers', 'refresher', 13.9, [
        ['Mango', '#FFC83D'], ['Maracuyá', '#F8B22A'], ['Fresa', '#F26B8A'], ['Arándano', '#5B5FC7'], ['Manzana Verde', '#A5D86B'],
        ['Durazno Rosa', '#F9A8A0'], ['Lychee', '#F4D3DA'], ['Uva', '#8E5BB5'], ['Piña', '#F9D84A'],
      ], 'Refresher de'),
    },
    {
      id: 'sodas', nombre: 'Sodas italianas', nota: 'Bebida gasificada', icono: 'soda', c: ['#F26B8A', '#F26B8A'],
      items: bebidas('sodas', 'soda', 13.9, [
        ['Piña', '#F9D84A'], ['Arándano', '#5B5FC7'], ['Mango', '#FFC83D'], ['Maracuyá', '#F8B22A'], ['Uva', '#8E5BB5'],
        ['Lychee', '#F4D3DA'], ['Durazno Rosa', '#F9A8A0'], ['Manzana Verde', '#A5D86B'], ['Fresa', '#F26B8A'],
      ], 'Soda italiana de'),
    },
    {
      id: 'ramen', nombre: 'Arma tu ramen', nota: 'Sopa o spaghetti', icono: 'sopa', c: ['#F2A654', '#F2A654'],
      items: [
        { id: 'ramen-sopa', nombre: 'Sopa ramen', precio: 10, tipo: 'ramen', arte: 'sopa', c: ['#F2A654', '#F2A654'], desc: 'Fideos en caldo caliente. Elige tu picante y tus toppings.' },
        { id: 'ramen-spaghetti', nombre: 'Spaghetti ramen', precio: 12, tipo: 'ramen', arte: 'seco', c: ['#C8552B', '#C8552B'], desc: 'Fideos salteados estilo ramen. Elige tu picante y tus toppings.' },
      ],
    },
    {
      id: 'dim-sum', nombre: 'Dim sum y snacks', nota: 'Para compartir o acompañar', icono: 'dumpling', c: ['#FFE9C8', '#FFE9C8'],
      items: [
        simple('dim-sum', 'Mochi', 6, 'mochi', ['#F7B5CE', '#BFE3A0'], { desc: '1 unidad.' }),
        simple('dim-sum', 'Onigiri', 8, 'onigiri', ['#FFFFFF', '#1F3B2D'], { desc: '1 unidad.', sabores: ['Atún', 'Pollo', 'Trucha ahumada'] }),
        simple('dim-sum', 'Siu Mai', 12, 'dumpling', ['#FFE9C8', '#F2A654'], { desc: '6 unidades.' }),
        simple('dim-sum', 'Gyozas', 12, 'dumpling', ['#FFD9A0', '#E9A95C'], { desc: '6 unidades.', variantes: [{ n: 'Fritas', p: 12 }, { n: 'Al vapor', p: 12 }] }),
        simple('dim-sum', 'Taiyaki', 5, 'taiyaki', ['#E9A95C', '#5B3A29'], { desc: 'Panqueque en forma de pez.', variantes: [{ n: 'Relleno de chispas de chocolate', p: 5 }, { n: 'Con bola de helado', p: 7 }] }),
        simple('dim-sum', 'Min pao dulce small', 4, 'bao', ['#FFF4E2', '#F7B5CE']),
        simple('dim-sum', 'Min pao salado small', 4, 'bao', ['#FFF4E2', '#C98B4E']),
        simple('dim-sum', 'Pepero', 6, 'pepero', ['#7A4B33', '#F7B5CE']),
        simple('dim-sum', 'Ositos', 4, 'ositos', ['#C98B4E', '#5B3A29']),
        simple('dim-sum', 'Choco Pie', 4, 'chocopie', ['#5B3A29', '#FFF3E3']),
        simple('dim-sum', 'Yakul', 3, 'yakul', ['#F5F0E0', '#E9579F']),
      ],
    },
    {
      id: 'corn-dogs', nombre: 'Corn dogs', nota: 'Street food', icono: 'corndog', c: ['#E9A23B', '#E9A23B'],
      items: [
        simple('corn-dogs', 'Corn dog clásico de salchicha', 9, 'corndog', ['#E9A23B', '#F3403A']),
        simple('corn-dogs', 'Corn dog mixto de salchicha y queso', 10, 'corndog', ['#E9A23B', '#FFD35C']),
        simple('corn-dogs', 'Corn dog cheese de solo queso', 12, 'corndog', ['#E9A23B', '#FFD35C']),
      ],
    },
    {
      id: 'combos', nombre: 'Combos', nota: 'Fruit Tea con acompañante', icono: 'combo', c: ['#E9579F', '#F8B22A'],
      items: [
        { id: 'combos-fruit-tea-taiyaki', nombre: 'Combo Fruit Tea + Taiyaki', precio: 15, tipo: 'combo', arte: 'combo', c: ['#F8B22A', '#E9A95C'], desc: 'Tu Fruit Tea favorito con un Taiyaki de chispas de chocolate.', sabores: FRUIT_TEA_SABORES },
        { id: 'combos-fruit-tea-ramen-sopa', nombre: 'Combo Fruit Tea + Ramen Sopa', precio: 20, tipo: 'combo', arte: 'combo', c: ['#F8B22A', '#F2A654'], desc: 'Tu Fruit Tea favorito con una Sopa ramen.', sabores: FRUIT_TEA_SABORES },
        { id: 'combos-fruit-tea-ramen-spaghetti', nombre: 'Combo Fruit Tea + Ramen Spaghetti', precio: 22, tipo: 'combo', arte: 'combo', c: ['#F8B22A', '#C8552B'], desc: 'Tu Fruit Tea favorito con un Spaghetti ramen.', sabores: FRUIT_TEA_SABORES },
        { id: 'combos-fruit-tea-pepero', nombre: 'Combo Fruit Tea + Pepero', precio: 16, tipo: 'combo', arte: 'combo', c: ['#F8B22A', '#7A4B33'], desc: 'Tu Fruit Tea favorito con un Pepero.', sabores: FRUIT_TEA_SABORES },
      ],
    },
  ];
})();
