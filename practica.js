/**
 * Practica 2
 * @author Marco Morsiani Cassani
 * @date: 02-03-2020
 */

 //import {dataArray} from './Planets';
 //import {solarSystemCreate, solarSystemMove} from './SolarSystem';
 //import OrbitControls from 'orbit-controls-es6';

// variables globales estandar
var renderer, scene, camera, descPanel;
var cameraControls; //per il controllo della camera
var planets = {sun: {}, mercury: {}, venus: {}, earth: {}, moon:{}, mars: {}, jupiter: {}, saturn: {}, uranus: {}, neptune: {}};
var moon ;

// Mouse interactive
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const AU = 5;
const ER = 0.5; // Earth Radius
const sunSize = 1; // Realistic 109 - number of earth radius

/**
 * Main object with data about all sphere in our solar system
 * @type {[object]}
 */


var solarSystemData = [
    {
        name: 'sun',
        radius: sunSize,
        distance: 0,
        rotate: 0.01,
        orbit: 2 * Math.PI * AU * AU,
        lineSpeed: 0 //non ruota
    },
    {
        name: 'mercury',
        radius: 0.38 * ER,
        distance: sunSize + (0.387 * AU),
        rotate: 0.01,
        orbit: 2 * Math.PI * AU * AU,
        lineSpeed: (2 * Math.PI / 240) * AU,
    },
    {
        name: 'venus',
        radius: 0.94 * ER,
        distance: sunSize + (0.72 * AU),
        rotate: 0.005,
        orbit: 2 * Math.PI * AU * AU,
        lineSpeed: (2 * Math.PI / 610) * AU,
    },
    {
        name: 'earth',
        radius: ER,
        distance: sunSize + AU,
        rotate: 0.02,
        orbit: 2 * Math.PI * AU,
        lineSpeed: (2 * Math.PI / 1000) * AU,
    },
    {
        name: 'moon',
        radius: 0.34 * ER,
        distance: (3*sunSize) + (0.387 * AU) + (0.72 * AU) + AU + ER + ER,
        rotate: 0.01,
        orbit: 2 * Math.PI * AU * AU,
        lineSpeed: (2 * Math.PI / 1000) * AU,
    },
    {
        name: 'mars',
        radius: 0.53 * ER,
        distance: sunSize + (1.523 * AU),
        rotate: 0.01,
        orbit: 2 * Math.PI * AU * AU,
        lineSpeed: (2 * Math.PI / 1880) * AU,
    },
    {
        name: 'jupiter',
        radius: 11.2 * ER,
        distance: sunSize + (5.2 * AU),
        rotate: 0.09,
        orbit: 2 * Math.PI * AU * AU,
        lineSpeed: (2 * Math.PI / 11000) * AU,
    },
    {
        name: 'saturn',
        radius: 9.45 * ER,
        distance: sunSize + (9.53 * AU),
        rotate: 0.01,
        orbit: 2 * Math.PI * AU * AU,
        lineSpeed: (2 * Math.PI / 29440) * AU,
    },
    {
        name: 'uranus',
        radius: 4 * ER,
        distance: sunSize + (19.19 * AU),
        rotate: 0.01,
        orbit: 2 * Math.PI * AU * AU,
        lineSpeed: (2 * Math.PI / 84070) * AU,
    },
    {
        name: 'neptune',
        radius: 3.88 * ER,
        distance: sunSize + (30.06 * AU),
        rotate: 0.01,
        orbit: 2 * Math.PI * AU * AU,
        lineSpeed: (2 * Math.PI / 164870) * AU,
    }
];

