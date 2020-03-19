/**
 * Trabajo 1
 * @author Marco Morsiani Cassani
 * @date: 02-03-2020
 */

//il controllo in qualcosa
// variables globales estandar
var renderer, scene, camera, descPanel;
var cameraControls; //per il controllo della camera
var planets = {sun: {}, mercury: {}, venus: {}, earth: {}, moon:{}, mars: {}, jupiter: {}, saturn: {}, uranus: {}, neptune: {}};
var radius=0.45, segments=32;
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
        name: 'moon',
        radius: 0.2727 * ER,
        distance: sunSize + AU + 2*ER,
        rotate: 0.01,
        orbit: 2 * Math.PI * AU,
        lineSpeed: (2 * Math.PI / 1000) * AU,
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
        name: 'mars',
        radius: 0.53 * ER,
        distance: sunSize + (1.523 * AU),
        rotate: 0.004,
        orbit: 2 * Math.PI * AU * AU,
        lineSpeed: (2 * Math.PI / 1880) * AU,
    },
    {
        name: 'jupiter',
        radius: 11.2 * ER,
        distance: sunSize + (5.2 * AU),
        rotate: 0.09,
        orbit: 2 * Math.PI * AU * AU,
        lineSpeed: (2 * Math.PI / 9000) * AU,
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

    'mercury' : '<h2> Mercury </h2> <p>Mercury is the closest planet to the Sun and on average, all seven other planets. The smallest planet in the Solar System (0.055 M⊕), Mercury has no natural satellites.</p> <p> Mercury has very tenuous atmosphere consists of atoms blasted off its surface by the solar wind. Its relatively large iron core and thin mantle have not yet been adequately explained </p>',

    'venus' : '<h2> Venus </h2> <p> Venus is the second planet from the Sun. It is named after the Roman goddess of love and beauty. </p> <p> As the second-brightest natural object in the night sky after the Moon, Venus can cast shadows and, rarely, is visible to the naked eye in broad daylight. With a rotation period of 243 Earth days, it takes longer to rotate about its axis than any planet in the Solar System and does so in the opposite direction to all but Uranus (meaning the Sun rises in the west and sets in the east). </p> <p> Venus does not have any moons, a distinction it shares only with Mercury among planets in the Solar System </p>',

    'earth' : ' <h2> Earth </h2> <p> Earth is the third planet from the Sun and the only astronomical object known to harbor life. According to radiometric dating and other evidence, Earth formed over 4.5 billion years ago. The gravity interacts with other objects in space, especially the Sun and the Moon, which is the only natural satellite of Earth.</p>    ',

    'moon' : '<h2> Moon </h2> <p> The Moon is an astronomical body orbiting Earth as its only natural satellite. It is the fifth-largest satellite in the Solar System, and by far the largest among planetary satellites relative to the size of the planet that it orbits (its primary). </p>',

    'mars' : ' <h2> Mars </h2> <p> Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System after Mercury. It is often referred to as the Red Planet and this refers to the effect of the iron oxide prevalent on Mars surface, which gives it a reddish appearance distinctive among the astronomical bodies visible to the naked eye.</p>  <p> Mars has surface features reminiscent both of the impact craters of the Moon and the valleys, deserts, and polar ice caps of Earth </p>  ',

    'jupiter' : ' <h2> Jupiter  </h2>  <p>Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass one-thousandth that of the Sun, but two-and-a-half times that of all the other planets in the Solar System combined. Jupiter is one of the brightest objects visible to the naked eye in the night sky. </p> <p> When viewed from Earth, Jupiter can be bright enough for its reflected light to cast shadows, and is on average the third-brightest natural object in the night sky after the Moon and Venus. </p>   ',

    'saturn' : ' <h2> Saturn </h2>  <p>Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It is a gas giant with an average radius of about nine times that of Earth.</p> <p> It only has one-eighth the average density of Earth; however, with its larger volume, Saturn is over 95 times more massive. </p> ',

    'uranus' : ' <h2> Uranus </h2> <p>Uranus is the seventh planet from the Sun. It has the third-largest planetary radius and fourth-largest planetary mass in the Solar System. </p> <p> ranus is similar in composition to Neptune, and both have bulk chemical compositions which differ from that of the larger gas giants Jupiter and Saturn. For this reason, scientists often classify Uranus and Neptune as "ice giants" to distinguish them from the gas giants. </p>  ',

    'neptune' : ' <h2> Neptune </h2>  <p>Neptune is the eighth and farthest known planet from the Sun in the Solar System. In the Solar System, it is the fourth-largest planet by diameter, the third-most-massive planet, and the densest giant planet. </p><p> Neptune is 17 times the mass of Earth, slightly more massive than its near-twin Uranus. Neptune is denser and physically smaller than Uranus because its greater mass causes more gravitational compression of its atmosphere. </p> ',

}
/*
const helpers = (scene) => {
    const axis = new THREE.AxisHelper(20);
    scene.add(axis);
    const radius = 20;    const radials = 20;    const circles = 20;    const divisions = 64;
    const gridHelper = new THREE.PolarGridHelper( radius, radials, circles, divisions );
    scene.add(gridHelper);
};*/

