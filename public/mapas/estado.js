var sigla_get = String(document.getElementById("sigla").innerHTML).replaceAll('"', '');

var estados = ["AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB",
    "PR", "PE", "PI", "RJ", "RN", "RO", "RS", "RR", "SC", "SE", "SP", "TO"];

var coordenadas = [
[ -8.77, -70.55],
[ -9.71, -35.73],
[ -3.07, -61.66],
[  1.41, -51.77],
[-12.96, -38.51],
[ -3.71, -38.54],
[-15.83, -47.86],
[-19.19, -40.34],
[-16.64, -49.31],
[ -2.55, -44.30],
[-12.64, -55.42],
[-20.51, -54.54],
[-18.10, -44.38],
[ -5.53, -52.29],
[ -7.06, -35.55],
[-24.89, -51.55],
[ -8.28, -35.07],
[ -8.28, -43.68],
[-22.84, -43.15],
[ -5.22, -36.52],
[-11.22, -62.80],
[-30.01, -51.22],
[1.89, -61.22],
[-27.33, -49.44],
[-10.90, -37.07],
[-23.55, -46.64],
[-10.25, -48.25]  
];

var busca_coord_sigla = estados.indexOf(sigla_get); // Pegando o numero da sigla

var map = L.map("map", { zoomControl:false }); // Criando mapa e desativando controle de zoom
map.setView(coordenadas[busca_coord_sigla], 5); // Zoom 

map.dragging.disable(); // Ativar/Desativar arrastado do mouse

L.tileLayer("https://api.maptiler.com/maps/bright/256/{z}/{x}/{y}.png?key=b5mQAhtIScegFb2XBOc1", {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
}).addTo(map);

// Marcador
L.marker(coordenadas[busca_coord_sigla]).addTo(map)

function onMapClick(e) {
    console.log(e);
};

map.on('click', onMapClick);
map.on('mousemove', () => {map.scrollWheelZoom.disable()}) // Ativar/Ocultar ZoomScroll