const dataArray = {
    'sun' : '<h2> Sun </h2> <p> The Sun is the Solar Systems star and by far its most massive component. Its large mass (332,900 Earth masses), which comprises 99.86% of all the mass in the Solar System. </p> <p> It produces temperatures and densities in its core high enough to sustain nuclear fusion of hydrogen into helium, making it a main-sequence star. This releases an enormous amount of energy, mostly radiated into space as electromagnetic radiation peaking in visible light.</p>',

    'mercury' : '<h2> Mercury </h2> <p>Mercury (0.4 AU from the Sun) is the closest planet to the Sun and on average, all seven other planets. The smallest planet in the Solar System (0.055 M⊕), Mercury has no natural satellites.</p> <p> Mercury has very tenuous atmosphere consists of atoms blasted off its surface by the solar wind. Its relatively large iron core and thin mantle have not yet been adequately explained </p>',

    'venus' : '<h2> Venus </h2> <p>',

    'earth' : ' <h2> Earth </h2> <p> </p>    ',

    'mars' : ' <h2> Mars </h2> <p> </p>    ',

    'jupiter' : ' <h2> Jupiter  </h2>  <p></p>   ',

    'saturn' : ' <h2> Saturn </h2>  <p></p>  ',

    'uranus' : ' <h2> Uranus </h2>   <p></p>   ',

    'neptune' : ' <h2> Neptune </h2>  <p> </p> ',

}
const helpers = (scene) => {
    const axis = new THREE.AxisHelper(20);
    scene.add(axis);
    const radius = 20;    const radials = 20;    const circles = 20;    const divisions = 64;
    const gridHelper = new THREE.PolarGridHelper( radius, radials, circles, divisions );
    scene.add(gridHelper);
};

init();
render();

window.addEventListener("click", onMouseMove, false);

function init() {
  // Funcion de inicializacion de motor, escena y camara
  // Motor de render

  renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
  renderer.setSize(window.innerWidth * 0.99, window.innerHeight * 0.99);
  document.body.appendChild(renderer.domElement);

  //Escena
  scene = new THREE.Scene();

  //Camara perspectiva
  var aspectRatio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(100, aspectRatio, 0.01, 1000);
  camera.position.z = 1;

  var cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
  cameraControls.target.set(0,0,0); //in che punto guardare la camera
  cameraControls.noZoom = false;

  // Description panel
  descPanel = document.getElementById('description');

  // Light - Sun
  const light = new THREE.SpotLight(0xff0000);
  light.position.set(0, 1, 0);
  const pointLight = new THREE.PointLight(0xffffff, 1, Infinity);
  pointLight.position.set(0, 1, 0);
  scene.add(light);
  scene.add(pointLight);

  camera.position.set(10, 40, 100);
  //controls.update();

  // Create Solar System
  solarSystemCreate(scene, planets);

  //se modifico la finestra del browser, l'immagine viene tagliata dove diminuisco
  //se invece voglio che l'immagini si dimensioni di conseguenza, creo una funzione
  window.addEventListener('resize', updateAspectRatio);

}
/**
 * Create planets and sun then save to global object
 * @param {object} scene
 * @param {object} planets
 * @param {function} render
 */