init();
render();

window.addEventListener("click", onMouseMove, false);

function init() {
  // Funcion de inicializacion de motor, escena y camara
  // Motor de render

  renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
  renderer.setSize(window.innerWidth * 0.99, window.innerHeight * 0.99);
  document.body.appendChild(renderer.domElement);
  renderer.shadowMapEnabled = true;

  //Escena
  scene = new THREE.Scene();

  //Camara perspectiva
  var aspectRatio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(20, aspectRatio, 0.1, 1000);
  camera.position.z = 1;

  var cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
  cameraControls.target.set(0,0,0); //in che punto guardare la camera
  cameraControls.noZoom = false;

  // Description panel
  descPanel = document.getElementById('description');

  // Light - Sun
  /*const light = new THREE.SpotLight(0xff0000);
  light.position.set(0, 1, 0);
  light.castShadow = true;*/
  const pointLight = new THREE.PointLight(0xffffff, 1, Infinity);
  pointLight.position.set(0, 1, 0);
  pointLight.castShadow = true;
  //scene.add(light);
  scene.add(pointLight);

  //Light Ambient
  var lightAmb = new THREE.AmbientLight( 0x404040); // soft white light
  scene.add( lightAmb );

  camera.position.set(1, 1, 100);

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
    var texRings = loader.load(path+"2k_saturn_ring_alpha.png");var texMoon = loader.load(path+"2k_moon.jpg");
    var texMoon = loader.load(path+"2k_moon.jpg");

    var ringSegments = 70;
    var innerRadius, outerRadius, ring;
    var saturnOuterRadius = 9.45 * ER;

    texSun.minFilter = THREE.LinearFilter;
    texSun.magFilter = THREE.LinearFilter;

    solarSystemData.map(sphere => {
        switch (sphere.name) {
            case "sun":
                planets[sphere.name] = new THREE.Mesh(new THREE.SphereGeometry(sphere.radius, 32, 32), new THREE.MeshBasicMaterial({ map: texSun}));
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
                planets[sphere.name].receiveShadow = true;
                scene.add(planets[sphere.name]);
                break;
            case "earth":
                planets[sphere.name] = new THREE.Mesh(new THREE.SphereBufferGeometry(sphere.radius, 32, 32), new THREE.MeshPhongMaterial({
                    specular: 0x050505,
                    shininess: 100,
                    map: texEarth
                }));
                orbitCircle = new THREE.EllipseCurve(0, 0, sphere.distance, sphere.distance, 0, 2 * Math.PI, false, 0);
                orbitEarth = new THREE.Line(new THREE.Geometry().setFromPoints(orbitCircle.getPoints(64)), new THREE.LineBasicMaterial({color: 0x808080}));
                orbitEarth.rotateX(0.5 * Math.PI);
                scene.add(orbitEarth);
                planets[sphere.name].name = sphere.name;
                planets[sphere.name].receiveShadow = planets[sphere.name].castShadow = true;
                scene.add(planets[sphere.name]);
                break;
            case "mercury":
                planets[sphere.name] = new THREE.Mesh(new THREE.SphereGeometry(sphere.radius, 32, 32), new THREE.MeshPhongMaterial({
                    specular: 0x050505,
                    shininess: 100,
                    map: texMercury
                  }));
                  orbitCircle = new THREE.EllipseCurve(0, 0, sphere.distance, sphere.distance, 0, 2 * Math.PI, false, 0);
                  orbit = new THREE.Line(new THREE.Geometry().setFromPoints(orbitCircle.getPoints(64)), new THREE.LineBasicMaterial({color: 0x808080}));
                  orbit.rotateX(0.5 * Math.PI);
                  scene.add(orbit);
                  planets[sphere.name].name = sphere.name;
                  planets[sphere.name].receiveShadow = planets[sphere.name].castShadow = true;
                  scene.add(planets[sphere.name]);
                  break;
            case "venus":
                planets[sphere.name] = new THREE.Mesh(new THREE.SphereGeometry(sphere.radius, 32, 32), new THREE.MeshPhongMaterial({
                    specular: 0x050505,
                    shininess: 100,
                    map: texVenus
                }));
                orbitCircle = new THREE.EllipseCurve(0, 0, sphere.distance, sphere.distance, 0, 2 * Math.PI, false, 0);
                orbit = new THREE.Line(new THREE.Geometry().setFromPoints(orbitCircle.getPoints(64)), new THREE.LineBasicMaterial({color: 0x808080}));
                orbit.rotateX(0.5 * Math.PI);
                scene.add(orbit);
                planets[sphere.name].name = sphere.name;
                planets[sphere.name].receiveShadow = planets[sphere.name].castShadow = true;
                scene.add(planets[sphere.name]);
                break;
            case "mars":
                planets[sphere.name] = new THREE.Mesh(new THREE.SphereGeometry(sphere.radius, 32, 32), new THREE.MeshPhongMaterial({
                    specular: 0x050505,
                    shininess: 100,
                    map: texMars
                }));
                orbitCircle = new THREE.EllipseCurve(0, 0, sphere.distance, sphere.distance, 0, 2 * Math.PI, false, 0);
                orbit = new THREE.Line(new THREE.Geometry().setFromPoints(orbitCircle.getPoints(64)), new THREE.LineBasicMaterial({color: 0x808080}));
                orbit.rotateX(0.5 * Math.PI);
                scene.add(orbit);
                planets[sphere.name].name = sphere.name;
                planets[sphere.name].receiveShadow = planets[sphere.name].castShadow = true;
                scene.add(planets[sphere.name]);
                break;
            case "jupiter":
                planets[sphere.name] = new THREE.Mesh(new THREE.SphereBufferGeometry(sphere.radius, 32, 32), new THREE.MeshPhongMaterial({
                    specular: 0x050505,
                    shininess: 100,
                    map: texJupiter
                }));
                orbitCircle = new THREE.EllipseCurve(0, 0, sphere.distance, sphere.distance, 0, 2 * Math.PI, false, 0);
                orbit = new THREE.Line(new THREE.Geometry().setFromPoints(orbitCircle.getPoints(64)), new THREE.LineBasicMaterial({color: 0x808080}));
                orbit.rotateX(0.5 * Math.PI);
                scene.add(orbit);
                planets[sphere.name].name = sphere.name;
                planets[sphere.name].receiveShadow = planets[sphere.name].castShadow = true;
                scene.add(planets[sphere.name]);
                break;
            case "saturn":
                planets[sphere.name] = new THREE.Mesh(new THREE.SphereGeometry(sphere.radius, 32, 32), new THREE.MeshPhongMaterial({
                    specular: 0x050505,
                    shininess: 100,
                    map: texSaturn
                }));
                orbitCircle = new THREE.EllipseCurve(0, 0, sphere.distance, sphere.distance, 0, 2 * Math.PI, false, 0);
                orbit = new THREE.Line(new THREE.Geometry().setFromPoints(orbitCircle.getPoints(64)), new THREE.LineBasicMaterial({color: 0x808080}));
                orbit.rotateX(0.5 * Math.PI);
                scene.add(orbit);
                saturnRing = createRing(10.45 * ER, 20.45 * ER, 280, texRings);
                planets[sphere.name].name = sphere.name;
                planets[sphere.name].receiveShadow = planets[sphere.name].castShadow = true;
                scene.add(saturnRing);
                scene.add(planets[sphere.name]);
                break;
            case "uranus":
                planets[sphere.name] = new THREE.Mesh(new THREE.SphereGeometry(sphere.radius, 32, 32), new THREE.MeshPhongMaterial({
                    specular: 0x050505,
                    shininess: 100,
                    map: texUranus
                }));
                orbitCircle = new THREE.EllipseCurve(0, 0, sphere.distance, sphere.distance, 0, 2 * Math.PI, false, 0);
                orbit = new THREE.Line(new THREE.Geometry().setFromPoints(orbitCircle.getPoints(64)), new THREE.LineBasicMaterial({color: 0x808080}));
                orbit.rotateX(0.5 * Math.PI);
                scene.add(orbit);
                planets[sphere.name].name = sphere.name;
                planets[sphere.name].receiveShadow = planets[sphere.name].castShadow = true;
                scene.add(planets[sphere.name]);
                break;
            case "neptune":
                planets[sphere.name] = new THREE.Mesh(new THREE.SphereGeometry(sphere.radius, 32, 32), new THREE.MeshPhongMaterial({
                    specular: 0x050505,
                    shininess: 100,
                    map: texNeptune
                }));
                orbitCircle = new THREE.EllipseCurve(0, 0, sphere.distance, sphere.distance, 0, 2 * Math.PI, false, 0);
                orbit = new THREE.Line(new THREE.Geometry().setFromPoints(orbitCircle.getPoints(64)), new THREE.LineBasicMaterial({color: 0x808080}));
                orbit.rotateX(0.5 * Math.PI);
                scene.add(orbit);
                planets[sphere.name].name = sphere.name;
                planets[sphere.name].receiveShadow = planets[sphere.name].castShadow = true;
                scene.add(planets[sphere.name]);
                break;
            }
        });
        solarSystemData.map(sphere => {
          planets[sphere.name].traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
              child.castShadow = true;
            }
          })
        });
    renderer.domElement.addEventListener('click',onMouseMove);
}
/**
 * Map all planets and change it position, rotation etc.
 * @param {object} planets
 */
