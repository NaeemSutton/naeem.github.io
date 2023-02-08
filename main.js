import * as THREE from "three";
import "./style.css";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

//scene
const scene = new THREE.Scene();

//sphere
const geometry = new THREE.SphereGeometry(3, 64, 64);

//material
const material = new THREE.MeshStandardMaterial({
  color: "#FB9BB9",
});

//combine material and sphere togther
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//lights
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 10); //x,y,z position
scene.add(light);

const light2 = new THREE.PointLight(0xffffff, 1, 100);
light2.position.set(10, 10, 0);
scene.add(light2);

//camera...45 is FOV & 800/600 is aspect ratio
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 20;
scene.add(camera);

//renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGL1Renderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2); //smooths out the edges
renderer.render(scene, camera);

//controls lets me move it whoo
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false; //removes pan effect
controls.enableZoom = false; // removes zoom effect
controls.autoRotate = true;
controls.autoRotateSpeed = 2;

//Resize
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  //update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
  controls.update(); //updates my control
  renderer.render(scene, camera); //renders the screen inifinitely
  window.requestAnimationFrame(loop);
};
loop();

//timeLine magicc allows us to sync mult animations

const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
tl.fromTo("nav", { y: "-100%" }, { y: "0%" });
tl.fromTo(".title", { opacity: 0 }, { opacity: 1 });
tl.fromTo(".sub-text", { opacity: 0 }, { opacity: 1 });
tl.fromTo(".image", { opacity: 0 }, { opacity: 1 });
tl.fromTo(".image2", { opacity: 0 }, { opacity: 1 });

//mouse animation color
let mouseDown = false;
let rgb = [12, 23, 55];
window.addEventListener("mousedown", () => (mouseDown = true));
window.addEventListener("mouseup", () => (mouseDown = false));

window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ];
    //lets animate
    let newColor = new THREE.Color(`rbg(${rgb.join(",")})`);
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});