function solarSystemCreate(scene, planets){
    var loader = new THREE.TextureLoader();
    var texture, orbitCircle, orbit;
    var path = "images/"; //path per il caricamento delle immagini

    const bgTexture = loader.load(path + "2k_stars_milky_way.jpg");
    scene.background = bgTexture;

    var texSun = loader.load( path+"2k_sun.jpg"); //carico l'immagine da posizionare sul cubo
    //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    //texture.matrixAutoUpdate = false;
    var texEarth = loader.load(path+"2k_earth_daymap.jpg");
    var texMercury = loader.load(path+"2k_mercury.jpg");
    var texVenus = loader.load(path+"2k_venus_surface.jpg");
    var texMars = loader.load(path+"2k_mars.jpg");
    var texJupiter = loader.load(path+"2k_jupiter.jpg");
    var texSaturn = loader.load(path+"2k_saturn.jpg");
    var texUranus = loader.load(path+"2k_uranus.jpg");
    var texNeptune = loader.load(path+"2k_neptune.jpg");
    var texMoon = loader.load(path+"2k_moon.jpg");

    texSun.minFilter = THREE.LinearFilter;
    texSun.magFilter = THREE.LinearFilter;

    solarSystemData.map(sphere => {
        switch (sphere.name) {
            case "sun":
                planets[sphere.name] = new THREE.Mesh(new THREE.SphereGeometry(sphere.radius, 32, 32), new THREE.MeshBasicMaterial({ map: texSun}));
                planets[sphere.name].name = sphere.name;
                scene.add(planets[sphere.name]);
                break;
            case "earth":
                planets[sphere.name] = new THREE.Mesh(new THREE.SphereGeometry(sphere.radius, 32, 32), new THREE.MeshPhongMaterial({
                    specular: 0x050505,
                    shininess: 100,
                    map: texEarth
                }));
                orbitCircle = new THREE.EllipseCurve(0, 0, sphere.distance, sphere.distance, 0, 2 * Math.PI, false, 0);
                orbit = new THREE.Line(new THREE.Geometry().setFromPoints(orbitCircle.getPoints(64)), new THREE.LineBasicMaterial({color: 0x056d64}));
                orbit.rotateX(0.5 * Math.PI);
                scene.add(orbit);
                planets[sphere.name].name = sphere.name;
                scene.add(planets[sphere.name]);
                break;
            case "moon":
                planets[sphere.name] = new THREE.Mesh(new THREE.SphereGeometry(sphere.radius, 32, 32), new THREE.MeshPhongMaterial({
                  specular: 0x050505,
                  shininess: 100,
                  map : texMoon
                }));
                planets[sphere.name].name = sphere.name;
                scene.add(planets[sphere.name]);
                break;
            case "mercury":
                planets[sphere.name] = new THREE.Mesh(new THREE.SphereGeometry(sphere.radius, 32, 32), new THREE.MeshPhongMaterial({
                    specular: 0x050505,
                    shininess: 100,
                    map: texMercury
                  }));
                  orbitCircle = new THREE.EllipseCurve(0, 0, sphere.distance, sphere.distance, 0, 2 * Math.PI, false, 0);
                  orbit = new THREE.Line(new THREE.Geometry().setFromPoints(orbitCircle.getPoints(64)), new THREE.LineBasicMaterial({color: 0x056d64}));
                  orbit.rotateX(0.5 * Math.PI);
                  scene.add(orbit);
                  planets[sphere.name].name = sphere.name;
                  scene.add(planets[sphere.name]);
                  break;
            case "venus":
                planets[sphere.name] = new THREE.Mesh(new THREE.SphereGeometry(sphere.radius, 32, 32), new THREE.MeshPhongMaterial({
                    specular: 0x050505,
                    shininess: 100,
                    map: texVenus
                }));
                // Create orbit
                orbitCircle = new THREE.EllipseCurve(0, 0, sphere.distance, sphere.distance, 0, 2 * Math.PI, false, 0);
                orbit = new THREE.Line(new THREE.Geometry().setFromPoints(orbitCircle.getPoints(64)), new THREE.LineBasicMaterial({color: 0x056d64}));
                orbit.rotateX(0.5 * Math.PI);
                scene.add(orbit);
                planets[sphere.name].name = sphere.name;
                scene.add(planets[sphere.name]);
                break;
            case "mars":
                planets[sphere.name] = new THREE.Mesh(new THREE.SphereGeometry(sphere.radius, 32, 32), new THREE.MeshPhongMaterial({
                    specular: 0x050505,
                    shininess: 100,
                    map: texMars
                }));
                orbitCircle = new THREE.EllipseCurve(0, 0, sphere.distance, sphere.distance, 0, 2 * Math.PI, false, 0);
                orbit = new THREE.Line(new THREE.Geometry().setFromPoints(orbitCircle.getPoints(64)), new THREE.LineBasicMaterial({color: 0x056d64}));
                orbit.rotateX(0.5 * Math.PI);
                scene.add(orbit);
                planets[sphere.name].name = sphere.name;
                scene.add(planets[sphere.name]);
                break;
            case "jupiter":
                planets[sphere.name] = new THREE.Mesh(new THREE.SphereGeometry(sphere.radius, 32, 32), new THREE.MeshPhongMaterial({
                    specular: 0x050505,
                    shininess: 100,
                    map: texJupiter
                }));
                orbitCircle = new THREE.EllipseCurve(0, 0, sphere.distance, sphere.distance, 0, 2 * Math.PI, false, 0);
                orbit = new THREE.Line(new THREE.Geometry().setFromPoints(orbitCircle.getPoints(64)), new THREE.LineBasicMaterial({color: 0x056d64}));
                orbit.rotateX(0.5 * Math.PI);
                scene.add(orbit);
                planets[sphere.name].name = sphere.name;
                scene.add(planets[sphere.name]);
                break;
            case "saturn":
                planets[sphere.name] = new THREE.Mesh(new THREE.SphereGeometry(sphere.radius, 32, 32), new THREE.MeshPhongMaterial({
                    specular: 0x050505,
                    shininess: 100,
                    map: texSaturn
                }));
                orbitCircle = new THREE.EllipseCurve(0, 0, sphere.distance, sphere.distance, 0, 2 * Math.PI, false, 0);
                orbit = new THREE.Line(new THREE.Geometry().setFromPoints(orbitCircle.getPoints(64)), new THREE.LineBasicMaterial({color: 0x056d64}));
                orbit.rotateX(0.5 * Math.PI);
                scene.add(orbit);
                planets[sphere.name].name = sphere.name;
                scene.add(planets[sphere.name]);
                break;
            case "uranus":
                planets[sphere.name] = new THREE.Mesh(new THREE.SphereGeometry(sphere.radius, 32, 32), new THREE.MeshPhongMaterial({
                    specular: 0x050505,
                    shininess: 100,
                    map: texUranus
                }));
                orbitCircle = new THREE.EllipseCurve(0, 0, sphere.distance, sphere.distance, 0, 2 * Math.PI, false, 0);
                orbit = new THREE.Line(new THREE.Geometry().setFromPoints(orbitCircle.getPoints(64)), new THREE.LineBasicMaterial({color: 0x056d64}));
                orbit.rotateX(0.5 * Math.PI);
                scene.add(orbit);
                planets[sphere.name].name = sphere.name;
                scene.add(planets[sphere.name]);
                break;
            case "neptune":
                planets[sphere.name] = new THREE.Mesh(new THREE.SphereGeometry(sphere.radius, 32, 32), new THREE.MeshPhongMaterial({
                    specular: 0x050505,
                    shininess: 100,
                    map: texNeptune
                }));
                orbitCircle = new THREE.EllipseCurve(0, 0, sphere.distance, sphere.distance, 0, 2 * Math.PI, false, 0);
                orbit = new THREE.Line(new THREE.Geometry().setFromPoints(orbitCircle.getPoints(64)), new THREE.LineBasicMaterial({color: 0x056d64}));
                orbit.rotateX(0.5 * Math.PI);
                scene.add(orbit);
                planets[sphere.name].name = sphere.name;
                scene.add(planets[sphere.name]);
                break;
            }
        });

    renderer.domElement.addEventListener('click',onMouseMove);
}

