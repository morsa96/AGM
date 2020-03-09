/**
 * Seminario #1: Grafo de escena
 * @author Marco Morsiani Cassani
 */

// variables globales estandar
var renderer, scene, camera;

// Otras variables
var angulo = 0;
var esfera;
var conjunto;

init();
loadScene();
render();

function init() {
  // Funcion de inicializacion de motor, escena y camara
  // Motor de render
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(new THREE.Color(0x000000));
  document.getElementById("container").appendChild(renderer.domElement);

  //Escena
  scene = new THREE.Scene();

  //Camara
  var aspectRatio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
  camera.position.set(0.5, 2, 5);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function loadScene() {
  // Construye el grafo de escena
  // - Objetos (geometria, material)
  // - Transformaciones
  // - Organizar el grafo

  // Objeto contenedor de cubo y esfera
  conjunto = new THREE.Object3D();
  conjunto.position.y = 1;

  // Cubo
  var geoCubo = new THREE.BoxGeometry(2, 2, 2);
  var matCubo = new THREE.MeshBasicMaterial({
    color: "green",
    wireframe: true
  });
  cubo = new THREE.Mesh(geoCubo, matCubo);
  cubo.position.x = 2;

  // Esfera
  var geoEsfera = new THREE.SphereGeometry(1, 30, 30);
  var material = new THREE.MeshBasicMaterial({
    color: "yellow",
    wireframe: true
  });
  esfera = new THREE.Mesh(geoEsfera, material);

  //Suelo
  var geoSuelo = new THREE.PlaneGeometry(10, 10, 12, 12);
  var matSuelo = new THREE.MeshBasicMaterial({ color: "grey", wireframe: false });
  var suelo = new THREE.Mesh(geoSuelo, matSuelo);
  suelo.rotation.x = -(Math.PI / 2);
  suelo.position.y = -0.1;

  // Objeto importado
  //metto dentro la cartella webgl/models/nuovacartella i miei file json scaricati da clara.io
  var loader = new THREE.ObjectLoader();
  loader.load('models/mario/mario-sculpture.json', function (object) {
    object.scale.set(0.01, 0.01, 0.01); //sono in percentuale, zona dello spazio dove lo posiziono
    object.rotation.y = Math.PI / 2; //lo ruoto
    cubo.add(object); //appare dentro al cubo
  });

  // Texto
  var fontLoader = new THREE.FontLoader();
  fontLoader.load('fonts/gentilis_bold.typeface.json', function (font) { //carichiamo la geometria delle lettere
    var geoTexto = new THREE.TextGeometry(
      'MARIO',
      {
        size: 0.5,
        height: 0.1,
        curveSegments: 3,
        style: 'normal',
        font: font,
        bevelThickness: 0.05,
        bevelSize: 0.04
      });
    var matTexto = new THREE.MeshBasicMaterial({ color: "red" });
    var texto = new THREE.Mesh(geoTexto, matTexto);
    scene.add(texto);
    texto.position.x = -1;
  });

  // Grafo
  conjunto.add(cubo);
  cubo.add(esfera);
  scene.add(conjunto);
  scene.add(new THREE.AxesHelper(3)) //aggiunge un piano con 3 assi
  scene.add(suelo); // si aggiunge automaticamente nel piano x e y
}

function update() {
  // Cambiar propiedades entre frames
  angulo += Math.PI / 100;
  esfera.rotation.y = angulo; //con questo ruota la sfera su se stessa lungo l'asse y
  conjunto.rotation.y = angulo / 10; //con questo ruota tutto attorno l'asse y
}

function render() {
  // Bucle de refresco
  requestAnimationFrame(render);
  update();
  renderer.render(scene, camera);
}
