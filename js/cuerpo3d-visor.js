// Visor del cuerpo humano 3D (three.js). Lo carga app.js con import() solo al abrir #/cuerpo-3d.
// Los grupos y su lugar dentro de modelos/cuerpo3d.bin vienen de js/cuerpo3d.js (scripts/generar_cuerpo3d.py).
import * as THREE from "../vendor/three/three.module.min.js";
import { OrbitControls } from "../vendor/three/OrbitControls.js";

let datos = null; // el .bin se descarga una sola vez por sesión
const RESALTE = new THREE.Color("#f5b83d");

export async function montar(cont, { alSeleccionar }) {
  const M = CUERPO3D;
  if (!datos) datos = await (await fetch("modelos/cuerpo3d.bin")).arrayBuffer();
  if (!cont.isConnected) return null;

  const escena = new THREE.Scene();
  const camara = new THREE.PerspectiveCamera(32, 1, 0.05, 20);
  const render = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  render.setPixelRatio(Math.min(devicePixelRatio, 2));
  cont.appendChild(render.domElement);
  escena.add(new THREE.HemisphereLight("#fff8f0", "#5a4a55", 1.6));
  const luz = new THREE.DirectionalLight("#ffffff", 1.8);
  camara.add(luz);
  luz.position.set(0.6, 1, 0.4);
  escena.add(camara);

  // BodyParts3D: x = lado, y = atrás(+)/adelante(-), z = arriba (mm). En three.js: y arriba, z hacia el frente (m).
  const tam = [0, 1, 2].map((k) => M.max[k] - M.min[k]);
  const centro = [0, 1, 2].map((k) => (M.max[k] + M.min[k]) / 2);
  const mallas = M.grupos.map((g, n) => {
    const q = new Uint16Array(datos, g.v[0], g.v[1] * 3);
    const pos = new Float32Array(g.v[1] * 3);
    for (let i = 0; i < g.v[1]; i++) {
      const p = [0, 1, 2].map((k) => M.min[k] + (q[i * 3 + k] / 65535) * tam[k] - centro[k]);
      pos[i * 3] = -p[0] / 1000;
      pos[i * 3 + 1] = p[2] / 1000;
      pos[i * 3 + 2] = -p[1] / 1000;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setIndex(new THREE.BufferAttribute(new Uint32Array(datos, g.i[0], g.i[1]), 1));
    geo.computeVertexNormals();
    geo.computeBoundingSphere();
    const mat = new THREE.MeshStandardMaterial({ color: g.color, roughness: 0.55, metalness: 0.05, side: THREE.DoubleSide });
    const m = new THREE.Mesh(geo, mat);
    m.userData = { n, g, color: new THREE.Color(g.color) };
    escena.add(m);
    return m;
  });

  let capa = "musculos", elegido = -1, auto = false;
  const tocables = () => mallas.filter((m) => m.visible && m.userData.g.capa === capa);
  function pintar() {
    mallas.forEach((m) => {
      const g = m.userData.g, mat = m.material;
      // En músculos y órganos el esqueleto se ve de fondo (en órganos, como fantasma) y no se puede tocar.
      m.visible = g.capa === capa || (g.capa === "esqueleto" && capa !== "esqueleto");
      const fondo = g.capa !== capa;
      mat.transparent = fondo && capa === "organos";
      mat.opacity = mat.transparent ? 0.18 : 1;
      mat.depthWrite = !mat.transparent;
      mat.color.copy(m.userData.n === elegido ? RESALTE : m.userData.color);
      mat.emissive.set(m.userData.n === elegido ? "#5a3600" : "#000000");
    });
  }

  // Cámara: gira alrededor del cuerpo; se puede acercar con dos dedos.
  const ctl = new OrbitControls(camara, render.domElement);
  ctl.enableDamping = true;
  ctl.minDistance = 0.35;
  ctl.maxDistance = 4.5;
  ctl.autoRotateSpeed = 2.5;
  const ALTO = tam[2] / 1000;
  function mirar(angulo, y = 0, dist = ALTO * 1.95) {
    const ini = camara.position.clone(), fin = new THREE.Vector3(Math.sin(angulo) * dist, y + dist * 0.08, Math.cos(angulo) * dist);
    const t0 = ctl.target.clone(), t1 = new THREE.Vector3(0, y, 0);
    const inicio = performance.now();
    (function paso() {
      const k = Math.min(1, (performance.now() - inicio) / 450), e = k * (2 - k);
      camara.position.lerpVectors(ini, fin, e);
      ctl.target.lerpVectors(t0, t1, e);
      if (k < 1) requestAnimationFrame(paso);
    })();
  }
  camara.position.set(0, 0, ALTO * 1.95);

  // Tocar una parte (sin arrastrar) la selecciona.
  const ray = new THREE.Raycaster(), punto = new THREE.Vector2();
  let abajo = null;
  render.domElement.addEventListener("pointerdown", (e) => (abajo = [e.clientX, e.clientY]));
  render.domElement.addEventListener("pointerup", (e) => {
    if (!abajo || Math.hypot(e.clientX - abajo[0], e.clientY - abajo[1]) > 8) return;
    const r = render.domElement.getBoundingClientRect();
    punto.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(punto, camara);
    const hit = ray.intersectObjects(mallas.filter((m) => m.visible && !m.material.transparent), false)[0];
    if (hit && hit.object.userData.g.capa === capa) seleccionar(hit.object.userData.n, false);
  });

  function seleccionar(n, girar = true) {
    elegido = n;
    pintar();
    if (n < 0) return;
    if (girar) {
      const c = mallas[n].geometry.boundingSphere.center;
      // Gira hacia el lado donde está la parte (frente o espalda) y se acerca un poco.
      mirar(Math.abs(c.z) < 0.02 ? 0 : c.z > 0 ? 0 : Math.PI, c.y * 0.6, ALTO * 1.45);
    }
    alSeleccionar(n, M.grupos[n]);
  }

  const tam0 = () => {
    const w = cont.clientWidth, h = cont.clientHeight;
    render.setSize(w, h, false);
    camara.aspect = w / h;
    camara.updateProjectionMatrix();
  };
  new ResizeObserver(tam0).observe(cont);
  tam0();
  pintar();
  (function ciclo() {
    if (!cont.isConnected) return render.dispose();
    ctl.autoRotate = auto;
    ctl.update();
    render.render(escena, camara);
    requestAnimationFrame(ciclo);
  })();

  return {
    capa(c) {
      capa = c;
      elegido = -1;
      pintar();
    },
    seleccionar,
    vista(v) {
      mirar({ frente: 0, espalda: Math.PI, lado: Math.PI / 2 }[v]);
    },
    girar(on) {
      auto = on;
    },
    tocables,
  };
}