/**
 * Map all planets and change it position, rotation etc.
 * @param {object} planets
 */
function solarSystemMove(planets){
    solarSystemData.map(sphere => {
        if (sphere.name == "moon"){
            sphere.orbit += sphere.lineSpeed * 0.01;
            planets[sphere.name].rotateY(sphere.rotate);
            planets[sphere.name].position.x = sphere.distance;
            planets[sphere.name].position.z = Math.sin(sphere.orbit);
        }else{
            sphere.orbit += sphere.lineSpeed * 0.01;
            planets[sphere.name].rotateY(sphere.rotate);
            planets[sphere.name].position.x = Math.cos(sphere.orbit) * sphere.distance;
            planets[sphere.name].position.z = Math.sin(sphere.orbit) * sphere.distance;
        }
    });
}

function updateAspectRatio(){
  //mantiene la relazioni di aspetto tra bordi e camera
  var aspectRatio = window.innerWidth/window.innerHeight;
  //renovar medidas de viewport
  renderer.setSize(window.innerWidth, window.innerHeight);
  // para la perspectiva
  camera.aspect = aspectRatio;

  //Hay que actualizar la matriz de proyeccion
  camera.updateProjectionMatrix();
}

/**
 * Animate object on scene
 */
function animate() {
    //cameraControls.update();
    solarSystemMove(planets);
}

function render() {
  // Bucle de refresco
  animate();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

/*
 * Mouse control
 * @param {*} event
*/
function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    //event.preventDefault();
    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );
    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        descPanel.innerHTML = intersects[0].object.name;
        displayData(intersects[0].object);
    } else {
        descPanel.style.display = "none";
    }
}

/*
 * Display information about planets
 * @param {object} object
*/

function displayData (object) {
    if(object.name !== ''){
        const data = dataArray[object.name];
        descPanel.innerHTML = data;
        descPanel.style.display = "block";
    }
    else {
        descPanel.style.display = "none";
    }
}
