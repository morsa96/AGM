/**
 * Practica #2:
 * @author Marco Morsiani Cassani
 * @date: 02-03-2020
 */

//aggiungere una interfaccia per ogni pianeta
const helpers = (scene) => {
    const axis = new THREE.AxisHelper(20);
    scene.add(axis);
    const radius = 20;
    const radials = 20;
    const circles = 20;
    const divisions = 64;
    const gridHelper = new THREE.PolarGridHelper( radius, radials, circles, divisions );
    scene.add(gridHelper);
};


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