function solarSystemMove(planets){
    solarSystemData.map(sphere => {
        if (sphere.name == "saturn"){
            sphere.orbit += sphere.lineSpeed * 0.01;
            planets[sphere.name].rotateY(sphere.rotate);
            planets[sphere.name].position.x = Math.cos(sphere.orbit) * sphere.distance;
            planets[sphere.name].position.z = Math.sin(sphere.orbit) * sphere.distance;
            saturnRing.position.x = Math.cos(sphere.orbit) * sphere.distance;
            saturnRing.position.z = Math.sin(sphere.orbit) * sphere.distance;
        }else{
            sphere.orbit += sphere.lineSpeed * 0.01;
            planets[sphere.name].rotateY(sphere.rotate); //su se stesso
            planets[sphere.name].position.x = Math.cos(sphere.orbit) * sphere.distance;
            planets[sphere.name].position.z = Math.sin(sphere.orbit) * sphere.distance;
        }
    });
}

function createRing(radius, width, height, texture) {
    var geometry = new THREE.RingGeometry(radius, width, height);
    var material = new THREE.MeshPhongMaterial({
                                                   map: texture,
                                                   side: THREE.DoubleSide,
                                                   transparent: true,
                                                   opacity: 0.90
                                               });
    var ring = new THREE.Mesh(geometry, material);
    ring.position.set(sunSize + (9.53 * AU),0,0);
    ring.rotation.x = Math.PI / 2;
    return ring;
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
