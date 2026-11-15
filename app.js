// Sahne, Kamera ve Renderer Kurulumu
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 7;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild(renderer.domElement);

// Gerçekçi Uzay Işıklandırması (Güneş terminatörü ve hafif uzay dolgusu)
const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.12);
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0xfffbeb, 0x1e293b, 0.22);
scene.add(hemiLight);

const sunLight = new THREE.DirectionalLight(0xfff8e7, 1.85);
sunLight.position.set(6, 2.5, 5);
scene.add(sunLight);

const sunDirection = sunLight.position.clone().normalize();

// Yıldız Parıltısı İçin Yumuşak Dairesel Doku (64x64 Radyal Parlama)
function createStarSpriteTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.23, 'rgba(255, 255, 255, 0.98)');
  grad.addColorStop(0.46, 'rgba(255, 255, 255, 0.66)');
  grad.addColorStop(0.74, 'rgba(255, 255, 255, 0.17)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

// 4500 Yıldızlı, 3 Katmanlı ve Titreşim (Twinkle) Animasyonlu Uzay Arka Planı
const starLayers = [];
const starLayerSummary = [];

function createStars() {
  const starSprite = createStarSpriteTexture();
  starLayers.length = 0;
  starLayerSummary.length = 0;

  const layers = [
    {
      name: 'deep-dust',
      count: 3200,
      size: 0.26,
      minR: 32,
      maxR: 62,
      baseOpacity: 0.90,
      twinkleSpeed: 0.95,
      twinkleAmp: 0.09,
      palette: [
        [0.82, 0.88, 1.0],
        [0.95, 0.97, 1.0],
        [1.0, 0.96, 0.88]
      ],
      subGroups: 2
    },
    {
      name: 'mid-ice-white',
      count: 1000,
      size: 0.47,
      minR: 28,
      maxR: 50,
      baseOpacity: 0.92,
      twinkleSpeed: 1.45,
      twinkleAmp: 0.08,
      palette: [
        [1.0, 1.0, 1.0],
        [0.78, 0.92, 1.0],
        [0.64, 0.86, 1.0]
      ],
      subGroups: 2
    },
    {
      name: 'bright-heroes',
      count: 300,
      size: 0.73,
      minR: 25,
      maxR: 42,
      baseOpacity: 0.95,
      twinkleSpeed: 2.1,
      twinkleAmp: 0.05,
      palette: [
        [1.0, 1.0, 1.0],   // Parlak beyaz
        [1.0, 0.86, 0.45], // Altın sarısı
        [0.35, 0.96, 0.92] // Turkuaz
      ],
      subGroups: 2
    }
  ];

  layers.forEach((layer, layerIndex) => {
    starLayerSummary.push({
      name: layer.name,
      count: layer.count,
      size: layer.size
    });

    const groups = layer.subGroups || 1;
    let remaining = layer.count;

    for (let g = 0; g < groups; g++) {
      const subCount = g === groups - 1 ? remaining : Math.floor(layer.count / groups);
      remaining -= subCount;

      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(subCount * 3);
      const colors = new Float32Array(subCount * 3);

      for (let i = 0; i < subCount; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = layer.minR + Math.random() * (layer.maxR - layer.minR);

        const idx = i * 3;
        positions[idx] = r * Math.sin(phi) * Math.cos(theta);
        positions[idx + 1] = r * Math.cos(phi);
        positions[idx + 2] = r * Math.sin(phi) * Math.sin(theta);

        const spec = layer.palette[Math.floor(Math.random() * layer.palette.length)];
        const brightness = layerIndex === 2 ? 0.88 + Math.random() * 0.12 : 0.72 + Math.random() * 0.28;
        colors[idx] = spec[0] * brightness;
        colors[idx + 1] = spec[1] * brightness;
        colors[idx + 2] = spec[2] * brightness;
      }

      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const mat = new THREE.PointsMaterial({
        size: layer.size,
        map: starSprite,
        vertexColors: true,
        transparent: true,
        opacity: layer.baseOpacity,
        toneMapped: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });

      const points = new THREE.Points(geo, mat);
      scene.add(points);

      starLayers.push({
        layerIndex,
        subGroup: g,
        count: subCount,
        points,
        material: mat,
        baseOpacity: layer.baseOpacity,
        twinkleSpeed: layer.twinkleSpeed + g * 0.42,
        twinkleAmp: layer.twinkleAmp,
        phase: layerIndex * 1.85 + g * 2.35
      });
    }
  });
}
createStars();

if (typeof window !== 'undefined') {
  window.getStarfieldStats = () => ({
    totalStars: starLayerSummary.reduce((sum, l) => sum + l.count, 0),
    layerCounts: starLayerSummary.map((l) => l.count),
    layers: starLayers.map((sl) => ({
      layerIndex: sl.layerIndex,
      count: sl.count,
      opacity: sl.material ? sl.material.opacity : sl.baseOpacity,
      twinkleSpeed: sl.twinkleSpeed,
      phase: sl.phase
    }))
  });
}

// Belirlenimci Sözde Rastgele Sayı Üreteci (Mulberry32)
function createRng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Dikişsiz Küresel Yüzeyler İçin 3B Perlin Gradyan Gürültüsü ve FBM
function createNoise3D(seed) {
  const rng = createRng(seed);
  const perm = new Uint8Array(512);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = p[i];
    p[i] = p[j];
    p[j] = tmp;
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function lerp(a, b, t) {
    return a + t * (b - a);
  }

  function grad(hash, x, y, z) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  function noise(x, y, z) {
    const fx = Math.floor(x);
    const fy = Math.floor(y);
    const fz = Math.floor(z);
    const X = fx & 255;
    const Y = fy & 255;
    const Z = fz & 255;

    x -= fx;
    y -= fy;
    z -= fz;

    const u = fade(x);
    const v = fade(y);
    const w = fade(z);

    const A = perm[X] + Y;
    const AA = perm[A] + Z;
    const AB = perm[A + 1] + Z;
    const B = perm[X + 1] + Y;
    const BA = perm[B] + Z;
    const BB = perm[B + 1] + Z;

    return lerp(
      lerp(
        lerp(grad(perm[AA], x, y, z), grad(perm[BA], x - 1, y, z), u),
        lerp(grad(perm[AB], x, y - 1, z), grad(perm[BB], x - 1, y - 1, z), u),
        v
      ),
      lerp(
        lerp(grad(perm[AA + 1], x, y, z - 1), grad(perm[BA + 1], x - 1, y, z - 1), u),
        lerp(grad(perm[AB + 1], x, y - 1, z - 1), grad(perm[BB + 1], x - 1, y - 1, z - 1), u),
        v
      ),
      w
    );
  }

  function fbm(x, y, z, octaves = 5, lacunarity = 2.05, gain = 0.5) {
    let sum = 0;
    let amp = 0.5;
    let freq = 1.0;
    let norm = 0;
    for (let i = 0; i < octaves; i++) {
      sum += amp * noise(x * freq, y * freq, z * freq);
      norm += amp;
      freq *= lacunarity;
      amp *= gain;
    }
    return sum / norm;
  }

  function ridged(x, y, z, octaves = 4, lacunarity = 2.1, gain = 0.52) {
    let sum = 0;
    let amp = 0.5;
    let freq = 1.0;
    let norm = 0;
    for (let i = 0; i < octaves; i++) {
      const n = 1.0 - Math.abs(noise(x * freq, y * freq, z * freq));
      sum += amp * n * n;
      norm += amp;
      freq *= lacunarity;
      amp *= gain;
    }
    return sum / norm;
  }

  return { noise, fbm, ridged };
}

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function smoothstep(edge0, edge1, x) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function mix(a, b, t) {
  return a + (b - a) * t;
}

function latLonToUnit(latDeg, lonDeg) {
  const theta = ((90 - latDeg) * Math.PI) / 180;
  const phi = ((lonDeg + 180) * Math.PI) / 180;
  const sinT = Math.sin(theta);
  return {
    x: -sinT * Math.cos(phi),
    y: Math.cos(theta),
    z: sinT * Math.sin(phi)
  };
}

// Küresel Koordinatta Krater Damgalama Motoru (Kutup ve Sınır Dikişi Olmadan)
function stampCraters(heightGrid, shadeGrid, width, height, craters, cosPhi, sinPhi, cosTheta, sinTheta) {
  const degToRad = Math.PI / 180;

  for (let c = 0; c < craters.length; c++) {
    const cr = craters[c];
    const angRadius = cr.radiusDeg * degToRad;
    const maxAng = angRadius * 1.75;

    const cVec = latLonToUnit(cr.lat, cr.lon);
    const cx = cVec.x;
    const cy = cVec.y;
    const cz = cVec.z;

    const latMinDeg = Math.max(-90, cr.lat - (maxAng * 180) / Math.PI);
    const latMaxDeg = Math.min(90, cr.lat + (maxAng * 180) / Math.PI);
    const pyMin = Math.max(0, Math.floor(((90 - latMaxDeg) / 180) * height));
    const pyMax = Math.min(height - 1, Math.ceil(((90 - latMinDeg) / 180) * height));

    const absLatRad = Math.abs(cr.lat) * degToRad;
    const nearPole = 90 - Math.abs(cr.lat) <= (maxAng * 180) / Math.PI + 2;
    const lonSpanDeg = nearPole
      ? 180
      : Math.min(180, ((maxAng * 180) / Math.PI) / Math.max(0.12, Math.cos(absLatRad)));

    const pxCenter = Math.floor(((cr.lon + 180) / 360) * width);
    const pxSpan = nearPole ? width : Math.ceil((lonSpanDeg / 360) * width) + 2;
    const pxStart = nearPole ? 0 : pxCenter - pxSpan;
    const pxEnd = nearPole ? width - 1 : pxCenter + pxSpan;

    const rimHeight = cr.depth * (cr.rimFactor || 0.36);
    const floorFlatness = cr.flatness || 2.0;
    const minDot = maxAng >= Math.PI ? -1.1 : Math.cos(maxAng);

    for (let py = pyMin; py <= pyMax; py++) {
      const sinT = sinTheta[py];
      const cosT = cosTheta[py];
      const rowOffset = py * width;

      for (let pxRaw = pxStart; pxRaw <= pxEnd; pxRaw++) {
        const px = ((pxRaw % width) + width) % width;
        const nx = -sinT * cosPhi[px];
        const ny = cosT;
        const nz = sinT * sinPhi[px];

        const dot = cx * nx + cy * ny + cz * nz;
        if (dot <= minDot) continue;

        const angDist = Math.sqrt(Math.max(0, 2 * (1 - dot)));
        if (angDist > maxAng) continue;

        const r = angDist / angRadius;
        const idx = rowOffset + px;

        if (r < 1.75) {
          let delta = 0;
          if (r < 1.0) {
            const inner = 1.0 - Math.pow(r, floorFlatness);
            delta -= cr.depth * inner;
            if (cr.centralPeak && r < 0.28) {
              delta += cr.depth * 0.38 * Math.exp(-(r * r) / 0.014);
            }
            if (shadeGrid) {
              shadeGrid[idx] -= cr.depth * inner * 0.42;
            }
          }
          if (r > 0.72) {
            const dr = r - 1.0;
            const sigma = r < 1.0 ? 0.016 : 0.055;
            const rimVal = rimHeight * Math.exp(-(dr * dr) / sigma);
            delta += rimVal;
            if (shadeGrid) {
              shadeGrid[idx] += rimVal * 0.75;
            }
          }
          heightGrid[idx] += delta;
        }
      }
    }
  }
}

// Yükseklik Haritasından Normal, Bump ve Roughness Canvas Dokuları Üretme
function buildSurfaceMaps(width, height, albedoData, heightGrid, roughnessGrid, normalStrength) {
  const makeCanvasTexture = (rgba, isSRGB) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const img = ctx.createImageData(width, height);
    img.data.set(rgba);
    ctx.putImageData(img, 0, 0);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    if (isSRGB) {
      tex.encoding = THREE.sRGBEncoding;
    }
    return tex;
  };

  const normalData = new Uint8ClampedArray(width * height * 4);
  const bumpData = new Uint8ClampedArray(width * height * 4);
  const roughData = new Uint8ClampedArray(width * height * 4);

  let minH = Infinity;
  let maxH = -Infinity;
  for (let i = 0; i < heightGrid.length; i++) {
    if (heightGrid[i] < minH) minH = heightGrid[i];
    if (heightGrid[i] > maxH) maxH = heightGrid[i];
  }
  const hSpan = maxH - minH || 1;

  for (let py = 0; py < height; py++) {
    const latRad = ((90 - ((py + 0.5) / height) * 180) * Math.PI) / 180;
    const cosLat = Math.max(0.22, Math.cos(latRad));
    const pyUp = py > 0 ? py - 1 : 0;
    const pyDown = py < height - 1 ? py + 1 : height - 1;
    const row = py * width;
    const rowUp = pyUp * width;
    const rowDown = pyDown * width;

    for (let px = 0; px < width; px++) {
      const pxLeft = px > 0 ? px - 1 : width - 1;
      const pxRight = px < width - 1 ? px + 1 : 0;

      const hL = heightGrid[row + pxLeft];
      const hR = heightGrid[row + pxRight];
      const hU = heightGrid[rowUp + px];
      const hD = heightGrid[rowDown + px];

      const dx = ((hL - hR) * normalStrength) / cosLat;
      const dy = (hD - hU) * normalStrength;
      const dz = 1.0;
      const invLen = 1.0 / Math.hypot(dx, dy, dz);

      const idx = (row + px) * 4;
      normalData[idx] = Math.round((dx * invLen * 0.5 + 0.5) * 255);
      normalData[idx + 1] = Math.round((dy * invLen * 0.5 + 0.5) * 255);
      normalData[idx + 2] = Math.round((dz * invLen * 0.5 + 0.5) * 255);
      normalData[idx + 3] = 255;

      const bumpVal = Math.round(clamp01((heightGrid[row + px] - minH) / hSpan) * 255);
      bumpData[idx] = bumpVal;
      bumpData[idx + 1] = bumpVal;
      bumpData[idx + 2] = bumpVal;
      bumpData[idx + 3] = 255;

      const rVal = Math.round(clamp01(roughnessGrid[row + px]) * 255);
      roughData[idx] = rVal;
      roughData[idx + 1] = rVal;
      roughData[idx + 2] = rVal;
      roughData[idx + 3] = 255;
    }
  }

  return {
    map: makeCanvasTexture(albedoData, true),
    normalMap: makeCanvasTexture(normalData, false),
    bumpMap: makeCanvasTexture(bumpData, false),
    roughnessMap: makeCanvasTexture(roughData, false)
  };
}

// Ay (Luna) Gerçekçi Selenografik Yüzey ve PBR Haritaları
function generateMoonData(width, height, cosPhi, sinPhi, cosTheta, sinTheta) {
  const nMain = createNoise3D(19690720);
  const nDetail = createNoise3D(19721211);
  const rng = createRng(1969);

  const count = width * height;
  const heightGrid = new Float32Array(count);
  const mareMask = new Float32Array(count);
  const craterShadeGrid = new Float32Array(count);
  const detailGrid = new Float32Array(count);
  const roughnessGrid = new Float32Array(count);
  const albedoData = new Uint8ClampedArray(count * 4);

  // Gerçek Ay Denizleri (Maria) koordinatları
  const mariaRegions = [
    { lat: 8.5, lon: 31.4, rad: 19, str: 1.0 },   // Mare Tranquillitatis (Apollo 11)
    { lat: 32.8, lon: -15.6, rad: 24, str: 1.05 }, // Mare Imbrium
    { lat: 28.0, lon: 17.5, rad: 15, str: 0.95 }, // Mare Serenitatis
    { lat: 18.4, lon: -57.4, rad: 34, str: 0.95 }, // Oceanus Procellarum
    { lat: -4.0, lon: -28.0, rad: 18, str: 0.85 }, // Mare Cognitum / Nubium kuzey
    { lat: 17.0, lon: 59.1, rad: 11, str: 0.95 }, // Mare Crisium
    { lat: -21.3, lon: -16.6, rad: 15, str: 0.85 }, // Mare Nubium
    { lat: -7.8, lon: 51.3, rad: 14, str: 0.9 },   // Mare Fecunditatis
    { lat: -24.4, lon: -38.6, rad: 11, str: 0.85 }, // Mare Humorum
    { lat: 51.6, lon: -1.0, rad: 13, str: 0.8 },   // Mare Frigoris
    { lat: -17.0, lon: 34.0, rad: 12, str: 0.85 }  // Mare Nectaris
  ].map((m) => {
    const radRad = (m.rad * Math.PI) / 180;
    return { ...m, vec: latLonToUnit(m.lat, m.lon), radRad, cosLimit: Math.cos(Math.min(Math.PI, radRad * 1.45)) };
  });

  for (let py = 0; py < height; py++) {
    const sinT = sinTheta[py];
    const cosT = cosTheta[py];
    const row = py * width;

    for (let px = 0; px < width; px++) {
      const nx = -sinT * cosPhi[px];
      const ny = cosT;
      const nz = sinT * sinPhi[px];

      const continent = nMain.fbm(nx * 2.2, ny * 2.2, nz * 2.2, 5, 2.05, 0.52);
      const highlandRidges = nMain.ridged(nx * 4.5 + 3.1, ny * 4.5, nz * 4.5 - 1.7, 4, 2.1, 0.5);
      const microRegolith = nDetail.fbm(nx * 24.0, ny * 24.0, nz * 24.0, 3, 2.2, 0.48);
      const microFine = nDetail.noise(nx * 56.0 + 1.4, ny * 56.0, nz * 56.0 - 0.8);
      const regolithGrain = nDetail.noise(nx * 108.0 - 3.7, ny * 108.0, nz * 108.0 + 2.4);

      // Deniz (Mare) havzası maskesi (sınırları organik gürültü ile bükülmüş)
      const warp = continent * 0.14;
      let mare = 0;
      for (let m = 0; m < mariaRegions.length; m++) {
        const reg = mariaRegions[m];
        const dot = nx * reg.vec.x + ny * reg.vec.y + nz * reg.vec.z;
        if (dot <= reg.cosLimit) continue;
        const dist = Math.sqrt(Math.max(0, 2 * (1 - dot))) + warp;
        const f = (1.0 - smoothstep(reg.radRad * 0.45, reg.radRad * 1.15, dist)) * reg.str;
        if (f > mare) mare = f;
      }

      // Doğal arka taraf bazalt lekeleri
      const minorBasins = smoothstep(0.24, 0.42, continent) * 0.45;
      const mVal = clamp01(Math.max(mare, minorBasins));
      const idxCell = row + px;
      mareMask[idxCell] = mVal;
      detailGrid[idxCell] = microRegolith + microFine * 0.48 + regolithGrain * 0.22;

      const grainRelief = microFine * 0.04 + regolithGrain * 0.016;
      const highlandH = 0.25 + continent * 0.42 + highlandRidges * 0.33 + microRegolith * 0.13 + grainRelief;
      const mareH = -0.20 + microRegolith * 0.06 + grainRelief * 0.55 + highlandRidges * 0.045;
      heightGrid[idxCell] = mix(highlandH, mareH, mVal);
    }
  }

  // Büyük İsimli Kraterler + Çok Ölçekli Prosedürel Kraterler
  const lunarCraters = [
    { lat: -43.31, lon: -11.36, radiusDeg: 3.4, depth: 0.46, centralPeak: true }, // Tycho
    { lat: 9.62, lon: -20.08, radiusDeg: 3.6, depth: 0.44, centralPeak: true },  // Copernicus
    { lat: 8.1, lon: -38.0, radiusDeg: 2.1, depth: 0.34, centralPeak: false },  // Kepler
    { lat: 23.7, lon: -47.4, radiusDeg: 2.2, depth: 0.36, centralPeak: false }, // Aristarchus
    { lat: 51.6, lon: -9.3, radiusDeg: 3.9, depth: 0.34, flatness: 3.4, centralPeak: false }, // Plato (koyu tabanlı)
    { lat: -58.4, lon: -14.4, radiusDeg: 6.5, depth: 0.52, flatness: 2.6, centralPeak: true }, // Clavius
    { lat: -19.2, lon: -4.1, radiusDeg: 4.2, depth: 0.42, flatness: 2.8, centralPeak: true }, // Alphonsus
    { lat: -9.3, lon: -1.8, radiusDeg: 4.6, depth: 0.38, flatness: 3.1, centralPeak: false } // Ptolemaeus
  ];

  // Büyük kraterler (~45)
  for (let i = 0; i < 45; i++) {
    lunarCraters.push({
      lat: (Math.asin(2 * rng() - 1) * 180) / Math.PI,
      lon: rng() * 360 - 180,
      radiusDeg: 3.0 + rng() * 5.0,
      depth: 0.25 + rng() * 0.22,
      flatness: 2.2 + rng() * 0.8,
      centralPeak: rng() > 0.45
    });
    // Preserve the seeded positions after removing the two random ray settings.
    rng();
    rng();
  }
  // Orta boy kraterler (~180)
  for (let i = 0; i < 180; i++) {
    lunarCraters.push({
      lat: (Math.asin(2 * rng() - 1) * 180) / Math.PI,
      lon: rng() * 360 - 180,
      radiusDeg: 1.1 + rng() * 2.1,
      depth: 0.14 + rng() * 0.14,
      flatness: 2.0,
      centralPeak: false
    });
  }
  // Küçük ve mikro kraterler (~760)
  for (let i = 0; i < 760; i++) {
    lunarCraters.push({
      lat: (Math.asin(2 * rng() - 1) * 180) / Math.PI,
      lon: rng() * 360 - 180,
      radiusDeg: 0.38 + rng() * 0.72,
      depth: 0.06 + rng() * 0.08,
      flatness: 1.8,
      centralPeak: false
    });
  }

  stampCraters(heightGrid, craterShadeGrid, width, height, lunarCraters, cosPhi, sinPhi, cosTheta, sinTheta);

  // Ay Regoliti Albedo ve Pürüzlülük Renklendirme
  for (let i = 0; i < count; i++) {
    const fineGrain = detailGrid[i];
    const mare = mareMask[i];
    const shade = craterShadeGrid[i];
    const h = heightGrid[i];

    // Yüksek araziler (açık sıcak gümüş-gri) vs Deniz bazaltları (koyu arduvaz gri)
    const highlandR = 182 + fineGrain * 32 + h * 20 + shade * 86;
    const highlandG = 178 + fineGrain * 31 + h * 19 + shade * 84;
    const highlandB = 171 + fineGrain * 30 + h * 18 + shade * 82;

    const mareR = 72 + fineGrain * 19 + h * 16 + shade * 48;
    const mareG = 75 + fineGrain * 19 + h * 16 + shade * 48;
    const mareB = 82 + fineGrain * 20 + h * 17 + shade * 50;

    const r = mix(highlandR, mareR, mare);
    const g = mix(highlandG, mareG, mare);
    const b = mix(highlandB, mareB, mare);

    const idx = i * 4;
    albedoData[idx] = Math.min(246, Math.max(30, Math.round(r)));
    albedoData[idx + 1] = Math.min(244, Math.max(30, Math.round(g)));
    albedoData[idx + 2] = Math.min(240, Math.max(34, Math.round(b)));
    albedoData[idx + 3] = 255;

    roughnessGrid[i] = clamp01(0.89 + fineGrain * 0.06 - mare * 0.03);
  }

  return buildSurfaceMaps(width, height, albedoData, heightGrid, roughnessGrid, 3.55);
}

// Mars Gerçekçi Areografik Yüzey, Kanyon, Volkan ve Kutup Buzulu Haritaları
function generateMarsData(width, height, cosPhi, sinPhi, cosTheta, sinTheta) {
  const nMain = createNoise3D(19760720);
  const nDetail = createNoise3D(20120806);
  const rng = createRng(2024);

  const count = width * height;
  const heightGrid = new Float32Array(count);
  const basaltMask = new Float32Array(count);
  const canyonMask = new Float32Array(count);
  const craterShadeGrid = new Float32Array(count);
  const detailGrid = new Float32Array(count);
  const roughnessGrid = new Float32Array(count);
  const albedoData = new Uint8ClampedArray(count * 4);

  // Başlıca Kalkan Volkanları
  const volcanoes = [
    { lat: 18.65, lon: -133.8, rad: 9.2, peak: 0.72, caldera: 0.16 }, // Olympus Mons
    { lat: 11.9, lon: -104.1, rad: 6.2, peak: 0.5, caldera: 0.15 },  // Ascraeus Mons
    { lat: 1.5, lon: -112.9, rad: 5.8, peak: 0.44, caldera: 0.16 },   // Pavonis Mons
    { lat: -8.3, lon: -120.1, rad: 6.5, peak: 0.48, caldera: 0.2 },   // Arsia Mons
    { lat: 25.0, lon: 147.2, rad: 5.5, peak: 0.4, caldera: 0.14 }     // Elysium Mons
  ].map((v) => {
    const radRad = (v.rad * Math.PI) / 180;
    return { ...v, vec: latLonToUnit(v.lat, v.lon), radRad, cosLimit: Math.cos(radRad) };
  });

  // Başlıca Koyu Bazaltik Bölgeler & Alçak Havzalar
  const darkAlbedoRegions = [
    { lat: 8.4, lon: 69.5, rad: 16, str: 0.95 },   // Syrtis Major Planum (Jezero/Ingenuity komşusu)
    { lat: 42.0, lon: -24.0, rad: 24, str: 0.78 }, // Acidalia Planitia
    { lat: 23.0, lon: -39.0, rad: 14, str: 0.52 }, // Chryse Planitia (Viking 1 & Pathfinder)
    { lat: -2.0, lon: -5.5, rad: 14, str: 0.72 },  // Meridiani Planum (Opportunity)
    { lat: -14.0, lon: 14.0, rad: 18, str: 0.65 }, // Sinus Sabaeus
    { lat: -20.0, lon: -158.0, rad: 19, str: 0.62 } // Mare Sirenum / Cimmerium
  ].map((r) => {
    const radRad = (r.rad * Math.PI) / 180;
    return { ...r, vec: latLonToUnit(r.lat, r.lon), radRad, cosLimit: Math.cos(Math.min(Math.PI, radRad * 1.45)) };
  });

  const hellasVec = latLonToUnit(-42.4, 70.5);
  const hellasRad = (23 * Math.PI) / 180;
  const hellasCosLimit = Math.cos(hellasRad * 1.35);

  // Valles Marineris Kanyon Segmentleri (batıdan doğuya dallanan kanyon sistemi)
  const canyonSegments = [
    { lat1: -7.5, lon1: -92.0, lat2: -11.5, lon2: -74.0, widthDeg: 2.3, depth: 0.56 },
    { lat1: -11.5, lon1: -74.0, lat2: -14.0, lon2: -56.0, widthDeg: 3.1, depth: 0.68 },
    { lat1: -14.0, lon1: -56.0, lat2: -14.5, lon2: -40.0, widthDeg: 2.6, depth: 0.52 },
    { lat1: -9.5, lon1: -72.0, lat2: -7.0, lon2: -60.0, widthDeg: 1.8, depth: 0.44 } // Candor / Ophir Chasma kolu
  ];

  for (let py = 0; py < height; py++) {
    const sinT = sinTheta[py];
    const cosT = cosTheta[py];
    const latDeg = 90 - ((py + 0.5) / height) * 180;
    const row = py * width;
    const inCanyonLat = latDeg > -22 && latDeg < 0;

    for (let px = 0; px < width; px++) {
      const lonDeg = ((px + 0.5) / width) * 360 - 180;
      const nx = -sinT * cosPhi[px];
      const ny = cosT;
      const nz = sinT * sinPhi[px];

      const broadTerrain = nMain.fbm(nx * 2.1, ny * 2.1, nz * 2.1, 5, 2.05, 0.52);
      const rockyRidges = nMain.ridged(nx * 5.5 + 2.1, ny * 5.5 - 1.3, nz * 5.5, 4, 2.15, 0.5);
      const windDust = nDetail.fbm(nx * 14.0 + ny * 2.5, ny * 8.0, nz * 14.0, 3);
      const windRipples =
        Math.sin(nx * 34.0 + ny * 16.0 + broadTerrain * 6.0) * 0.35 +
        nDetail.noise(nx * 46.0, ny * 26.0, nz * 46.0) * 0.65;
      const dustGrain = nDetail.noise(nx * 94.0 + 4.6, ny * 94.0, nz * 94.0 - 2.8);

      // Kuzey-güney yarı küre dikotomisi (kuzey düzlükleri daha alçak, güney kraterli yüksek arazi)
      const hemisphereSlope = smoothstep(-25, 35, latDeg) * -0.26;
      let h = 0.14 + hemisphereSlope + broadTerrain * 0.36 + rockyRidges * 0.23;
      h += windDust * 0.065 + windRipples * 0.035 + dustGrain * 0.016;

      // Hellas Havzası çöküntüsü
      const hDot = nx * hellasVec.x + ny * hellasVec.y + nz * hellasVec.z;
      if (hDot > hellasCosLimit) {
        const hDist = Math.sqrt(Math.max(0, 2 * (1 - hDot))) + broadTerrain * 0.05;
        const hellasFactor = 1.0 - smoothstep(hellasRad * 0.35, hellasRad * 1.1, hDist);
        h -= hellasFactor * 0.46;
      }

      // Kalkan Volkanları ve Belirgin Kaldera Halkaları (Olympus Mons & Tharsis)
      for (let v = 0; v < volcanoes.length; v++) {
        const vol = volcanoes[v];
        const vDot = nx * vol.vec.x + ny * vol.vec.y + nz * vol.vec.z;
        if (vDot > vol.cosLimit) {
          const vDist = Math.sqrt(Math.max(0, 2 * (1 - vDot)));
          if (vDist < vol.radRad) {
            const rNorm = vDist / vol.radRad;
            let dome = Math.pow(1.0 - rNorm, 1.5) * vol.peak;
            const ringDiff = rNorm - vol.caldera;
            dome += vol.peak * 0.16 * Math.exp(-(ringDiff * ringDiff) / 0.0018);
            if (rNorm < vol.caldera) {
              dome -= vol.peak * 0.30 * (1.0 - rNorm / vol.caldera);
            }
            h += dome;
          }
        }
      }

      // Valles Marineris Dev Kanyon Yarığı
      let canyon = 0;
      if (inCanyonLat && lonDeg > -100 && lonDeg < -32) {
        const cWarpLat = nDetail.fbm(nx * 16, ny * 16, nz * 16, 3) * 1.8;
        const cWarpLon = nDetail.fbm(nx * 14 + 5, ny * 14, nz * 14, 3) * 2.0;
        const wLat = latDeg + cWarpLat;
        const wLon = lonDeg + cWarpLon;

        for (let s = 0; s < canyonSegments.length; s++) {
          const seg = canyonSegments[s];
          const dLat = seg.lat2 - seg.lat1;
          const dLon = seg.lon2 - seg.lon1;
          const segLenSq = dLat * dLat + dLon * dLon;
          const t = clamp01(((wLat - seg.lat1) * dLat + (wLon - seg.lon1) * dLon) / segLenSq);
          const pLat = seg.lat1 + t * dLat;
          const pLon = seg.lon1 + t * dLon;
          const distDeg = Math.hypot(wLat - pLat, (wLon - pLon) * 0.95);
          if (distDeg < seg.widthDeg * 1.4) {
            const wall = 1.0 - smoothstep(seg.widthDeg * 0.72, seg.widthDeg * 1.4, distDeg);
            const innerCliff = 1.0 - smoothstep(seg.widthDeg * 0.40, seg.widthDeg * 0.74, distDeg);
            const cFactor = (wall * 0.58 + innerCliff * 0.42) * seg.depth;
            if (cFactor > canyon) canyon = cFactor;
          }
        }
      }
      const idxCell = row + px;
      canyonMask[idxCell] = canyon;
      h -= canyon;

      // Koyu Bazalt Bölgeleri Maskesi
      const darkWarp = broadTerrain * 0.14 + windDust * 0.08;
      let darkVal = 0;
      for (let d = 0; d < darkAlbedoRegions.length; d++) {
        const reg = darkAlbedoRegions[d];
        const dDot = nx * reg.vec.x + ny * reg.vec.y + nz * reg.vec.z;
        if (dDot <= reg.cosLimit) continue;
        const dDist = Math.sqrt(Math.max(0, 2 * (1 - dDot))) + darkWarp;
        const f = (1.0 - smoothstep(reg.radRad * 0.3, reg.radRad * 1.15, dDist)) * reg.str;
        if (f > darkVal) darkVal = f;
      }
      darkVal = clamp01(Math.max(darkVal, canyon * 1.25));
      basaltMask[idxCell] = darkVal;
      detailGrid[idxCell] = windDust + windRipples * 0.42 + dustGrain * 0.24;

      heightGrid[idxCell] = h;
    }
  }

  // Aşınmış Mars Kraterleri (Güney yarımkürede daha yoğun, daha düz tabanlı)
  const marsCraters = [
    { lat: 18.44, lon: 77.45, radiusDeg: 1.5, depth: 0.16, flatness: 3.0, centralPeak: false }, // Jezero Krateri
    { lat: -14.57, lon: 175.48, radiusDeg: 2.0, depth: 0.18, flatness: 3.2, centralPeak: false }, // Gusev Krateri
    { lat: -5.4, lon: 137.8, radiusDeg: 2.1, depth: 0.22, flatness: 2.8, centralPeak: true } // Gale Krateri
  ];

  for (let i = 0; i < 45; i++) {
    const southBias = rng() < 0.72 ? -Math.abs(rng() * 68) : rng() * 58;
    marsCraters.push({
      lat: southBias,
      lon: rng() * 360 - 180,
      radiusDeg: 2.4 + rng() * 4.2,
      depth: 0.14 + rng() * 0.15,
      flatness: 2.6 + rng() * 0.8,
      rimFactor: 0.24,
      centralPeak: rng() > 0.65
    });
  }
  for (let i = 0; i < 300; i++) {
    const latVal = rng() < 0.68 ? -(rng() * 72) : rng() * 65;
    marsCraters.push({
      lat: latVal,
      lon: rng() * 360 - 180,
      radiusDeg: 0.5 + rng() * 1.6,
      depth: 0.05 + rng() * 0.09,
      flatness: 2.4,
      rimFactor: 0.22,
      centralPeak: false
    });
  }

  for (let i = 0; i < 380; i++) {
    marsCraters.push({
      lat: Math.asin(2 * rng() - 1) * 180 / Math.PI,
      lon: rng() * 360 - 180,
      radiusDeg: 0.32 + rng() * 0.52,
      depth: 0.045 + rng() * 0.055,
      flatness: 2.5,
      rimFactor: 0.19,
      centralPeak: false
    });
  }

  stampCraters(heightGrid, craterShadeGrid, width, height, marsCraters, cosPhi, sinPhi, cosTheta, sinTheta);

  // Albedo, Kutup Buzulları (Planum Boreum & Australe) ve Pürüzlülük
  for (let py = 0; py < height; py++) {
    const sinT = sinTheta[py];
    const cosT = cosTheta[py];
    const latDeg = 90 - ((py + 0.5) / height) * 180;
    const isPolar = Math.abs(latDeg) > 60;
    const row = py * width;

    for (let px = 0; px < width; px++) {
      const i = row + px;
      const dustVar = detailGrid[i];

      let iceCover = 0;
      let spiralChasma = 0;
      if (isPolar) {
        const nx = -sinT * cosPhi[px];
        const ny = cosT;
        const nz = sinT * sinPhi[px];
        const polarWarp = nMain.fbm(nx * 8.0, ny * 8.0, nz * 8.0, 4) * 5.5;
        spiralChasma = Math.sin(Math.atan2(nz, nx) * 2.0 + Math.abs(latDeg) * 0.65) * 0.5 + 0.5;
        const northIce = smoothstep(73.5, 80.5, latDeg + polarWarp);
        const southIce = smoothstep(76.5, 83.5, -latDeg + polarWarp * 0.85 - nx * 2.5);
        iceCover = clamp01(Math.max(northIce, southIce));
        if (iceCover > 0.05) {
          heightGrid[i] += iceCover * (0.14 - spiralChasma * 0.045);
        }
      }

      const basalt = basaltMask[i];
      const canyonFloor = clamp01(canyonMask[i] * 1.4);
      const shade = craterShadeGrid[i];
      const h = heightGrid[i];

      // Oksitlenmiş demir tozu (sıcak kızıl-okra) vs açığa çıkmış bazaltik kaya (koyu kahve-pas)
      const dustR = 194 + dustVar * 32 + h * 18 + shade * 62;
      const dustG = 108 + dustVar * 27 + h * 16 + shade * 46;
      const dustB = 63 + dustVar * 20 + h * 10 + shade * 32;

      const darkR = 92 + dustVar * 18 + shade * 26;
      const darkG = 53 + dustVar * 14 + shade * 18;
      const darkB = 40 + dustVar * 12 + shade * 14;

      let r = mix(dustR, darkR, basalt * 0.90);
      let g = mix(dustG, darkG, basalt * 0.90);
      let b = mix(dustB, darkB, basalt * 0.90);

      if (canyonFloor > 0.05) {
        r = mix(r, 64, canyonFloor * 0.52);
        g = mix(g, 34, canyonFloor * 0.52);
        b = mix(b, 26, canyonFloor * 0.52);
      }

      // Kutup donmuş kenar ve buz katmanları
      if (iceCover > 0.01) {
        const troughDark = spiralChasma * (1.0 - smoothstep(0.65, 1.0, iceCover)) * 0.22;
        const iceR = 246 - troughDark * 50;
        const iceG = 247 - troughDark * 65;
        const iceB = 250 - troughDark * 75;
        r = mix(r, iceR, iceCover);
        g = mix(g, iceG, iceCover);
        b = mix(b, iceB, iceCover);
      }

      const idx = i * 4;
      albedoData[idx] = Math.min(250, Math.max(26, Math.round(r)));
      albedoData[idx + 1] = Math.min(250, Math.max(18, Math.round(g)));
      albedoData[idx + 2] = Math.min(252, Math.max(16, Math.round(b)));
      albedoData[idx + 3] = 255;

      roughnessGrid[i] = clamp01(mix(0.87 + dustVar * 0.06 - basalt * 0.05, 0.54, iceCover));
    }
  }

  return buildSurfaceMaps(width, height, albedoData, heightGrid, roughnessGrid, 3.30);
}

// Yüksek Çözünürlüklü (2048x1024) Prosedürel PBR Gezegen Dokusu Üreticisi (Harici dosya gerektirmez)
function generatePlanetMaps(type) {
  const width = 2048;
  const height = 1024;

  const cosPhi = new Float32Array(width);
  const sinPhi = new Float32Array(width);
  for (let px = 0; px < width; px++) {
    const phi = ((px + 0.5) / width) * 2 * Math.PI;
    cosPhi[px] = Math.cos(phi);
    sinPhi[px] = Math.sin(phi);
  }

  const cosTheta = new Float32Array(height);
  const sinTheta = new Float32Array(height);
  for (let py = 0; py < height; py++) {
    const theta = ((py + 0.5) / height) * Math.PI;
    cosTheta[py] = Math.cos(theta);
    sinTheta[py] = Math.sin(theta);
  }

  if (type === 'moon') {
    return generateMoonData(width, height, cosPhi, sinPhi, cosTheta, sinTheta);
  }
  return generateMarsData(width, height, cosPhi, sinPhi, cosTheta, sinTheta);
}

// Ay Kenarı İçin Hafif Regolit Geri Saçılım Shader'ı (Atmosfersiz keskin ufuk)
function createMoonLimbMesh(radius) {
  const geo = new THREE.SphereGeometry(radius * 1.003, 128, 128);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uSunDir: { value: sunDirection }
    },
    vertexShader: `
      varying vec3 vWorldNormal;
      varying vec3 vWorldPos;
      void main() {
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPos = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: `
      uniform vec3 uSunDir;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPos;
      void main() {
        vec3 N = normalize(vWorldNormal);
        vec3 V = normalize(cameraPosition - vWorldPos);
        float fresnel = pow(1.0 - max(dot(N, V), 0.0), 4.2);
        float sunLit = smoothstep(-0.05, 0.55, dot(N, uSunDir));
        float intensity = fresnel * sunLit * 0.16;
        gl_FragColor = vec4(vec3(0.84, 0.83, 0.80) * intensity, intensity);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.raycast = () => { };
  return mesh;
}

// Mars İnce Tozlu Atmosfer ve Kenar Saçılım Katmanları
function createMarsAtmosphereLayers(radius) {
  // 1. Dış Atmosfer Halesi (Güneş ışığına duyarlı ince kehribar-kızıl saçılım)
  const outerGeo = new THREE.SphereGeometry(radius * 1.048, 128, 128);
  const outerMat = new THREE.ShaderMaterial({
    uniforms: {
      uSunDir: { value: sunDirection }
    },
    vertexShader: `
      varying vec3 vWorldNormal;
      varying vec3 vWorldPos;
      void main() {
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPos = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: `
      uniform vec3 uSunDir;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPos;
      void main() {
        vec3 N = normalize(vWorldNormal);
        vec3 V = normalize(cameraPosition - vWorldPos);
        // BackSide kürede dış kenarda dot(N,V)=0, gezegen ufkunda ~ -0.30
        float edgeGlow = pow(clamp(-dot(N, V) / 0.31, 0.0, 1.0), 2.1);
        float sunDot = dot(N, uSunDir);
        float daySide = smoothstep(-0.32, 0.45, sunDot);
        vec3 duskColor = vec3(0.95, 0.46, 0.24);
        vec3 terminatorColor = vec3(0.58, 0.62, 0.78);
        vec3 atmoColor = mix(terminatorColor, duskColor, smoothstep(-0.2, 0.35, sunDot));
        float alpha = edgeGlow * (0.16 + 0.64 * daySide);
        gl_FragColor = vec4(atmoColor * alpha, alpha);
      }
    `,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const outerMesh = new THREE.Mesh(outerGeo, outerMat);
  outerMesh.raycast = () => { };

  // 2. Yüzey Üstü İnce Toz Pusu Katmanı (FrontSide Fresnel)
  const innerGeo = new THREE.SphereGeometry(radius * 1.007, 128, 128);
  const innerMat = new THREE.ShaderMaterial({
    uniforms: {
      uSunDir: { value: sunDirection }
    },
    vertexShader: `
      varying vec3 vWorldNormal;
      varying vec3 vWorldPos;
      void main() {
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPos = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: `
      uniform vec3 uSunDir;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPos;
      void main() {
        vec3 N = normalize(vWorldNormal);
        vec3 V = normalize(cameraPosition - vWorldPos);
        float rim = pow(1.0 - max(dot(N, V), 0.0), 3.4);
        float sunLit = smoothstep(-0.25, 0.5, dot(N, uSunDir));
        float alpha = rim * sunLit * 0.34;
        vec3 hazeColor = vec3(0.91, 0.56, 0.36);
        gl_FragColor = vec4(hazeColor * alpha, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  innerMesh.raycast = () => { };

  return [outerMesh, innerMesh];
}

// Ay ve Mars 3B PBR Nesneleri (128x128 Pürüzsüz Küre Geometrisi)
const moonMaps = generatePlanetMaps('moon');
const moonMesh = new THREE.Mesh(
  new THREE.SphereGeometry(1.15, 128, 128),
  new THREE.MeshStandardMaterial({
    map: moonMaps.map,
    normalMap: moonMaps.normalMap,
    normalScale: new THREE.Vector2(1.65, 1.65),
    bumpMap: moonMaps.bumpMap,
    bumpScale: 0.055,
    roughnessMap: moonMaps.roughnessMap,
    roughness: 1.0,
    metalness: 0.02
  })
);
moonMesh.add(createMoonLimbMesh(1.15));
moonMesh.position.set(-1.9, 0, 0);
moonMesh.rotation.y = -Math.PI * 0.5;
moonMesh.userData = { id: 'moon' };
scene.add(moonMesh);

const marsMaps = generatePlanetMaps('mars');
const marsMesh = new THREE.Mesh(
  new THREE.SphereGeometry(1.3, 128, 128),
  new THREE.MeshStandardMaterial({
    map: marsMaps.map,
    normalMap: marsMaps.normalMap,
    normalScale: new THREE.Vector2(1.55, 1.55),
    bumpMap: marsMaps.bumpMap,
    bumpScale: 0.045,
    roughnessMap: marsMaps.roughnessMap,
    roughness: 1.0,
    metalness: 0.02
  })
);
createMarsAtmosphereLayers(1.3).forEach((layer) => marsMesh.add(layer));
marsMesh.position.set(1.9, 0, 0);
marsMesh.rotation.y = -Math.PI * 0.25;
marsMesh.userData = { id: 'mars' };
scene.add(marsMesh);

if (typeof window !== 'undefined') {
  window.getPlanetVisualMeta = () => ({
    moonMaps,
    marsMaps,
    moonMesh,
    marsMesh
  });
}

// Durum Yönetimi
let selectedPlanet = null; // 'moon' | 'mars' | null
let activePinMarkers = [];
let isDragging = false;
let prevMouse = { x: 0, y: 0 };
let rotationPausedUntil = 0;
let focusRotationTarget = null;

const targets = {
  moon: { pos: new THREE.Vector3(-1.9, 0, 0), scale: 1 },
  mars: { pos: new THREE.Vector3(1.9, 0, 0), scale: 1 }
};

// Web Audio API: Ay / Mars Yüzeyi Çıtırtılı Ayak Sesleri ve Kaldırma Efekti
let audioCtx = null;
let footstepNoiseBuffer = null;

// Sesli Hikâye Oynatıcısı, Önbellek (Cache/Preload) ve Arka Plan Ses Ducking Yönetimi
const storyAudioCache = new Map();
let currentStoryAudio = null;
let currentStoryAudioCleanup = null;
let isStoryAudioPlaying = false;
let ambientSoundBaseVolume = 1.0;
let currentAmbientVolume = 1.0;

function resolveStoryAudioSrc(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let decoded = rawUrl.trim();
  try {
    decoded = decodeURI(decoded);
  } catch (_) {}
  const normalized = decoded.startsWith('audio/')
    ? `audio2/${decoded.slice('audio/'.length)}`
    : decoded;
  return encodeURI(normalized);
}

function preloadStoryAudioFiles() {
  if (typeof SPACE_DATA === 'undefined' || !SPACE_DATA) return storyAudioCache;
  ['moon', 'mars'].forEach((planetId) => {
    const planet = SPACE_DATA[planetId];
    if (!planet || !Array.isArray(planet.equipment)) return;
    planet.equipment.forEach((eq) => {
      if (!eq || !eq.audioUrl) return;
      const encodedUrl = resolveStoryAudioSrc(eq.audioUrl);
      const prev = storyAudioCache.get(eq.id);
      storyAudioCache.set(eq.id, {
        eqId: eq.id,
        planetId,
        rawUrl: eq.audioUrl,
        encodedUrl,
        duration: prev && Number.isFinite(prev.duration) ? prev.duration : 0,
        preloaded: true
      });
    });
  });
  return storyAudioCache;
}

function setAmbientSoundDucking(isDucked) {
  currentAmbientVolume = isDucked ? ambientSoundBaseVolume * 0.22 : ambientSoundBaseVolume;
}

function stopStoryAudio() {
  if (typeof currentStoryAudioCleanup === 'function') {
    try {
      currentStoryAudioCleanup();
    } catch (_) {
      // Temizlik hatası yok sayılır
    }
    currentStoryAudioCleanup = null;
  }
  if (currentStoryAudio) {
    try {
      currentStoryAudio.pause();
    } catch (_) {}
    try {
      currentStoryAudio.currentTime = 0;
    } catch (_) {}
    currentStoryAudio = null;
  }
  isStoryAudioPlaying = false;
  setAmbientSoundDucking(false);
}

if (typeof window !== 'undefined') {
  window.storyAudioCache = storyAudioCache;
  window.resolveStoryAudioSrc = resolveStoryAudioSrc;
  window.preloadStoryAudioFiles = preloadStoryAudioFiles;
  window.getStoryAudioState = () => ({
    audio: currentStoryAudio,
    isPlaying: isStoryAudioPlaying,
    ambientVolume: currentAmbientVolume
  });
  window.stopStoryAudio = stopStoryAudio;
}

function ensureAudioContext() {
  if (typeof window === 'undefined') return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  try {
    if (!audioCtx) {
      audioCtx = new Ctx();
      const length = Math.floor(audioCtx.sampleRate * 0.14);
      footstepNoiseBuffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
      const data = footstepNoiseBuffer.getChannelData(0);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (length * 0.42));
      }
    }
    if (audioCtx.state === 'suspended' && typeof audioCtx.resume === 'function') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (_) {
    return null;
  }
}

function playSpaceFootstep(stepIndex = 0) {
  const ctx = ensureAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;

    // 1. Uzay botu basış tok sesi
    const osc = ctx.createOscillator();
    const thumpGain = ctx.createGain();
    osc.type = 'triangle';
    const baseFreq = stepIndex % 2 === 0 ? 105 : 92;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(34, now + 0.11);
    thumpGain.gain.setValueAtTime(0.24 * currentAmbientVolume, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(thumpGain);
    thumpGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);

    // 2. Ay regoliti / Mars tozu çıtırtısı
    if (footstepNoiseBuffer) {
      const noise = ctx.createBufferSource();
      noise.buffer = footstepNoiseBuffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(stepIndex % 2 === 0 ? 340 : 280, now);
      filter.Q.setValueAtTime(1.3, now);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.22 * currentAmbientVolume, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
    }
  } catch (_) {
    // Ses bağlamı engellenirse sessiz devam edilir
  }
}

function playLiftFanfare() {
  const ctx = ensureAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const t = now + idx * 0.065;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.12 * currentAmbientVolume, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.24);
    });
  } catch (_) {
    // Ses hatası yok sayılır
  }
}

// Zaman Çubuğu Üzerinde Yürüyen Astronot İçin Tok Düşük Geçişli Uzay Botu Ayak Sesleri
function playTimelineFootsteps(steps = 4) {
  try {
    const ctx = ensureAudioContext();
    if (!ctx) return;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(175, ctx.currentTime);
    filter.Q.setValueAtTime(1.8, ctx.currentTime);
    filter.connect(ctx.destination);

    const stepCount = Math.max(3, Math.min(5, steps));
    for (let i = 0; i < stepCount; i++) {
      const startAt = ctx.currentTime + i * 0.205;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, startAt);
      osc.frequency.exponentialRampToValueAtTime(42, startAt + 0.16);

      gain.gain.setValueAtTime(0.001, startAt);
      gain.gain.linearRampToValueAtTime(0.24 * currentAmbientVolume, startAt + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.175);

      osc.connect(gain);
      gain.connect(filter);
      osc.start(startAt);
      osc.stop(startAt + 0.185);

      if (footstepNoiseBuffer) {
        const noise = ctx.createBufferSource();
        noise.buffer = footstepNoiseBuffer;
        const nFilter = ctx.createBiquadFilter();
        nFilter.type = 'lowpass';
        nFilter.frequency.setValueAtTime(280, startAt);
        const nGain = ctx.createGain();
        nGain.gain.setValueAtTime(0.085 * currentAmbientVolume, startAt);
        nGain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.11);

        noise.connect(nFilter);
        nFilter.connect(nGain);
        nGain.connect(ctx.destination);
        noise.start(startAt);
        noise.stop(startAt + 0.115);
      }
    }
  } catch (_) {
    // Ses hatası yok sayılır
  }
}

let lastBrushSoundTime = 0;
function playBrushSweepSound() {
  const now = Date.now();
  if (now - lastBrushSoundTime < 95) return;
  lastBrushSoundTime = now;
  try {
    const ctx = ensureAudioContext();
    if (!ctx || !footstepNoiseBuffer) return;

    const noise = ctx.createBufferSource();
    noise.buffer = footstepNoiseBuffer;

    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.setValueAtTime(980, ctx.currentTime);
    band.frequency.linearRampToValueAtTime(1450, ctx.currentTime + 0.07);
    band.Q.setValueAtTime(1.5, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.055 * currentAmbientVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.085);

    noise.connect(band);
    band.connect(gain);
    gain.connect(ctx.destination);
    noise.start(ctx.currentTime);
    noise.stop(ctx.currentTime + 0.09);
  } catch (_) {
    // Ses hatası yok sayılır
  }
}

function playRepairSuccessChime() {
  try {
    const ctx = ensureAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const startAt = ctx.currentTime + idx * 0.075;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startAt);
      gain.gain.setValueAtTime(0.001, startAt);
      gain.gain.linearRampToValueAtTime(0.11, startAt + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startAt);
      osc.stop(startAt + 0.3);
    });
  } catch (_) {
    // Ses hatası yok sayılır
  }
}

// Kilitli Koleksiyon Kartı Ses Efektleri (Yanlış Şık / Kilit Açılma / Efsanevi Kart Melodisi)
function playLockErrorBuzz() {
  try {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.18);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  } catch (_) {
    // Ses hatası yok sayılır
  }
}

function playLockOpenSound() {
  try {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    const notes = [587.33, 880];
    notes.forEach((freq, idx) => {
      const startAt = ctx.currentTime + idx * 0.065;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startAt);
      gain.gain.setValueAtTime(0.001, startAt);
      gain.gain.linearRampToValueAtTime(0.12, startAt + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startAt);
      osc.stop(startAt + 0.24);
    });
  } catch (_) {
    // Ses hatası yok sayılır
  }
}

function playLegendaryCardUnlockFanfare() {
  try {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((freq, idx) => {
      const startAt = ctx.currentTime + idx * 0.075;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = idx === notes.length - 1 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, startAt);
      gain.gain.setValueAtTime(0.001, startAt);
      gain.gain.linearRampToValueAtTime(0.14, startAt + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.36);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startAt);
      osc.stop(startAt + 0.38);
    });
  } catch (_) {
    // Ses hatası yok sayılır
  }
}

function playUiClickSound() {
  try {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(760, now);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.045);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.06 * currentAmbientVolume, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  } catch (_) {
    // Ses hatası yok sayılır
  }
}

function playRadioTuneBlip() {
  try {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1040, now);
    osc.frequency.linearRampToValueAtTime(1420, now + 0.07);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.055 * currentAmbientVolume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  } catch (_) {
    // Ses hatası yok sayılır
  }
}

// Tüm Anıtlar Keşfedildiğinde Neşeli Kozmik Başarı Fanfarı Çalar
function playCosmicVictoryFanfare() {
  try {
    const ctx = ensureAudioContext();
    if (!ctx) return;

    const melody = [
      { freq: 523.25, delay: 0.0, dur: 0.16, gain: 0.14 },
      { freq: 659.25, delay: 0.12, dur: 0.16, gain: 0.14 },
      { freq: 783.99, delay: 0.24, dur: 0.18, gain: 0.15 },
      { freq: 1046.5, delay: 0.38, dur: 0.26, gain: 0.18 },
      { freq: 783.99, delay: 0.56, dur: 0.14, gain: 0.13 },
      { freq: 1046.5, delay: 0.70, dur: 0.55, gain: 0.2 },
      { freq: 1318.51, delay: 0.72, dur: 0.52, gain: 0.11 }
    ];

    melody.forEach((n, idx) => {
      const startAt = ctx.currentTime + n.delay;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(n.freq, startAt);
      g.gain.setValueAtTime(0.001, startAt);
      g.gain.linearRampToValueAtTime(n.gain, startAt + 0.025);
      g.gain.exponentialRampToValueAtTime(0.001, startAt + n.dur);

      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(startAt);
      osc.stop(startAt + n.dur + 0.02);
    });
  } catch (_) {
    // Ses hatası yok sayılır
  }
}

// Çocuk Dostu Çizgi Film Astronot Karakteri ve Kaldırma Durumu
const astronautState = {
  element: null,
  svgEl: null,
  currentX: null,
  currentY: null,
  isWalking: false,
  targetPinObj: null,
  walkStartTime: 0,
  liftedPinObj: null,
  walkTimer: null
};

function getCartoonAstronautSvgMarkup() {
  const inner = `
      <!-- Sol arkada görünen sırt çantası -->
      <g class="astro-backpack">
        <path d="M52 79 C41 79 38 86 38 97 C38 108 42 114 53 114 Z" fill="#ffffff" stroke="#23153c" stroke-width="3.4" stroke-linejoin="round"/>
        <path d="M40 100 C40 108 43 112 52 112 L52 104 C46 105 42 103 40 100 Z" fill="#d8d7e8"/>
      </g>

      <!-- Bacaklar ve kalın ay botları -->
      <g class="astro-leg-left">
        <path d="M52 106 L65 106 L63 128 L50 128 Z" fill="#ffffff" stroke="#23153c" stroke-width="3.4" stroke-linejoin="round"/>
        <path d="M59 107 L64 107 L62 127 L58 127 Z" fill="#d8d7e8"/>
        <path d="M50 127 L64 127 L64 134 C64 137 61 138 56 138 L44 138 C39 138 38 134 41 131 C43 129 47 128 50 127 Z" fill="#ffffff" stroke="#23153c" stroke-width="3.4" stroke-linejoin="round"/>
        <path d="M41 134 L63 134 C63 136 60 137 56 137 L44 137 C41 137 40 135 41 134 Z" fill="#d8d7e8"/>
      </g>
      <g class="astro-leg-right">
        <path d="M68 106 L82 106 L84 128 L71 128 Z" fill="#ffffff" stroke="#23153c" stroke-width="3.4" stroke-linejoin="round"/>
        <path d="M69 107 L74 107 L75 127 L71 127 Z" fill="#d8d7e8"/>
        <path d="M70 127 L84 127 C87 128 91 129 93 131 C96 134 95 138 90 138 L77 138 C72 138 70 137 70 134 Z" fill="#ffffff" stroke="#23153c" stroke-width="3.4" stroke-linejoin="round"/>
        <path d="M71 134 L93 134 C93 136 91 137 88 137 L76 137 C73 137 71 136 71 134 Z" fill="#d8d7e8"/>
      </g>

      <!-- İşaret eden sol kol (havaya kaldırma hareketine uyumlu) -->
      <g class="astro-arm-left">
        <path d="M54 81 L42 67 L32 76 L48 93 Z" fill="#ffffff" stroke="#23153c" stroke-width="3.4" stroke-linejoin="round"/>
        <path d="M35 74 L48 89 L46 92 L33 76 Z" fill="#d8d7e8"/>
        <path d="M32 76 C26 74 23 68 25 63 C26 60 28 59 29 58 L22 49 C20 46 23 42 27 45 L35 55 C36 52 38 49 41 49 C44 49 45 53 43 57 C41 60 41 63 42 67 Z" fill="#ffffff" stroke="#23153c" stroke-width="3.4" stroke-linejoin="round"/>
        <path d="M27 65 C29 69 33 72 37 71 L33 75 C28 73 25 69 27 65 Z" fill="#d8d7e8"/>
      </g>

      <!-- Gövde, bel kemeri ve mavi düğmeli kontrol kutusu -->
      <g class="astro-torso">
        <path d="M50 76 C56 73 79 73 84 78 L86 108 C79 109 74 109 68 113 C62 110 56 109 49 108 Z" fill="#ffffff" stroke="#23153c" stroke-width="3.4" stroke-linejoin="round"/>
        <path d="M52 77 C61 81 74 81 83 78 L83 84 C73 86 60 85 51 82 Z" fill="#d8d7e8"/>
        <path d="M54 111 Q68 104 82 110" fill="none" stroke="#23153c" stroke-width="2.8" stroke-linecap="round"/>
        <!-- Kemer kayışı -->
        <path d="M47 93 Q57 96 65 95 L65 102 Q56 103 47 99 C45 97 45 94 47 93 Z" fill="#ffffff" stroke="#23153c" stroke-width="3.2" stroke-linejoin="round"/>
        <path d="M48 97 Q57 100 64 99 L64 101 Q56 102 48 98 Z" fill="#d8d7e8"/>
        <!-- Bel kontrol kutusu ve tek mavi düğme -->
        <rect x="63" y="88.5" width="23" height="16.5" rx="5.5" fill="#ffffff" stroke="#23153c" stroke-width="3.2"/>
        <path d="M65 100.5 L84 100.5 C84 102.8 82.5 103.8 80 103.8 L69 103.8 C66.5 103.8 65 102.8 65 100.5 Z" fill="#d8d7e8"/>
        <path d="M76.5 89 L76.5 96 L79.5 99 L79.5 104.5" fill="none" stroke="#23153c" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="70.2" cy="96.5" r="4.1" fill="#1da1f2" stroke="#23153c" stroke-width="2.4"/>
        <circle cx="69" cy="95.1" r="1.1" fill="#bae6fd"/>
      </g>

      <!-- Sağ kol -->
      <g class="astro-arm-right">
        <path d="M84 80 C90 83 94 89 93 95 C92 99 88 102 83 102 L83 94 C85 93 86 90 82 87 Z" fill="#ffffff" stroke="#23153c" stroke-width="3.4" stroke-linejoin="round"/>
        <path d="M84 95 C88 95 91 93 92 91 C92 96 89 100 84 101 Z" fill="#d8d7e8"/>
      </g>

      <!-- Hafif eğimli büyük kask ve koyu mor parlak vizör (içinde yüz yok) -->
      <g transform="rotate(13 73 48)">
        <!-- Kulaklık çıkıntıları -->
        <rect x="38.5" y="42" width="11" height="16" rx="5.5" fill="#ffffff" stroke="#23153c" stroke-width="3.2"/>
        <path d="M40 50 L48 50 L48 54 C48 56 46 57 44 57 C41.5 57 40 55.5 40 53 Z" fill="#d8d7e8"/>
        <rect x="96.5" y="42" width="11" height="16" rx="5.5" fill="#ffffff" stroke="#23153c" stroke-width="3.2"/>
        <path d="M98 50 L106 50 L106 54 C106 56 104 57 102 57 C99.5 57 98 55.5 98 53 Z" fill="#d8d7e8"/>

        <!-- Kask dış kabuğu -->
        <ellipse cx="73" cy="48" rx="29.5" ry="27.5" fill="#ffffff" stroke="#23153c" stroke-width="3.6"/>
        <path d="M47 32 Q73 20 99 32" fill="none" stroke="#23153c" stroke-width="2.6" stroke-linecap="round"/>

        <!-- Koyu mor opak vizör -->
        <ellipse cx="72" cy="52" rx="24.2" ry="20.8" fill="#24143a" stroke="#23153c" stroke-width="2.8"/>

        <!-- Sol üst iki oval parlama + sağda ince kavisli yansıma -->
        <ellipse cx="56.5" cy="46.5" rx="3.9" ry="5.6" transform="rotate(14 56.5 46.5)" fill="#b3a6cf" opacity="0.72"/>
        <circle cx="55.8" cy="56.2" r="2.3" fill="#b3a6cf" opacity="0.72"/>
        <path d="M78 36.8 C89.5 40.5 93 52 89.2 61.8 C88.2 51.8 84.5 42.5 75.5 39 Z" fill="#bfb4d9" opacity="0.68"/>
      </g>`;

  return `
    <svg class="astro-svg" viewBox="0 0 130 148" aria-hidden="true">
      ${inner}
    </svg>
  `;
}

function getVictoryRunnerAstronautSvgMarkup() {
  return `
    <svg class="astro-svg" viewBox="0 0 130 148" aria-hidden="true">
      <g stroke="#23153c" stroke-width="3.4" stroke-linejoin="round">
        <g class="astro-leg-left">
          <path d="M65 105 L81 106 L83 133 L85 139 Q85 143 80 143 H66 Q57 143 59 138 Q60 134 70 133 Z" fill="#c8c6d8"/>
          <path d="M60 140 H83" fill="none" stroke-width="2"/>
        </g>
        <g class="astro-arm-left">
          <path d="M72 81 Q78 78 83 83 L92 96 L105 91 Q112 89 114 95 Q115 100 109 103 L94 109 Q89 110 85 106 L73 94 Z" fill="#c8c6d8"/>
        </g>
        <rect x="78" y="75" width="25" height="41" rx="10" fill="#d8d7e8"/>
        <path d="M94 82 V108" fill="none" stroke="#a5a1bb" stroke-width="2.4" stroke-linecap="round"/>
        <g class="astro-leg-right">
          <path d="M55 104 L74 105 L73 133 Q76 137 75 141 Q74 144 70 144 H48 Q42 144 43 139 Q44 135 56 133 Z" fill="#fff"/>
          <path d="M45 140 H73" fill="none" stroke-width="2"/>
        </g>
        <path d="M52 74 Q66 68 81 78 L85 107 Q72 116 53 109 L49 91 Z" fill="#fff"/>
        <path d="M53 103 Q67 110 84 103 L85 107 Q72 116 53 109 Z" fill="#d8d7e8" stroke-width="2"/>
        <path d="M76 82 L82 100" fill="none" stroke="#b6b2c9" stroke-width="3"/>
        <g class="astro-arm-right">
          <path d="M68 79 Q74 83 70 90 L56 105 Q52 109 46 106 L26 96 Q20 93 23 88 Q25 84 31 86 L49 93 L59 81 Q63 76 68 79 Z" fill="#fff"/>
          <circle cx="26" cy="90" r="7" fill="#fff"/>
          <circle cx="62" cy="86" r="3" fill="#1da1f2" stroke-width="1.8"/>
        </g>
        <path d="M90 48 Q91 68 77 76 Q70 80 56 77 Q41 76 37 66 L34 54 Q32 34 47 24 Q60 16 75 24 Q88 31 90 48 Z" fill="#fff"/>
        <path d="M35 43 Q42 34 55 35 Q66 35 66 44 Q65 57 53 65 Q45 70 37 66 Q31 59 33 49 Z" fill="#24143a"/>
        <path d="M39 47 Q45 41 54 42 M38 53 L40 51" fill="none" stroke="#b3a6cf" stroke-width="2.8" stroke-linecap="round"/>
        <rect x="70" y="44" width="14" height="18" rx="6" fill="#d8d7e8"/>
      </g>
    </svg>
  `;
}

function createAstronautElement() {
  const wrap = document.createElement('div');
  wrap.id = 'space-astronaut';
  wrap.className = 'astronaut-wrap hidden';
  wrap.innerHTML = getCartoonAstronautSvgMarkup();
  return wrap;
}

function ensureAstronautElement() {
  if (astronautState.element) return astronautState.element;
  const el = createAstronautElement();
  pinsContainer.appendChild(el);
  astronautState.element = el;
  astronautState.svgEl = el.querySelector ? el.querySelector('.astro-svg') : null;
  return el;
}

function resetAstronaut() {
  if (astronautState.walkTimer) {
    clearInterval(astronautState.walkTimer);
    astronautState.walkTimer = null;
  }
  astronautState.isWalking = false;
  astronautState.targetPinObj = null;
  astronautState.walkStartTime = 0;
  astronautState.liftedPinObj = null;
  astronautState.currentX = null;
  astronautState.currentY = null;
  if (astronautState.element) {
    astronautState.element.classList.add('hidden');
    astronautState.element.classList.remove('walking', 'lifting');
  }
  document.querySelectorAll('.surface-pin.lifted').forEach((p) => p.classList.remove('lifted'));
}

function spawnBootprint(x, y, stepIdx) {
  const mark = document.createElement('div');
  mark.className = 'bootprint-mark';
  const sideOffset = stepIdx % 2 === 0 ? -7 : 7;
  mark.style.left = `${x + sideOffset}px`;
  mark.style.top = `${y + 38}px`;
  pinsContainer.appendChild(mark);

  const puff = document.createElement('div');
  puff.className = 'dust-puff';
  puff.style.left = `${x}px`;
  puff.style.top = `${y + 36}px`;
  pinsContainer.appendChild(puff);

  setTimeout(() => {
    if (mark.remove) mark.remove();
    if (puff.remove) puff.remove();
  }, 1800);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function computePinScreenCoords(pinObj) {
  const worldPos = pinObj.localPos.clone().applyMatrix4(pinObj.mesh.matrixWorld);
  const projected = worldPos.project(camera);
  return {
    x: (projected.x * 0.5 + 0.5) * window.innerWidth,
    y: (-(projected.y * 0.5) + 0.5) * window.innerHeight
  };
}

function computePlanetCenterScreenCoords(mesh) {
  const centerPos = mesh && mesh.position ? mesh.position.clone() : new THREE.Vector3(-2.1, 0, 1.3);
  const projected = centerPos.project(camera);
  return {
    x: (projected.x * 0.5 + 0.5) * window.innerWidth,
    y: (-(projected.y * 0.5) + 0.5) * window.innerHeight
  };
}

function walkAstronautToPin(pinObj, eq) {
  if (!pinObj) return;
  const astro = ensureAstronautElement();

  if (astronautState.walkTimer) {
    clearInterval(astronautState.walkTimer);
    astronautState.walkTimer = null;
  }

  // Önceki kaldırılan sistemi aşağı indir
  document.querySelectorAll('.surface-pin.lifted').forEach((p) => p.classList.remove('lifted'));
  astronautState.liftedPinObj = null;

  const startPinCoords =
    typeof pinObj.screenX === 'number' && typeof pinObj.screenY === 'number'
      ? { x: pinObj.screenX, y: pinObj.screenY }
      : computePinScreenCoords(pinObj);

  pinObj.originX = startPinCoords.x;
  pinObj.originY = startPinCoords.y;
  pinObj.centerProgress = pinObj.centerProgress || 0;
  astronautState.targetPinObj = pinObj;
  astronautState.walkStartTime = Date.now();

  const startX = astronautState.currentX !== null ? astronautState.currentX : Math.max(70, startPinCoords.x - 95);
  const startY = astronautState.currentY !== null ? astronautState.currentY : startPinCoords.y + 52;

  astronautState.currentX = startX;
  astronautState.currentY = startY;
  astronautState.isWalking = true;

  astro.classList.remove('hidden', 'lifting');
  astro.classList.add('walking');
  astro.style.left = `${startX}px`;
  astro.style.top = `${startY}px`;

  // İlk adım sesi hemen kullanıcı tıklaması içinde çalsın
  let step = 0;
  const totalSteps = 6;
  playSpaceFootstep(step);
  spawnBootprint(startX, startY, step);

  astronautState.walkTimer = setInterval(() => {
    step += 1;
    const planetCenter = computePlanetCenterScreenCoords(pinObj.mesh);
    const centerPinX = planetCenter.x;
    const centerPinY = planetCenter.y + 24;

    const t = Math.min(1, step / totalSteps);
    const eased = easeInOutCubic(t);
    pinObj.centerProgress = eased;

    const curPinX = pinObj.originX + (centerPinX - pinObj.originX) * eased;
    const curPinY = pinObj.originY + (centerPinY - pinObj.originY) * eased;
    pinObj.screenX = curPinX;
    pinObj.screenY = curPinY;
    pinObj.element.style.left = `${curPinX}px`;
    pinObj.element.style.top = `${curPinY}px`;

    const goalX = centerPinX;
    const goalY = centerPinY + 36;
    const curX = startX + (goalX - startX) * eased;
    const hopArc = Math.sin(t * Math.PI) * -14;
    const curY = startY + (goalY - startY) * eased + hopArc;

    astronautState.currentX = curX;
    astronautState.currentY = curY;
    astro.style.left = `${curX}px`;
    astro.style.top = `${curY}px`;

    if (step < totalSteps) {
      playSpaceFootstep(step);
      spawnBootprint(curX, curY, step);
      return;
    }

    // Hedefe ulaşıldı: Gezegen merkezinde sistemi havaya kaldır!
    clearInterval(astronautState.walkTimer);
    astronautState.walkTimer = null;
    astronautState.isWalking = false;
    pinObj.centerProgress = 1;
    astronautState.currentX = goalX;
    astronautState.currentY = goalY;
    astronautState.liftedPinObj = pinObj;

    astro.style.left = `${goalX}px`;
    astro.style.top = `${goalY}px`;
    astro.classList.remove('walking');
    astro.classList.add('lifting');
    pinObj.element.classList.add('lifted');

    playLiftFanfare();
  }, 155);
}

// Enlem/Boylamı 3B Küre Koordinatına Çevirme
function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// UI Elementleri
const infoPanel = document.getElementById('info-panel');
const panelContent = document.getElementById('panel-content');
const resetBtn = document.getElementById('reset-btn');
const introHint = document.getElementById('intro-hint');
const pinsContainer = document.getElementById('pins-container');
const nostalgiaCard = document.getElementById('nostalgia-card');
const cosmicTimeline = document.getElementById('cosmic-timeline');
const timelineTrack = document.getElementById('timeline-track');
const timelinePrevBtn = document.getElementById('timeline-prev');
const timelineNextBtn = document.getElementById('timeline-next');
const timelineAstronaut = document.getElementById('timeline-astronaut');
const repairedCountLabel = document.getElementById('repaired-count-label');
const topProgressFill = document.getElementById('top-progress-fill');
const quickDemoBtn = document.getElementById('quick-demo-btn');
const celebrationModal = document.getElementById('celebration-modal');
const celebrationForm = document.getElementById('celebration-form');
const explorerNameInput = document.getElementById('explorer-name-input');
const closeCelebrationBtn = document.getElementById('close-celebration-btn');

const TOTAL_RESOURCE_VEHICLES = 9;
const discoveredEquipment = new Set();
const repairedVehicles = new Set();
const unlockedCards = new Set();
const cardLockProgress = {};
let repairedCount = 0;
let celebrationTriggered = false;
window.discoveredEquipment = discoveredEquipment;
window.unlockedCards = unlockedCards;
window.repairedCount = 0;

let victoryMonumentGroup = null;
let victoryFlagMesh = null;
let victoryFlagBasePos = null;
let victoryConfettiPoints = null;
let victoryFootprintParticles = [];
let victoryModeActive = false;
let victoryRunState = 'idle';
let victoryTotalRotation = 0;
let victoryStepCount = 0;
let victoryPlantSeconds = 0;
const VICTORY_TARGET_ROTATION = Math.PI * 2;
const VICTORY_ROLL_AXIS = new THREE.Vector3(0, 0, 1);
let victoryPlanetId = null;
let victoryOverlayEl = null;
let victorySwitchEl = null;
let victoryWalkTimer = null;
let currentVictoryExplorerName = '';
let currentVictorySerial = '';
window.victoryMonumentGroup = null;
window.getVictorySceneState = () => ({
  victoryRunState,
  victoryTotalRotation,
  victoryTargetRotation: VICTORY_TARGET_ROTATION,
  victoryStepCount,
  victoryPlanetId
});

function updateRepairProgressUI() {
  repairedCount = Math.max(discoveredEquipment.size, repairedVehicles.size, unlockedCards.size);
  window.repairedCount = repairedCount;
  const pct = Math.min(100, Math.round((repairedCount / TOTAL_RESOURCE_VEHICLES) * 100));
  if (repairedCountLabel) {
    repairedCountLabel.textContent = `${repairedCount} / ${TOTAL_RESOURCE_VEHICLES}`;
  }
  if (topProgressFill) {
    topProgressFill.style.width = `${pct}%`;
  }
  const albumBtn = document.getElementById('open-album-btn');
  if (albumBtn) {
    albumBtn.textContent = `🗂️ Uzay Albümüm (${repairedCount}/${TOTAL_RESOURCE_VEHICLES})`;
  }
}

function removeVictoryMonument(preservePanelMode = false) {
  victoryModeActive = false;
  victoryRunState = 'idle';
  victoryTotalRotation = 0;
  victoryStepCount = 0;
  victoryPlantSeconds = 0;
  if (victoryWalkTimer) {
    clearInterval(victoryWalkTimer);
    victoryWalkTimer = null;
  }
  if (victoryOverlayEl) {
    if (typeof victoryOverlayEl.remove === 'function') {
      victoryOverlayEl.remove();
    } else if (victoryOverlayEl.parentNode && typeof victoryOverlayEl.parentNode.removeChild === 'function') {
      victoryOverlayEl.parentNode.removeChild(victoryOverlayEl);
    }
    victoryOverlayEl = null;
  }
  if (victorySwitchEl) {
    if (typeof victorySwitchEl.remove === 'function') {
      victorySwitchEl.remove();
    } else if (victorySwitchEl.parentNode && typeof victorySwitchEl.parentNode.removeChild === 'function') {
      victorySwitchEl.parentNode.removeChild(victorySwitchEl);
    }
    victorySwitchEl = null;
  }
  if (victoryMonumentGroup) {
    if (victoryMonumentGroup.parent && typeof victoryMonumentGroup.parent.remove === 'function') {
      victoryMonumentGroup.parent.remove(victoryMonumentGroup);
    } else {
      moonMesh.remove(victoryMonumentGroup);
      marsMesh.remove(victoryMonumentGroup);
    }
  }
  if (!preservePanelMode) {
    if (infoPanel) infoPanel.classList.remove('victory-mode');
    if (cosmicTimeline) cosmicTimeline.classList.remove('victory-hidden');
  }
  victoryMonumentGroup = null;
  victoryFlagMesh = null;
  victoryFlagBasePos = null;
  victoryConfettiPoints = null;
  victoryFootprintParticles = [];
  victoryPlanetId = null;
  window.victoryMonumentGroup = null;
}

function openCelebrationModal() {
  playCosmicVictoryFanfare();
  if (celebrationModal) {
    celebrationModal.classList.remove('hidden');
  }
  if (explorerNameInput && typeof explorerNameInput.focus === 'function') {
    setTimeout(() => explorerNameInput.focus(), 60);
  }
}

function checkMissionCompletion() {
  if (!celebrationTriggered && discoveredEquipment.size >= TOTAL_RESOURCE_VEHICLES) {
    celebrationTriggered = true;
    openCelebrationModal();
  }
}

function triggerQuickDemoCompletion() {
  ['moon', 'mars'].forEach((planetKey) => {
    const planet = SPACE_DATA[planetKey];
    if (!planet || !Array.isArray(planet.equipment)) return;
    planet.equipment.forEach((eq) => {
      discoveredEquipment.add(eq.id);
      repairedVehicles.add(eq.id);
      unlockedCards.add(eq.id);
      cardLockProgress[eq.id] = new Set([0, 1]);
    });
  });

  // Açık bir koleksiyon kartı varsa görselini ve kilitlerini anında aç
  const activeCardEl = document.getElementById('collectible-card');
  if (activeCardEl && activeCardEl.dataset && activeCardEl.dataset.eqId) {
    const activeEqId = activeCardEl.dataset.eqId;
    const ownerPlanet = SPACE_DATA.moon.equipment.some((e) => e.id === activeEqId) ? 'moon' : 'mars';
    const eqObj = findEquipmentById(ownerPlanet, activeEqId);
    if (eqObj) applyUnlockedCardDOM(ownerPlanet, eqObj, false);
  }

  updateRepairProgressUI();
  celebrationTriggered = true;
  openCelebrationModal();
}

window.triggerQuickDemoCompletion = triggerQuickDemoCompletion;

let currentTimelineIndex = -1;
let timelineNodeElements = [];
let timelineAstroX = 72;
let timelineAstroWalkTimer = null;
let lastProgrammaticTimelineScrollAt = 0;
let timelineStepAudioRequested = false;

function findEquipmentById(planetId, eqId) {
  const planet = SPACE_DATA[planetId];
  if (!planet || !Array.isArray(planet.equipment)) return null;
  return planet.equipment.find((item) => item.id === eqId) || null;
}

// Gezegen Seçildiğinde Çalışır
function selectPlanet(planetId) {
  playUiClickSound();
  stopStoryAudio();
  selectedPlanet = planetId;
  rotationPausedUntil = 0;
  focusRotationTarget = null;
  resetAstronaut();
  removeVictoryMonument();
  introHint.classList.add('hidden');
  resetBtn.classList.remove('hidden');
  infoPanel.classList.add('open');

  if (planetId === 'moon') {
    // Ay sol tarafa yaklaşır, Mars sağ dışarı çıkar
    targets.moon.pos.set(-2.1, 0, 1.3);
    targets.moon.scale = 1.35;
    targets.mars.pos.set(12, 0, -5);
    targets.mars.scale = 0.5;
  } else {
    // Mars sol tarafa yaklaşır, Ay sol dışarı çıkar
    targets.mars.pos.set(-2.1, 0, 1.3);
    targets.mars.scale = 1.25;
    targets.moon.pos.set(-12, 0, -5);
    targets.moon.scale = 0.5;
  }

  renderPlanetOverview(planetId);
  createSurfacePins(planetId);
}

// Ana Ekrana Dönüş
resetBtn.addEventListener('click', () => {
  playUiClickSound();
  stopStoryAudio();
  selectedPlanet = null;
  rotationPausedUntil = 0;
  focusRotationTarget = null;
  resetAstronaut();
  removeVictoryMonument();
  hideNostalgiaCard();
  syncTimelineUI(-1);
  infoPanel.classList.remove('open');
  resetBtn.classList.add('hidden');
  introHint.classList.remove('hidden');
  pinsContainer.innerHTML = '';
  activePinMarkers = [];

  targets.moon.pos.set(-1.9, 0, 0);
  targets.moon.scale = 1;
  targets.mars.pos.set(1.9, 0, 0);
  targets.mars.scale = 1;
});

// Gezegen Genel Bilgisi ve Araç Listesi
function renderPlanetOverview(planetId) {
  stopStoryAudio();
  resetAstronaut();
  hideNostalgiaCard();
  syncTimelineUI(-1);
  rotationPausedUntil = 0;
  document.querySelectorAll('.surface-pin.active').forEach((p) => p.classList.remove('active'));
  const activeMesh = planetId === 'moon' ? moonMesh : marsMesh;
  focusRotationTarget = { mesh: activeMesh, targetY: activeMesh.rotation.y, targetX: 0 };
  const data = SPACE_DATA[planetId];
  let cardsHtml = data.equipment
    .map((eq) => {
      const unlocked = unlockedCards.has(eq.id);
      const rarity = eq.cardData ? eq.cardData.rarity : 'EFSANEVİ';
      return `
      <div class="eq-card ${unlocked ? 'eq-card-unlocked' : ''}" onclick="showEquipmentStory('${planetId}', '${eq.id}')">
        <img class="eq-card-thumb" data-eq-img="${eq.id}" src="${eq.image}" alt="${eq.name}" onerror="this.onerror=null;this.src='${eq.fallbackImage || eq.image}'" />
        <div class="eq-card-info">
          <div class="eq-card-top-badges">
            <span class="eq-card-status-pill ${unlocked ? 'unlocked' : 'locked'}">${unlocked ? '✨ KART AÇIK' : '🔒 KİLİTLİ KART'}</span>
            <span class="eq-card-rarity-pill">${rarity}</span>
          </div>
          <h4>${eq.name}</h4>
          <span>${eq.year} • ${eq.location}</span>
        </div>
      </div>
    `;
    })
    .join('');

  panelContent.innerHTML = `
    <div class="overview-top-bar">
      <div class="panel-subtitle">${data.subtitle}</div>
      <button id="open-album-btn" class="space-album-btn" type="button" onclick="openSpaceAlbum()">🗂️ Uzay Albümüm (${repairedCount}/${TOTAL_RESOURCE_VEHICLES})</button>
    </div>
    <h2 class="panel-title">${data.name}</h2>
    <p class="panel-desc">${data.description}</p>
    <div class="equipment-list-title">Yüzeyde Uyuyan Uzay Kahramanları (Tıkla, Telsiz Kaydını Dinle &amp; Kilitleri Aç!)</div>
    ${cardsHtml}
  `;
}

function formatAudioTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const totalSecs = Math.floor(seconds);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function buildStoryAudioPlayerHtml(eq) {
  if (!eq || !eq.audioUrl) return '';
  return `
    <div class="telsiz-top-row">
      <div id="story-audio-player" class="story-audio-player compact-telsiz">
        <div class="story-audio-top">
          <button id="story-audio-toggle" class="story-audio-toggle" type="button" aria-label="Telsiz kaydını oynat veya duraklat" title="Oynat / Duraklat">▶️</button>
          <div class="story-audio-meta">
            <div class="story-audio-kicker">📻 TELSİZ KAYDI</div>
            <div id="story-audio-status" class="story-audio-status">Otomatik başlatılıyor...</div>
          </div>
          <div id="story-audio-eq" class="story-audio-eq" aria-hidden="true">
            <span class="eq-bar"></span>
            <span class="eq-bar"></span>
            <span class="eq-bar"></span>
            <span class="eq-bar"></span>
            <span class="eq-bar"></span>
          </div>
        </div>
        <div class="story-audio-bottom">
          <div id="story-audio-progress" class="story-audio-progress" role="slider" aria-label="Ses ilerleme çubuğu" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabindex="0">
            <div id="story-audio-progress-fill" class="story-audio-progress-fill" style="width: 0%"></div>
          </div>
          <span id="story-audio-time" class="story-audio-time">00:00 / 00:00</span>
        </div>
      </div>
      <button id="open-album-btn" class="space-album-btn" type="button" onclick="openSpaceAlbum()" title="9 Kartlık Koleksiyon Albümünü Aç">🗂️ Uzay Albümüm (${repairedCount}/${TOTAL_RESOURCE_VEHICLES})</button>
    </div>
  `;
}

function buildCollectibleCardHtml(planetId, eq, storyParagraphsHtml) {
  const cardData = eq.cardData || {
    rarity: 'EFSANEVİ',
    stats: { dayaniklilik: 90, bilimGucu: 92, cesaret: 95 },
    secretFact: eq.thankYouMessage || '',
    locks: []
  };
  const solvedSet = cardLockProgress[eq.id] || new Set();
  const isUnlocked = unlockedCards.has(eq.id) || (cardData.locks.length > 0 && solvedSet.size >= cardData.locks.length);
  const surfaceImg = eq.image;
  const fallbackSrc = eq.fallbackImage || eq.pristineImage || eq.image;

  const locksHtml = cardData.locks
    .map((lock, lockIdx) => {
      const isLockSolved = isUnlocked || solvedSet.has(lockIdx);
      const chipsHtml = lock.options
        .map((optText, optIdx) => {
          const isCorrectChoice = isLockSolved && optIdx === lock.correctIndex;
          return `
            <button
              id="lock-chip-${lockIdx}-${optIdx}"
              class="lock-option-chip ${isCorrectChoice ? 'correct-choice' : ''}"
              type="button"
              data-lock-index="${lockIdx}"
              data-opt-index="${optIdx}"
              onclick="answerCardLock('${planetId}', '${eq.id}', ${lockIdx}, ${optIdx})"
            >${optText}</button>
          `;
        })
        .join('');

      return `
        <div id="card-lock-${lockIdx}" class="card-lock-box ${isLockSolved ? 'lock-solved' : ''}">
          <div class="card-lock-title" id="card-lock-title-${lockIdx}">
            ${isLockSolved ? '🔓' : '🔒'} Kilit ${lockIdx + 1}: ${lock.title}${isLockSolved ? ' ✓' : ''}
          </div>
          <div class="lock-options-row">${chipsHtml}</div>
        </div>
      `;
    })
    .join('');

  return `
    <div id="collectible-card-scene" class="collectible-card-scene">
      <div id="collectible-card" class="collectible-card ${isUnlocked ? 'unlocked-legendary' : 'locked'}" data-eq-id="${eq.id}" data-rarity="${cardData.rarity}">
        <div class="card-holo-shimmer" aria-hidden="true"></div>

        <!-- KARTIN ÖN YÜZÜ -->
        <div class="card-face card-front">
          <div class="card-front-header">
            <span class="card-rarity-badge ${cardData.rarity === 'EFSANEVİ' ? 'legendary' : 'epic'}">★ ${cardData.rarity}</span>
            <span id="card-lock-badge" class="card-lock-badge ${isUnlocked ? 'unlocked' : 'locked'}">
              ${isUnlocked ? '🔓 KOLEKSİYON KARTI' : '🔒 KİLİTLİ ANIT'}
            </span>
          </div>
          <h2 class="card-title">${eq.name}</h2>

          <div id="card-visual-frame" class="card-visual-frame ${isUnlocked ? 'restored-pristine' : 'dusty-locked'}">
            <img class="card-vehicle-img" data-eq-img="${eq.id}" src="${surfaceImg}" alt="${eq.name}" onerror="this.onerror=null;this.src='${fallbackSrc}'" />
            <div class="card-scanline-flash" aria-hidden="true"></div>
            <span id="card-visual-status" class="card-visual-status">
              ${isUnlocked ? '✨ YENİ HALİ • İLK GÜN PERFORMANSI %100' : '🧹 SESSİZ ANIT • TOZ &amp; RADYASYON ALTINDA'}
            </span>
          </div>

          <div class="card-locks-container">
            <div id="card-lock-feedback" class="card-lock-feedback ${isUnlocked ? 'success' : ''}">
              ${isUnlocked ? '🏆 Tüm kilitler açıldı! Efsanevi kart koleksiyonuna eklendi!' : '🎧 Telsiz kaydını dikkatle dinle ve 2 güvenlik kilidini çöz!'}
            </div>
            ${locksHtml}
          </div>
        </div>

        <!-- KARTIN ARKA YÜZÜ -->
        <div class="card-face card-back">
          <div class="card-back-header">
            <span class="card-back-kicker">🛰️ NSSDCA GÖREV KÜNYESİ • ${eq.nasaId || 'NASA'}</span>
            <button id="flip-card-back-btn" class="card-back-flip-btn" type="button" onclick="toggleCollectibleCardFlip(false)">🔄 Ön Yüze Dön</button>
          </div>
          <h3 class="card-back-title">${eq.name}</h3>

          <div class="card-nssdca-grid">
            <div class="card-nssdca-cell"><label>Görev Yılları</label><strong>${eq.year}</strong></div>
            <div class="card-nssdca-cell"><label>Nadirlik</label><strong>★ ${cardData.rarity}</strong></div>
            <div class="card-nssdca-cell" style="grid-column: span 2;"><label>İndiği Yer</label><strong>${eq.location}</strong></div>
            <div class="card-nssdca-cell" style="grid-column: span 2;"><label>Şu Anki Durum</label><strong>${eq.status}</strong></div>
          </div>

          <div class="card-stats-box">
            <div class="card-stats-heading">⚡ UZAY KAHRAMANI GÜÇ İSTATİSTİKLERİ</div>
            <div class="card-stat-row">
              <span>🛡️ Dayanıklılık</span>
              <div class="card-stat-bar"><div id="stat-bar-dayaniklilik" class="card-stat-fill stat-durability" style="width: ${cardData.stats.dayaniklilik}%"></div></div>
              <strong>${cardData.stats.dayaniklilik}</strong>
            </div>
            <div class="card-stat-row">
              <span>🔬 Bilim Gücü</span>
              <div class="card-stat-bar"><div id="stat-bar-bilim" class="card-stat-fill stat-science" style="width: ${cardData.stats.bilimGucu}%"></div></div>
              <strong>${cardData.stats.bilimGucu}</strong>
            </div>
            <div class="card-stat-row">
              <span>🚀 Cesaret</span>
              <div class="card-stat-bar"><div id="stat-bar-cesaret" class="card-stat-fill stat-courage" style="width: ${cardData.stats.cesaret}%"></div></div>
              <strong>${cardData.stats.cesaret}</strong>
            </div>
          </div>

          <div id="card-secret-box" class="card-secret-box">
            <div class="card-secret-title">🔑 GİZLİ MÜHENDİSLİK SIRRI</div>
            <p class="card-secret-text">${cardData.secretFact}</p>
          </div>

          <details id="story-accordion" class="story-accordion">
            <summary class="story-accordion-summary">📜 Hikâye Metnini Oku</summary>
            <div class="story-box">
              <div class="story-header">📖 Uzay Kahramanının Hikâyesi</div>
              ${storyParagraphsHtml}
            </div>
          </details>
        </div>
      </div>
    </div>

    <button id="flip-card-btn" class="flip-card-btn ${isUnlocked ? '' : 'locked-btn'}" type="button" ${isUnlocked ? '' : 'disabled'} onclick="toggleCollectibleCardFlip()">
      🔄 Kartı Çevir: Gizli Mühendislik Sırrını Gör
    </button>
  `;
}

function applyUnlockedCardDOM(planetId, eq, withFlash = true) {
  if (!eq) return;
  const cardData = eq.cardData || { locks: [] };
  const cardEl = document.getElementById('collectible-card');
  const lockBadgeEl = document.getElementById('card-lock-badge');
  const visualFrameEl = document.getElementById('card-visual-frame');
  const visualStatusEl = document.getElementById('card-visual-status');
  const feedbackEl = document.getElementById('card-lock-feedback');
  const flipBtn = document.getElementById('flip-card-btn');

  if (cardEl) {
    cardEl.classList.remove('locked');
    cardEl.classList.add('unlocked-legendary');
    if (withFlash) cardEl.classList.add('just-unlocked');
  }
  if (lockBadgeEl) {
    lockBadgeEl.textContent = '🔓 KOLEKSİYON KARTI';
    lockBadgeEl.classList.remove('locked');
    lockBadgeEl.classList.add('unlocked');
  }
  if (visualFrameEl) {
    visualFrameEl.classList.remove('dusty-locked');
    visualFrameEl.classList.add('restored-pristine');
  }
  if (visualStatusEl) {
    visualStatusEl.textContent = '✨ YENİ HALİ • İLK GÜN PERFORMANSI %100';
  }
  if (feedbackEl) {
    feedbackEl.textContent = '🏆 Tüm kilitler açıldı! Efsanevi kart koleksiyonuna eklendi!';
    feedbackEl.classList.remove('error');
    feedbackEl.classList.add('success');
  }
  if (flipBtn) {
    flipBtn.disabled = false;
    flipBtn.classList.remove('locked-btn');
  }

  (cardData.locks || []).forEach((lock, lockIdx) => {
    const lockBox = document.getElementById(`card-lock-${lockIdx}`);
    const lockTitleEl = document.getElementById(`card-lock-title-${lockIdx}`);
    const correctChip = document.getElementById(`lock-chip-${lockIdx}-${lock.correctIndex}`);
    if (lockBox) {
      lockBox.classList.remove('shake-error');
      lockBox.classList.add('lock-solved');
    }
    if (lockTitleEl) {
      lockTitleEl.textContent = `🔓 Kilit ${lockIdx + 1}: ${lock.title} ✓`;
    }
    if (correctChip) {
      correctChip.classList.add('correct-choice');
    }
  });
}

function unlockCollectibleCard(planetId, eq, playSound = true) {
  if (!eq) return;
  const alreadyUnlocked = unlockedCards.has(eq.id);
  const cardData = eq.cardData || { locks: [] };
  cardLockProgress[eq.id] = new Set((cardData.locks || []).map((_, idx) => idx));

  unlockedCards.add(eq.id);
  repairedVehicles.add(eq.id);
  discoveredEquipment.add(eq.id);

  applyUnlockedCardDOM(planetId, eq, !alreadyUnlocked);
  updateRepairProgressUI();

  if (playSound && !alreadyUnlocked) {
    playLegendaryCardUnlockFanfare();
  }
  checkMissionCompletion();
}

function completeStoryAudioVehicleRevival(planetId, eq) {
  if (!eq) return;
  unlockCollectibleCard(planetId, eq, !unlockedCards.has(eq.id));
}

window.answerCardLock = function (planetId, eqId, lockIndex, optionIndex) {
  const eq = findEquipmentById(planetId, eqId);
  if (!eq || !eq.cardData || !Array.isArray(eq.cardData.locks)) return;
  const lock = eq.cardData.locks[lockIndex];
  if (!lock) return;

  const lockBox = document.getElementById(`card-lock-${lockIndex}`);
  const lockTitleEl = document.getElementById(`card-lock-title-${lockIndex}`);
  const feedbackEl = document.getElementById('card-lock-feedback');
  const chosenChip = document.getElementById(`lock-chip-${lockIndex}-${optionIndex}`);

  if (optionIndex !== lock.correctIndex) {
    playLockErrorBuzz();
    if (lockBox) {
      lockBox.classList.remove('shake-error');
      void lockBox.offsetWidth;
      lockBox.classList.add('shake-error');
    }
    if (chosenChip) chosenChip.classList.add('wrong-choice');
    if (feedbackEl) {
      feedbackEl.textContent = '⚠️ Ses kaydını dikkatle dinle!';
      feedbackEl.classList.remove('success');
      feedbackEl.classList.add('error');
    }
    return;
  }

  // Doğru şık
  if (!cardLockProgress[eqId]) cardLockProgress[eqId] = new Set();
  const alreadySolvedLock = cardLockProgress[eqId].has(lockIndex);
  cardLockProgress[eqId].add(lockIndex);

  if (lockBox) {
    lockBox.classList.remove('shake-error');
    lockBox.classList.add('lock-solved');
  }
  if (lockTitleEl) {
    lockTitleEl.textContent = `🔓 Kilit ${lockIndex + 1}: ${lock.title} ✓`;
  }
  if (chosenChip) {
    chosenChip.classList.remove('wrong-choice');
    chosenChip.classList.add('correct-choice');
  }

  const solvedAll = cardLockProgress[eqId].size >= eq.cardData.locks.length;
  if (solvedAll) {
    unlockCollectibleCard(planetId, eq, true);
  } else {
    if (!alreadySolvedLock) playLockOpenSound();
    if (feedbackEl) {
      feedbackEl.textContent = '🔓 1. kilit açıldı! Kartı tamamlamak için diğer kilidi de çöz!';
      feedbackEl.classList.remove('error');
      feedbackEl.classList.add('success');
    }
  }
};

window.toggleCollectibleCardFlip = function (forceState) {
  const cardEl = document.getElementById('collectible-card');
  if (!cardEl) return;
  const eqId = cardEl.dataset ? cardEl.dataset.eqId : '';
  const isUnlocked = !cardEl.classList.contains('locked') || unlockedCards.has(eqId);
  if (!isUnlocked && forceState !== false) return;

  playUiClickSound();
  const shouldFlip = typeof forceState === 'boolean' ? forceState : !cardEl.classList.contains('flipped');
  cardEl.classList.toggle('flipped', shouldFlip);
  const flipBtn = document.getElementById('flip-card-btn');
  if (flipBtn) {
    flipBtn.textContent = shouldFlip
      ? '🔄 Kartı Çevir: Ön Yüze Dön'
      : '🔄 Kartı Çevir: Gizli Mühendislik Sırrını Gör';
  }
};

function initCollectibleCardInteractions() {
  const cardEl = document.getElementById('collectible-card');
  if (!cardEl) return;

  cardEl.addEventListener('mousemove', (e) => {
    const rect = cardEl.getBoundingClientRect ? cardEl.getBoundingClientRect() : null;
    if (!rect || rect.width <= 0 || rect.height <= 0) return;
    const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const relY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    const rx = ((0.5 - relY) * 14).toFixed(2);
    const ry = ((relX - 0.5) * 16).toFixed(2);
    if (cardEl.style && typeof cardEl.style.setProperty === 'function') {
      cardEl.style.setProperty('--card-rx', `${rx}deg`);
      cardEl.style.setProperty('--card-ry', `${ry}deg`);
      cardEl.style.setProperty('--shimmer-x', `${Math.round(relX * 100)}%`);
      cardEl.style.setProperty('--shimmer-y', `${Math.round(relY * 100)}%`);
    } else if (cardEl.style) {
      cardEl.style['--card-rx'] = `${rx}deg`;
      cardEl.style['--card-ry'] = `${ry}deg`;
      cardEl.style['--shimmer-x'] = `${Math.round(relX * 100)}%`;
      cardEl.style['--shimmer-y'] = `${Math.round(relY * 100)}%`;
    }
  });

  cardEl.addEventListener('mouseleave', () => {
    if (!cardEl.style) return;
    if (typeof cardEl.style.setProperty === 'function') {
      cardEl.style.setProperty('--card-rx', '0deg');
      cardEl.style.setProperty('--card-ry', '0deg');
      cardEl.style.setProperty('--shimmer-x', '50%');
      cardEl.style.setProperty('--shimmer-y', '50%');
    } else {
      cardEl.style['--card-rx'] = '0deg';
      cardEl.style['--card-ry'] = '0deg';
      cardEl.style['--shimmer-x'] = '50%';
      cardEl.style['--shimmer-y'] = '50%';
    }
  });
}

function initStoryAudioPlayer(planetId, eq) {
  if (!eq || !eq.audioUrl) return;
  const AudioCtor = (typeof window !== 'undefined' && window.Audio) || (typeof Audio !== 'undefined' ? Audio : null);
  if (!AudioCtor) return;

  playRadioTuneBlip();

  const playerEl = document.getElementById('story-audio-player');
  const toggleBtn = document.getElementById('story-audio-toggle');
  const statusEl = document.getElementById('story-audio-status');
  const eqEl = document.getElementById('story-audio-eq');
  const progressEl = document.getElementById('story-audio-progress');
  const progressFillEl = document.getElementById('story-audio-progress-fill');
  const timeEl = document.getElementById('story-audio-time');

  const resolvedSrc = resolveStoryAudioSrc(eq.audioUrl);
  let cachedEntry = storyAudioCache.get(eq.id);
  if (!cachedEntry) {
    cachedEntry = {
      eqId: eq.id,
      planetId,
      rawUrl: eq.audioUrl,
      encodedUrl: resolvedSrc,
      duration: 0,
      preloaded: true
    };
    storyAudioCache.set(eq.id, cachedEntry);
  } else {
    cachedEntry.rawUrl = eq.audioUrl;
    cachedEntry.encodedUrl = resolvedSrc;
  }

  const audio = new AudioCtor(resolvedSrc);
  audio.preload = 'auto';
  if (typeof audio.load === 'function') {
    try {
      audio.load();
    } catch (_) {}
  }
  currentStoryAudio = audio;

  const getEffectiveDuration = () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) return audio.duration;
    return cachedEntry && Number.isFinite(cachedEntry.duration) && cachedEntry.duration > 0 ? cachedEntry.duration : 0;
  };

  const syncPlayerUI = () => {
    const duration = getEffectiveDuration();
    const current = Number.isFinite(audio.currentTime) && audio.currentTime >= 0 ? audio.currentTime : 0;
    const pct = duration > 0 ? Math.min(100, Math.max(0, (current / duration) * 100)) : 0;
    const playing = !audio.paused && !audio.ended;

    if (progressFillEl) progressFillEl.style.width = `${pct.toFixed(2)}%`;
    if (progressEl && typeof progressEl.setAttribute === 'function') {
      progressEl.setAttribute('aria-valuenow', String(Math.round(pct)));
    }
    if (timeEl) {
      timeEl.textContent = `${formatAudioTime(current)} / ${formatAudioTime(duration)}`;
    }
    if (toggleBtn) toggleBtn.textContent = playing ? '⏸️' : '▶️';
    if (eqEl) eqEl.classList.toggle('playing', playing);
    if (playerEl) playerEl.classList.toggle('is-playing', playing);
    if (statusEl) {
      if (playing) {
        statusEl.textContent = 'Telsiz yayını açık...';
      } else if (audio.ended) {
        statusEl.textContent = 'Kayıt tamamlandı • Kart açıldı!';
      } else if (current > 0) {
        statusEl.textContent = 'Duraklatıldı';
      } else {
        statusEl.textContent = 'Dinlemek için oynat';
      }
    }
  };

  const onPlay = () => {
    if (currentStoryAudio !== audio) return;
    isStoryAudioPlaying = true;
    setAmbientSoundDucking(true);
    syncPlayerUI();
  };

  const onPause = () => {
    if (currentStoryAudio !== audio) return;
    isStoryAudioPlaying = false;
    setAmbientSoundDucking(false);
    syncPlayerUI();
  };

  const onTimeUpdate = () => {
    if (currentStoryAudio !== audio) return;
    syncPlayerUI();
  };

  const onLoadedMetadata = () => {
    if (currentStoryAudio !== audio) return;
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      cachedEntry.duration = audio.duration;
    }
    syncPlayerUI();
  };

  const onError = () => {
    if (currentStoryAudio !== audio) return;
    isStoryAudioPlaying = false;
    setAmbientSoundDucking(false);
    syncPlayerUI();
    if (statusEl) statusEl.textContent = 'Ses dosyası yüklenemedi';
  };

  const onEnded = () => {
    if (currentStoryAudio !== audio) return;
    isStoryAudioPlaying = false;
    setAmbientSoundDucking(false);
    syncPlayerUI();
    completeStoryAudioVehicleRevival(planetId, eq);
  };

  const onToggleClick = () => {
    if (currentStoryAudio !== audio) return;
    playUiClickSound();
    if (audio.paused || audio.ended) {
      if (audio.ended) {
        try {
          audio.currentTime = 0;
        } catch (_) {}
      }
      try {
        const playPromise = audio.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {
            isStoryAudioPlaying = false;
            setAmbientSoundDucking(false);
            if (statusEl) statusEl.textContent = 'Dinlemek için ▶️ butonuna bas';
            syncPlayerUI();
          });
        }
      } catch (_) {
        isStoryAudioPlaying = false;
        setAmbientSoundDucking(false);
        syncPlayerUI();
      }
    } else {
      audio.pause();
    }
  };

  const onProgressClick = (e) => {
    if (currentStoryAudio !== audio) return;
    const duration = getEffectiveDuration();
    if (duration <= 0) return;
    let ratio = 0;
    const rect = progressEl && typeof progressEl.getBoundingClientRect === 'function' ? progressEl.getBoundingClientRect() : null;
    if (rect && rect.width > 0 && typeof e.clientX === 'number') {
      ratio = (e.clientX - rect.left) / rect.width;
    } else if (typeof e.offsetX === 'number' && progressEl && progressEl.clientWidth > 0) {
      ratio = e.offsetX / progressEl.clientWidth;
    }
    ratio = Math.max(0, Math.min(1, ratio));
    try {
      audio.currentTime = ratio * duration;
    } catch (_) {}
    syncPlayerUI();
  };

  if (typeof audio.addEventListener === 'function') {
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('error', onError);
    audio.addEventListener('ended', onEnded);
  }
  if (toggleBtn) toggleBtn.addEventListener('click', onToggleClick);
  if (progressEl) progressEl.addEventListener('click', onProgressClick);

  currentStoryAudioCleanup = () => {
    if (typeof audio.removeEventListener === 'function') {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('ended', onEnded);
    }
  };

  syncPlayerUI();

  try {
    const autoPromise = audio.play();
    if (autoPromise && typeof autoPromise.catch === 'function') {
      autoPromise.catch(() => {
        if (currentStoryAudio !== audio) return;
        isStoryAudioPlaying = false;
        setAmbientSoundDucking(false);
        if (statusEl) statusEl.textContent = 'Dinlemek için ▶️ butonuna bas';
        syncPlayerUI();
      });
    }
  } catch (_) {
    isStoryAudioPlaying = false;
    setAmbientSoundDucking(false);
    if (statusEl) statusEl.textContent = 'Dinlemek için ▶️ butonuna bas';
    syncPlayerUI();
  }
}

window.openSpaceAlbum = function () {
  playUiClickSound();
  stopStoryAudio();
  resetAstronaut();
  hideNostalgiaCard();
  syncTimelineUI(-1);
  rotationPausedUntil = 0;

  if (introHint) introHint.classList.add('hidden');
  if (resetBtn) resetBtn.classList.remove('hidden');
  if (infoPanel) infoPanel.classList.add('open');

  const returnAction = selectedPlanet
    ? `renderPlanetOverview('${selectedPlanet}')`
    : `selectPlanet('moon')`;
  const returnLabel = selectedPlanet && SPACE_DATA[selectedPlanet]
    ? `← ${SPACE_DATA[selectedPlanet].name} Listesine Dön`
    : '← Ay Kaşiflerine Dön';

  const allItems = [];
  ['moon', 'mars'].forEach((pId) => {
    const pData = SPACE_DATA[pId];
    if (!pData || !Array.isArray(pData.equipment)) return;
    pData.equipment.forEach((eq) => allItems.push({ planetId: pId, planetLabel: pId === 'moon' ? '🌙 AY' : '🔴 MARS', eq }));
  });

  const gridHtml = allItems
    .map(({ planetId, planetLabel, eq }) => {
      const unlocked = unlockedCards.has(eq.id);
      const rarity = eq.cardData ? eq.cardData.rarity : 'EFSANEVİ';
      const shortName = eq.name.split('(')[0].trim();
      const fallbackSrc = eq.fallbackImage || eq.pristineImage || eq.image;
      return `
        <button
          id="album-card-${eq.id}"
          class="album-mini-card ${unlocked ? 'unlocked' : 'locked'}"
          type="button"
          onclick="selectAlbumCard('${planetId}', '${eq.id}')"
        >
          <span class="album-mini-planet">${planetLabel}</span>
          ${unlocked ? `<span class="album-mini-rarity">★ ${rarity}</span>` : '<span class="album-mystery-mark">?</span>'}
          <div class="album-mini-thumb-wrap">
            <img class="album-mini-thumb" data-eq-img="${eq.id}" src="${eq.image}" alt="${shortName}" onerror="this.onerror=null;this.src='${fallbackSrc}'" />
          </div>
          <div class="album-mini-name">${unlocked ? shortName : 'Gizli Anıt'}</div>
          <span class="album-mini-state">${unlocked ? '✨ AÇILDI' : '🔒 KİLİTLİ'}</span>
        </button>
      `;
    })
    .join('');

  const allCompleted = unlockedCards.size >= TOTAL_RESOURCE_VEHICLES;
  if (allCompleted) checkMissionCompletion();

  panelContent.innerHTML = `
    <div class="panel-top-nav">
      <button class="back-to-planet-btn" type="button" onclick="${returnAction}">${returnLabel}</button>
      <span class="album-count-pill">🏆 ${unlockedCards.size} / ${TOTAL_RESOURCE_VEHICLES}</span>
    </div>
    <div class="panel-subtitle">HOLOGRAFİK KOLEKSİYON</div>
    <h2 class="panel-title">🗂️ Uzay Albümüm</h2>
    <p class="panel-desc">Telsiz kayıtlarını dinleyip her aracın 2 güvenlik kilidini çözerek 9 efsanevi NASA kartını tamamla! Kilitli kartlara tıklayıp hemen görev sahnesine gidebilirsin.</p>
    <div id="space-album-grid" class="space-album-grid">
      ${gridHtml}
    </div>
    ${
      allCompleted
        ? `<div class="album-complete-banner">
             <p>🎉 Tebrikler Uzay Kaşifi! 9/9 Efsanevi Uzay Kartının tamamını açtın!</p>
             <button id="album-finish-cert-btn" class="plant-flag-btn" type="button" onclick="openCelebrationModal()">🏆 Zafer Ekranını Aç</button>
           </div>`
        : ''
    }
  `;
  if (infoPanel) infoPanel.scrollTop = 0;
};

window.selectAlbumCard = function (planetId, eqId) {
  if (selectedPlanet !== planetId) {
    selectPlanet(planetId);
  }
  window.showEquipmentStory(planetId, eqId);
};

// Tekil Araç Kartını ve Telsiz Kaydını Sağ Panelde Göster
window.showEquipmentStory = function (planetId, eqId) {
  stopStoryAudio();
  const planet = SPACE_DATA[planetId];
  const eq = planet.equipment.find((item) => item.id === eqId);

  // Bir cihaz seçili kaldığı sürece gezegenin otomatik dönüşünü durdur
  rotationPausedUntil = Infinity;

  document.querySelectorAll('.surface-pin').forEach((p) => {
    p.classList.toggle('active', p.dataset.eqId === eqId);
  });

  const pinObj = activePinMarkers.find((p) => p.eqId === eqId);
  if (pinObj) {
    // Tıklanan cihazın iniş noktasını yumuşakça gezegenin ön ortasına çevir
    const desiredY = ((-90 - eq.lon) * Math.PI) / 180 + 0.35;
    let diffY = (desiredY - pinObj.mesh.rotation.y) % (Math.PI * 2);
    if (diffY > Math.PI) diffY -= Math.PI * 2;
    if (diffY < -Math.PI) diffY += Math.PI * 2;
    const desiredX = Math.max(-0.95, Math.min(0.95, ((eq.lat * Math.PI) / 180) * 0.75));
    focusRotationTarget = {
      mesh: pinObj.mesh,
      targetY: pinObj.mesh.rotation.y + diffY,
      targetX: desiredX
    };

    walkAstronautToPin(pinObj, eq);
  }

  const storyParagraphsHtml = String(eq.story || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p class="story-paragraph">${p}</p>`)
    .join('');

  panelContent.innerHTML = `
    <div class="panel-top-nav">
      <button class="back-to-planet-btn" onclick="renderPlanetOverview('${planetId}')">← ${planet.name} Listesine Dön</button>
    </div>
    ${buildStoryAudioPlayerHtml(eq)}
    ${buildCollectibleCardHtml(planetId, eq, storyParagraphsHtml)}
  `;
  infoPanel.scrollTop = 0;
  initCollectibleCardInteractions();
  initStoryAudioPlayer(planetId, eq);
  syncTimelineForEquipment(planetId, eqId);
};

// Gezegen Yüzeyine Tıklanabilir HTML Pinleri Yerleştirme
function createSurfacePins(planetId) {
  pinsContainer.innerHTML = '';
  activePinMarkers = [];
  astronautState.element = null;
  const mesh = planetId === 'moon' ? moonMesh : marsMesh;
  const radius = planetId === 'moon' ? 1.15 : 1.3;

  SPACE_DATA[planetId].equipment.forEach((eq) => {
    const localPos = latLonToVector3(eq.lat, eq.lon, radius);
    const el = document.createElement('div');
    el.className = 'surface-pin';
    el.dataset.eqId = eq.id;
    el.innerHTML = `
      <img class="pin-thumb" data-eq-img="${eq.id}" src="${eq.image}" alt="${eq.name}" onerror="this.onerror=null;this.src='${eq.fallbackImage || eq.image}'" />
      <span class="pin-label">${eq.name.split('(')[0].trim()}</span>
    `;
    el.addEventListener('click', () => showEquipmentStory(planetId, eq.id));
    pinsContainer.appendChild(el);

    activePinMarkers.push({
      eqId: eq.id,
      eq,
      element: el,
      localPos,
      mesh,
      screenX: null,
      screenY: null,
      centerProgress: 0,
      originX: null,
      originY: null
    });
  });
}

// Görsel URL'sinin tarayıcıda gerçekten yüklenebildiğini doğrula
function probeImageLoad(url) {
  if (typeof Image !== 'function' || !url) return Promise.resolve(false);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

function applyEquipmentPhoto(eq, photoUrl) {
  if (!eq.fallbackImage) eq.fallbackImage = eq.image;
  eq.image = photoUrl;
  eq.pristineImage = photoUrl;

  document.querySelectorAll(`img[data-eq-img="${eq.id}"]`).forEach((img) => {
    img.onerror = () => {
      img.onerror = null;
      img.src = eq.fallbackImage;
    };
    img.src = photoUrl;
  });
}

// Çevrimiçiyken Gerçek NASA Arşiv Fotoğraflarını Yükleyip Görselleri Yükselt
async function preloadNasaArchivePhotos() {
  const allItems = [];
  Object.values(SPACE_DATA).forEach((planet) => {
    if (planet && Array.isArray(planet.equipment)) {
      planet.equipment.forEach((eq) => {
        if (eq.nasaId || (Array.isArray(eq.photoCandidates) && eq.photoCandidates.length > 0)) {
          allItems.push(eq);
        }
      });
    }
  });

  await Promise.all(
    allItems.map(async (eq) => {
      // 1. Öncelik: Doğrudan küratörlü Ay/Mars yüzeyi fotoğraf adaylarını dene
      if (Array.isArray(eq.photoCandidates)) {
        for (let i = 0; i < eq.photoCandidates.length; i++) {
          const url = eq.photoCandidates[i];
          if (url && (await probeImageLoad(url))) {
            applyEquipmentPhoto(eq, url);
            return;
          }
        }
      }

      // 2. Öncelik: Yalnızca ön adaylar yoksa veya yüklenemezse NASA Görsel API'sini sorgula
      if (!eq.nasaId || typeof fetch !== 'function') return;

      const apiCandidates = [];
      try {
        const res = await fetch(
          `https://images-api.nasa.gov/search?q=${encodeURIComponent(eq.nasaId)}&media_type=image`
        );
        if (res.ok) {
          const json = await res.json();
          const items = json && json.collection && json.collection.items;
          if (Array.isArray(items)) {
            for (let i = 0; i < items.length && apiCandidates.length < 5; i++) {
              const links = items[i] && items[i].links;
              if (Array.isArray(links)) {
                const match = links.find((l) => l && l.href && (!l.rel || l.rel === 'preview'));
                if (match && !apiCandidates.includes(match.href)) {
                  apiCandidates.push(match.href);
                }
              }
            }
          }
        }
      } catch (_) {
        // Ağ erişilemezse yerleşik SVG illüstrasyonu kullanılır
      }

      for (let i = 0; i < apiCandidates.length; i++) {
        const photoUrl = apiCandidates[i];
        if (await probeImageLoad(photoUrl)) {
          applyEquipmentPhoto(eq, photoUrl);
          return;
        }
      }
    })
  );
}

// Pinlerin 3B Ekrandaki Konumunu Her Karede Güncelle
function updatePinsScreenPosition() {
  const activeMesh = selectedPlanet === 'moon' ? moonMesh : marsMesh;
  const planetCenter = computePlanetCenterScreenCoords(activeMesh);
  const centerPinX = planetCenter.x;
  const centerPinY = planetCenter.y + 24;

  activePinMarkers.forEach((pinObj) => {
    const { element, localPos, mesh } = pinObj;
    const worldPos = localPos.clone().applyMatrix4(mesh.matrixWorld);
    const cameraToCenter = mesh.position.clone().sub(camera.position).normalize();
    const centerToPoint = worldPos.clone().sub(mesh.position).normalize();
    const isTarget = astronautState.targetPinObj === pinObj || astronautState.liftedPinObj === pinObj;

    if (!isTarget) {
      pinObj.centerProgress = Math.max(0, (pinObj.centerProgress || 0) - 0.065);
    }

    // Kürenin arka yüzünde kalan hedef dışı pinleri gizle
    if (cameraToCenter.dot(centerToPoint) > 0.15 && !isTarget && !(pinObj.centerProgress > 0.01)) {
      element.style.display = 'none';
      if (astronautState.liftedPinObj === pinObj && astronautState.element && !astronautState.isWalking) {
        astronautState.element.classList.add('hidden');
      }
      return;
    }

    element.style.display = 'flex';
    const projected = worldPos.project(camera);
    const projX = (projected.x * 0.5 + 0.5) * window.innerWidth;
    const projY = (-(projected.y * 0.5) + 0.5) * window.innerHeight;

    if (isTarget && astronautState.isWalking && astronautState.walkStartTime > 0) {
      const rawT = Math.min(1, (Date.now() - astronautState.walkStartTime) / (6 * 155));
      pinObj.centerProgress = Math.max(pinObj.centerProgress || 0, easeInOutCubic(rawT));
    }

    const baseX =
      isTarget && astronautState.isWalking && typeof pinObj.originX === 'number' ? pinObj.originX : projX;
    const baseY =
      isTarget && astronautState.isWalking && typeof pinObj.originY === 'number' ? pinObj.originY : projY;
    const progress = pinObj.centerProgress || 0;
    const x = baseX + (centerPinX - baseX) * progress;
    const y = baseY + (centerPinY - baseY) * progress;

    pinObj.screenX = x;
    pinObj.screenY = y;
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;

    if (astronautState.liftedPinObj === pinObj && astronautState.element && !astronautState.isWalking) {
      astronautState.element.classList.remove('hidden');
      astronautState.element.style.left = `${x}px`;
      astronautState.element.style.top = `${y + 36}px`;
      astronautState.currentX = x;
      astronautState.currentY = y + 36;
    }
  });
}

// Tıklama (Raycaster) ve Gezegeni Fareyle Çevirme
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function isUiOverlayEvent(e) {
  const t = e && e.target;
  if (!t) return false;
  if (typeof t.closest === 'function') {
    return Boolean(
      t.closest(
        '#info-panel, #collectible-card, #dust-canvas, #cosmic-timeline, #nostalgia-card, .top-bar, #celebration-modal, #victory-scene-overlay, #victory-planet-switch-container'
      )
    );
  }
  const tid = t.id || '';
  return (
    tid === 'collectible-card' ||
    tid === 'dust-canvas' ||
    tid === 'info-panel' ||
    tid === 'cosmic-timeline' ||
    tid === 'nostalgia-card' ||
    tid === 'celebration-modal' ||
    tid === 'quick-demo-btn' ||
    tid === 'victory-scene-overlay' ||
    tid === 'victory-planet-switch-container' ||
    tid === 'victory-planet-switch-btn' ||
    tid === 'victory-moon-btn' ||
    tid === 'victory-mars-btn'
  );
}

window.addEventListener('mousedown', (e) => {
  if (isUiOverlayEvent(e)) {
    isDragging = false;
    return;
  }
  isDragging = true;
  focusRotationTarget = null;
  prevMouse = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging || !selectedPlanet || isUiOverlayEvent(e)) return;
  const deltaX = e.clientX - prevMouse.x;
  const deltaY = e.clientY - prevMouse.y;
  const targetMesh = selectedPlanet === 'moon' ? moonMesh : marsMesh;
  targetMesh.rotation.y += deltaX * 0.008;
  targetMesh.rotation.x += deltaY * 0.008;
  prevMouse = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mouseup', () => {
  isDragging = false;
});

renderer.domElement.addEventListener('click', (e) => {
  if (selectedPlanet) return; // Zaten bir gezegen seçiliyse sadece pinlere tıklanır
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects([moonMesh, marsMesh]);
  if (hits.length > 0) {
    selectPlanet(hits[0].object.userData.id);
  }
});

// Pencere Boyutu Değişimi
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Ana Animasyon Döngüsü
let previousFrameTime = null;
function animate(frameTime = performance.now()) {
  requestAnimationFrame(animate);
  const elapsedSeconds = previousFrameTime === null
    ? 0
    : Math.min(0.05, Math.max(0, (frameTime - previousFrameTime) / 1000));
  previousFrameTime = frameTime;

  // Yumuşak Pozisyon ve Ölçek Geçişi (Lerp)
  moonMesh.position.lerp(targets.moon.pos, 0.08);
  moonMesh.scale.lerp(new THREE.Vector3(targets.moon.scale, targets.moon.scale, targets.moon.scale), 0.08);

  marsMesh.position.lerp(targets.mars.pos, 0.08);
  marsMesh.scale.lerp(new THREE.Vector3(targets.mars.scale, targets.mars.scale, targets.mars.scale), 0.08);

  // Seçili değilken yavaşça kendi etraflarında dönsünler
  if (victoryModeActive && victoryPlanetId) {
    const activeMesh = victoryPlanetId === 'moon' ? moonMesh : marsMesh;
    const radius = victoryPlanetId === 'moon' ? 1.15 : 1.3;

    if (victoryRunState === 'running') {
      const progress = VICTORY_TARGET_ROTATION > 0 ? victoryTotalRotation / VICTORY_TARGET_ROTATION : 1;
      const speedFactor = progress < 0.7 ? 1 : Math.max(0.14, 1 - ((progress - 0.7) / 0.3) * 0.86);
      const dTheta = 0.92 * elapsedSeconds * speedFactor;
      const prevRotation = victoryTotalRotation;
      victoryTotalRotation = Math.min(VICTORY_TARGET_ROTATION, victoryTotalRotation + dTheta);
      const appliedDelta = victoryTotalRotation - prevRotation;

      if (!isDragging && appliedDelta > 0) {
        // A clockwise roll carries the top of the planet right as the runner moves left.
        activeMesh.rotateOnWorldAxis(VICTORY_ROLL_AXIS, -appliedDelta);
      }

      const nextStep = Math.floor(victoryTotalRotation / (Math.PI / 5));
      if (nextStep > victoryStepCount) {
        victoryStepCount = nextStep;
        playSpaceFootstep(victoryStepCount);
        spawnVictoryGoldFootprintParticle();
      }

      if (Array.isArray(victoryFootprintParticles) && victoryFootprintParticles.length > 0) {
        for (let i = 0; i < victoryFootprintParticles.length; i++) {
          const fp = victoryFootprintParticles[i];
          const life = ((victoryTotalRotation * 0.65 + fp.userData.phase) % 1 + 1) % 1;
          const trailX = 0.04 + life * 0.44;
          const curveY = -0.012 - trailX * trailX * 0.24;
          fp.position.set(trailX, curveY, fp.userData.sideZ || 0);
          const fade = Math.sin(life * Math.PI);
          const sc = 0.65 + (1 - life) * 0.75;
          fp.scale.set(sc * 1.2, sc * 0.42, sc * 0.85);
          if (fp.material) {
            fp.material.opacity = Math.max(0.05, fade * 0.95);
          }
        }
      }

      if (victoryTotalRotation >= VICTORY_TARGET_ROTATION) {
        completeVictoryRunAndPlantFlag();
      }
    } else if (victoryRunState === 'planting') {
      victoryPlantSeconds += elapsedSeconds;
      if (Array.isArray(victoryFootprintParticles)) {
        for (let i = 0; i < victoryFootprintParticles.length; i++) {
          const fp = victoryFootprintParticles[i];
          if (fp && fp.material) {
            fp.material.opacity = Math.max(0, (fp.material.opacity || 0) * 0.88);
          }
        }
      }
      if (victoryPlantSeconds >= 1.12) {
        enterVictoryPose();
      }
    }

    syncVictoryMonumentTransform(activeMesh, radius);
  } else if (!selectedPlanet) {
    moonMesh.rotation.y += 0.003;
    marsMesh.rotation.y += 0.0025;
  } else if (focusRotationTarget) {
    const deltaY = focusRotationTarget.targetY - focusRotationTarget.mesh.rotation.y;
    const targetX = typeof focusRotationTarget.targetX === 'number' ? focusRotationTarget.targetX : 0;
    const deltaX = targetX - focusRotationTarget.mesh.rotation.x;
    if (Math.abs(deltaY) < 0.008 && Math.abs(deltaX) < 0.008) {
      focusRotationTarget.mesh.rotation.y = focusRotationTarget.targetY;
      focusRotationTarget.mesh.rotation.x = targetX;
      focusRotationTarget = null;
    } else {
      focusRotationTarget.mesh.rotation.y += deltaY * 0.07;
      focusRotationTarget.mesh.rotation.x += deltaX * 0.07;
    }
  } else if (
    !isDragging &&
    Date.now() > rotationPausedUntil &&
    !astronautState.isWalking &&
    !astronautState.targetPinObj &&
    !astronautState.liftedPinObj
  ) {
    // Seçiliyken ve cihaz odaklı değilken çok hafif süzülme dönüşü
    const activeMesh = selectedPlanet === 'moon' ? moonMesh : marsMesh;
    activeMesh.rotation.y += 0.0008;
  }

  // Yıldız arka planı hafif titreşim (twinkle) ve 3B Türk Bayrağı dalgalanması
  const nowSec = Date.now() * 0.001;
  for (let i = 0; i < starLayers.length; i++) {
    const sl = starLayers[i];
    if (sl && sl.material) {
      const wave = Math.sin(nowSec * sl.twinkleSpeed + sl.phase) * sl.twinkleAmp;
      sl.material.opacity = Math.max(0.25, Math.min(1.0, sl.baseOpacity + wave));
    }
  }
  if (victoryFlagMesh && victoryFlagBasePos && victoryFlagMesh.geometry && victoryFlagMesh.geometry.attributes && victoryFlagMesh.geometry.attributes.position) {
    const posAttr = victoryFlagMesh.geometry.attributes.position;
    if (posAttr.array && posAttr.count) {
      for (let i = 0; i < posAttr.count; i++) {
        const bx = victoryFlagBasePos[i * 3];
        const by = victoryFlagBasePos[i * 3 + 1];
        const bz = victoryFlagBasePos[i * 3 + 2];
        const anchorFactor = Math.max(0, (bx + 0.16) / 0.32);
        const ripple = Math.sin(nowSec * 4.2 - bx * 14 + by * 4) * 0.024 * anchorFactor;
        posAttr.array[i * 3 + 2] = bz + ripple;
      }
      posAttr.needsUpdate = true;
    }
  }

  renderer.render(scene, camera);
  if (selectedPlanet) updatePinsScreenPosition();
  updateVictoryOverlayScreenPosition();
}

// Paylaşılan Ay-Yıldızlı Türk Bayrağı ve Parlak Yıldız Çizim Yardımcıları
function drawFivePointStar(ctx, cx, cy, outerR, innerR, rotOffset = -Math.PI / 2) {
  if (!ctx || typeof ctx.beginPath !== 'function') return;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = rotOffset + (i * Math.PI) / 5;
    const px = cx + Math.cos(angle) * r;
    const py = cy + Math.sin(angle) * r;
    if (i === 0 && typeof ctx.moveTo === 'function') ctx.moveTo(px, py);
    else if (typeof ctx.lineTo === 'function') ctx.lineTo(px, py);
  }
  if (typeof ctx.closePath === 'function') ctx.closePath();
  ctx.fill();
}

function drawTurkishFlagGraphic(ctx, x, y, w, h) {
  ctx.fillStyle = '#E30A17';
  ctx.fillRect(x, y, w, h);

  // Hilal: beyaz dış daire ve hafif sağa kaydırılmış al iç daire
  const cx = x + w * 0.36;
  const cy = y + h * 0.5;
  const outerR = h * 0.25;
  const innerR = h * 0.2;

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#E30A17';
  ctx.beginPath();
  ctx.arc(cx + h * 0.062, cy, innerR, 0, Math.PI * 2);
  ctx.fill();

  // 5 köşeli beyaz yıldız
  ctx.fillStyle = '#ffffff';
  drawFivePointStar(ctx, cx + h * 0.24, cy, h * 0.118, h * 0.046, Math.PI);
}

function createTurkishFlagTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 340;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    drawTurkishFlagGraphic(ctx, 0, 0, canvas.width, canvas.height);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

function createMiniPlaqueTexture(explorerName) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#060d1f';
    ctx.fillRect(0, 0, 512, 256);
    if (typeof ctx.strokeRect === 'function') {
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 10;
      ctx.strokeRect(8, 8, 496, 240);

      ctx.strokeStyle = 'rgba(253, 224, 71, 0.55)';
      ctx.lineWidth = 3;
      ctx.strokeRect(18, 18, 476, 220);
    }
    if (typeof ctx.fillText === 'function') {
      ctx.textAlign = 'center';
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 22px "Segoe UI", Inter, Arial, sans-serif';
      ctx.fillText('UZAY KAŞİFİ PLAKETİ', 256, 54);

      const cleanLabel = String(explorerName || 'Genç Uzay Kaşifi').trim().slice(0, 24) || 'Genç Uzay Kaşifi';
      const len = cleanLabel.length;
      const fontSize = len <= 12 ? 56 : len <= 16 ? 46 : len <= 20 ? 38 : 32;
      ctx.font = `900 ${fontSize}px "Segoe UI", Inter, Arial, sans-serif`;
      if (typeof ctx.strokeText === 'function') {
        ctx.strokeStyle = '#020617';
        ctx.lineWidth = 6;
        ctx.lineJoin = 'round';
        ctx.strokeText(cleanLabel, 256, 144);
      }
      ctx.fillStyle = '#fef08a';
      ctx.fillText(cleanLabel, 256, 144);

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 20px "Segoe UI", Inter, Arial, sans-serif';
      ctx.fillText('★ 9 / 9 SESSİZ ANIT ★', 256, 214);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearMipmapLinearFilter || THREE.LinearFilter;
  tex.generateMipmaps = true;
  if (renderer && renderer.capabilities && typeof renderer.capabilities.getMaxAnisotropy === 'function') {
    tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  }
  tex.needsUpdate = true;
  return tex;
}

function createVictoryAstronaut3D(stripeHex = 0xdc2626) {
  const astro = new THREE.Group();
  astro.name = 'victoryAstronaut';

  const suitMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.45, metalness: 0.06 });
  const hardSuitMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.28, metalness: 0.12 });
  const ribMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.72, metalness: 0.15 });
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.28, metalness: 0.82 });
  const stripeMat = new THREE.MeshStandardMaterial({ color: stripeHex, roughness: 0.35, metalness: 0.15 });
  const packMat = new THREE.MeshStandardMaterial({ color: 0xdbe4ee, roughness: 0.42, metalness: 0.22 });
  const darkAccentMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.25, metalness: 0.4 });
  const cyanMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.5,
    roughness: 0.2,
    metalness: 0.3
  });
  const goldVisorMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    emissive: 0xb45309,
    emissiveIntensity: 0.22,
    metalness: 0.94,
    roughness: 0.08
  });
  const goldAccentMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.22, metalness: 0.85 });

  // 1. Eklemli koşu bacakları (kalça pivotu y = 0.145)
  function buildLegAssembly(lx) {
    const legGroup = new THREE.Group();
    legGroup.position.set(lx, 0.145, 0);

    const sole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.027, 0.012, 14), ribMat);
    sole.scale.set(1.0, 1.0, 1.38);
    sole.position.set(0, -0.139, 0.008);
    legGroup.add(sole);

    const bootUpper = new THREE.Mesh(new THREE.SphereGeometry(0.026, 14, 12), hardSuitMat);
    bootUpper.scale.set(0.95, 0.78, 1.28);
    bootUpper.position.set(0, -0.126, 0.008);
    legGroup.add(bootUpper);

    const toeCap = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 10), ringMat);
    toeCap.scale.set(0.95, 0.7, 1.0);
    toeCap.position.set(0, -0.129, 0.026);
    legGroup.add(toeCap);

    const ankleRing = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.023, 0.01, 14), ringMat);
    ankleRing.position.set(0, -0.11, 0);
    legGroup.add(ankleRing);

    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.023, 0.02, 0.056, 14), suitMat);
    shin.position.set(0, -0.081, 0);
    legGroup.add(shin);

    const kneeJoint = new THREE.Mesh(new THREE.SphereGeometry(0.023, 14, 12), ribMat);
    kneeJoint.position.set(0, -0.051, 0.002);
    legGroup.add(kneeJoint);

    const kneePad = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.022, 0.014), ringMat);
    kneePad.position.set(0, -0.051, 0.02);
    legGroup.add(kneePad);

    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.027, 0.023, 0.056, 14), suitMat);
    thigh.position.set(0, -0.022, 0);
    legGroup.add(thigh);

    const thighStripe = new THREE.Mesh(new THREE.CylinderGeometry(0.0275, 0.027, 0.011, 14), stripeMat);
    thighStripe.position.set(0, -0.017, 0);
    legGroup.add(thighStripe);

    return legGroup;
  }

  const leftLeg = buildLegAssembly(-0.036);
  const rightLeg = buildLegAssembly(0.036);
  astro.add(leftLeg);
  astro.add(rightLeg);

  // 2. Koşu eğimi verilebilen üst gövde grubu (kalça pivotu y = 0.156)
  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 0.156, 0);

  const pelvis = new THREE.Mesh(new THREE.SphereGeometry(0.06, 18, 14), suitMat);
  pelvis.scale.set(1.02, 0.62, 0.82);
  pelvis.position.set(0, 0, 0);
  torsoGroup.add(pelvis);

  const waistRing = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.014, 20), ringMat);
  waistRing.scale.set(1.04, 1.0, 0.84);
  waistRing.position.set(0, 0.022, 0);
  torsoGroup.add(waistRing);

  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.054, 0.105, 20), hardSuitMat);
  torso.scale.set(1.06, 1.0, 0.82);
  torso.position.set(0, 0.076, 0);
  torsoGroup.add(torso);

  const shoulderDome = new THREE.Mesh(new THREE.SphereGeometry(0.064, 20, 16), hardSuitMat);
  shoulderDome.scale.set(1.08, 0.56, 0.84);
  shoulderDome.position.set(0, 0.124, 0);
  torsoGroup.add(shoulderDome);

  // Göğüs Display & Control Module (DCM)
  const dcmBody = new THREE.Mesh(new THREE.BoxGeometry(0.064, 0.054, 0.026), packMat);
  dcmBody.position.set(0, 0.079, 0.056);
  torsoGroup.add(dcmBody);

  const dcmBezel = new THREE.Mesh(new THREE.BoxGeometry(0.044, 0.02, 0.008), darkAccentMat);
  dcmBezel.position.set(0, 0.09, 0.068);
  torsoGroup.add(dcmBezel);

  const dcmScreen = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.011, 0.006), cyanMat);
  dcmScreen.position.set(0, 0.09, 0.071);
  torsoGroup.add(dcmScreen);

  const redValve = new THREE.Mesh(new THREE.CylinderGeometry(0.0055, 0.0055, 0.01, 10), stripeMat);
  redValve.rotation.x = Math.PI / 2;
  redValve.position.set(-0.018, 0.066, 0.07);
  torsoGroup.add(redValve);

  const blueValve = new THREE.Mesh(new THREE.CylinderGeometry(0.0055, 0.0055, 0.01, 10), cyanMat);
  blueValve.rotation.x = Math.PI / 2;
  blueValve.position.set(0, 0.066, 0.07);
  torsoGroup.add(blueValve);

  const gaugeDial = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.008, 12), goldAccentMat);
  gaugeDial.rotation.x = Math.PI / 2;
  gaugeDial.position.set(0.019, 0.066, 0.07);
  torsoGroup.add(gaugeDial);

  // 3. Detaylı PLSS Yaşam Destek Sırt Çantası, oksijen tüpleri ve UHF anteni
  const plssBody = new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.132, 0.052), packMat);
  plssBody.position.set(0, 0.086, -0.066);
  torsoGroup.add(plssBody);

  const plssHeader = new THREE.Mesh(new THREE.BoxGeometry(0.112, 0.024, 0.058), ringMat);
  plssHeader.position.set(0, 0.156, -0.066);
  torsoGroup.add(plssHeader);

  const plssBattery = new THREE.Mesh(new THREE.BoxGeometry(0.096, 0.026, 0.048), ribMat);
  plssBattery.position.set(0, 0.016, -0.064);
  torsoGroup.add(plssBattery);

  [-0.032, 0.032].forEach((tx) => {
    const oxyTank = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.095, 14), suitMat);
    oxyTank.position.set(tx, 0.084, -0.092);
    torsoGroup.add(oxyTank);

    const capTop = new THREE.Mesh(new THREE.SphereGeometry(0.015, 12, 10), ringMat);
    capTop.position.set(tx, 0.131, -0.092);
    torsoGroup.add(capTop);

    const capBot = new THREE.Mesh(new THREE.SphereGeometry(0.015, 12, 10), ringMat);
    capBot.position.set(tx, 0.037, -0.092);
    torsoGroup.add(capBot);
  });

  const uhfMast = new THREE.Mesh(new THREE.CylinderGeometry(0.0032, 0.0042, 0.075, 10), ringMat);
  uhfMast.position.set(0.038, 0.199, -0.072);
  torsoGroup.add(uhfMast);

  const uhfTip = new THREE.Mesh(new THREE.SphereGeometry(0.006, 10, 10), goldAccentMat);
  uhfTip.position.set(0.038, 0.238, -0.072);
  torsoGroup.add(uhfTip);

  // 4. Dirsekli, bilek halkalı ve eldivenli eklemli 3B koşu kolları
  function buildArmAssembly(side, shoulderRotZ, shoulderRotX, elbowRotZ, elbowRotX) {
    const shoulderGroup = new THREE.Group();
    shoulderGroup.position.set(side * 0.074, 0.116, 0.004);
    shoulderGroup.rotation.z = shoulderRotZ;
    shoulderGroup.rotation.x = shoulderRotX;

    const scyeRing = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.012, 14), ringMat);
    scyeRing.rotation.z = Math.PI / 2;
    scyeRing.position.set(-side * 0.005, 0, 0);
    shoulderGroup.add(scyeRing);

    const deltoid = new THREE.Mesh(new THREE.SphereGeometry(0.022, 14, 12), suitMat);
    shoulderGroup.add(deltoid);

    const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.019, 0.018, 0.054, 14), suitMat);
    upperArm.position.set(0, -0.028, 0);
    shoulderGroup.add(upperArm);

    const armStripe = new THREE.Mesh(new THREE.CylinderGeometry(0.0195, 0.0195, 0.009, 14), stripeMat);
    armStripe.position.set(0, -0.026, 0);
    shoulderGroup.add(armStripe);

    const elbowGroup = new THREE.Group();
    elbowGroup.position.set(0, -0.056, 0);
    elbowGroup.rotation.z = elbowRotZ;
    elbowGroup.rotation.x = elbowRotX;

    const elbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.019, 14, 12), ribMat);
    elbowGroup.add(elbowJoint);

    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.016, 0.05, 14), suitMat);
    forearm.position.set(0, -0.026, 0);
    elbowGroup.add(forearm);

    const wristRing = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.017, 0.009, 14), ringMat);
    wristRing.position.set(0, -0.053, 0);
    elbowGroup.add(wristRing);

    const glovePalm = new THREE.Mesh(new THREE.SphereGeometry(0.017, 12, 10), hardSuitMat);
    glovePalm.scale.set(0.95, 1.15, 0.85);
    glovePalm.position.set(0, -0.068, 0);
    elbowGroup.add(glovePalm);

    const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.0052, 0.0058, 0.018, 10), ribMat);
    thumb.rotation.z = side * 0.48;
    thumb.position.set(side * 0.014, -0.064, 0.006);
    elbowGroup.add(thumb);

    shoulderGroup.add(elbowGroup);
    return shoulderGroup;
  }

  // Koşu duruşu: dirsekler bükülü, omuzlar animasyonda ters fazda sallanır
  const leftArm = buildArmAssembly(-1, -0.14, 0, 0.08, -1.05);
  const rightArm = buildArmAssembly(1, 0.14, 0, -0.08, -1.05);
  torsoGroup.add(leftArm);
  torsoGroup.add(rightArm);

  // 5. NASA LEVA Kask, boyun halkası, güneş siperliği, yan fenerler ve altın vizör
  const helmetGroup = new THREE.Group();
  const neckRing = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.048, 0.014, 20), ringMat);
  neckRing.position.set(0, 0.148, 0.002);
  helmetGroup.add(neckRing);

  const chinCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.046, 0.018, 20), hardSuitMat);
  chinCollar.position.set(0, 0.162, 0.002);
  helmetGroup.add(chinCollar);

  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.068, 24, 20), hardSuitMat);
  helmet.position.set(0, 0.202, 0);
  helmetGroup.add(helmet);

  const visor = new THREE.Mesh(new THREE.SphereGeometry(0.056, 22, 18), goldVisorMat);
  visor.scale.set(1.02, 0.88, 0.72);
  visor.position.set(0, 0.2, 0.03);
  helmetGroup.add(visor);

  const browShield = new THREE.Mesh(new THREE.SphereGeometry(0.069, 20, 14), hardSuitMat);
  browShield.scale.set(1.02, 0.36, 0.96);
  browShield.position.set(0, 0.234, 0.014);
  helmetGroup.add(browShield);

  const helmetCrest = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.022, 0.088), stripeMat);
  helmetCrest.position.set(0, 0.262, -0.004);
  helmetGroup.add(helmetCrest);

  [-0.067, 0.067].forEach((px) => {
    const pod = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.026, 0.036), ringMat);
    pod.position.set(px, 0.204, 0.006);
    helmetGroup.add(pod);

    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.006, 10), cyanMat);
    lamp.rotation.x = Math.PI / 2;
    lamp.position.set(px, 0.208, 0.025);
    helmetGroup.add(lamp);
  });

  torsoGroup.add(helmetGroup);
  astro.add(torsoGroup);
  astro.userData = {
    leftLeg,
    rightLeg,
    leftArm,
    rightArm,
    torsoGroup,
    helmetGroup,
    phaseOffset: 0
  };

  return astro;
}

function escapeVictoryHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const VICTORY_BADGE_META = {
  'apollo-lm': {
    shortName: 'Apollo Eagle',
    icon: '🦅',
    achievementTitle: "Ay'a İlk İnsanlı İniş Kartalı"
  },
  lrv: {
    shortName: 'LRV',
    icon: '🚙',
    achievementTitle: 'Ay Yüzeyinin İlk Elektrikli Kâşifi'
  },
  alsep: {
    shortName: 'ALSEP',
    icon: '📡',
    achievementTitle: 'Ay Depremlerini ve Lazeri Yansıtan İstasyon'
  },
  surveyor: {
    shortName: 'Surveyor',
    icon: '🛰️',
    achievementTitle: "Ay'a Yumuşak İnişin Öncüsü"
  },
  sojourner: {
    shortName: 'Sojourner',
    icon: '🤖',
    achievementTitle: "Mars'ın İlk Tekerlekli Gezgini"
  },
  'spirit-opportunity': {
    shortName: 'Spirit & Opportunity',
    icon: '☀️',
    achievementTitle: '90 Günden 14 Yıla Uzanan Efsane'
  },
  viking: {
    shortName: 'Viking',
    icon: '🌋',
    achievementTitle: "Mars'tan İlk Renkli Yüzey Fotoğrafçısı"
  },
  'phoenix-insight': {
    shortName: 'Phoenix & InSight',
    icon: '❄️',
    achievementTitle: 'Kızıl Gezegenin Buzu ve Deprem Kâşifi'
  },
  ingenuity: {
    shortName: 'Ingenuity',
    icon: '🚁',
    achievementTitle: 'Başka Bir Gezegende Uçan İlk Helikopter'
  }
};

function generateExplorerSerialNumber(name) {
  const clean = String(name || 'UZAY KAŞİFİ').trim().toLocaleUpperCase('tr-TR');
  let hash = 2026;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash * 31 + clean.charCodeAt(i)) % 9000;
  }
  const code = String(1000 + ((Math.abs(hash) + 271) % 9000)).padStart(4, '0');
  return `#TR-2026-${code}`;
}

function syncVictoryMonumentTransform(activeMesh, radius) {
  if (!victoryMonumentGroup || !activeMesh) return;
  const rx = activeMesh.rotation ? activeMesh.rotation.x : 0;
  const ry = activeMesh.rotation ? activeMesh.rotation.y : 0;
  const rz = activeMesh.rotation ? activeMesh.rotation.z : 0;

  const x1 = radius * Math.sin(rx) * Math.sin(ry);
  const y1 = radius * Math.cos(rx);
  const z1 = -radius * Math.sin(rx) * Math.cos(ry);

  const cosZ = Math.cos(rz);
  const sinZ = Math.sin(rz);
  const x = x1 * cosZ + y1 * sinZ;
  const y = -x1 * sinZ + y1 * cosZ;
  const z = z1;

  if (victoryMonumentGroup.position && typeof victoryMonumentGroup.position.set === 'function') {
    victoryMonumentGroup.position.set(x, y, z);
  }
  if (victoryMonumentGroup.rotation) {
    victoryMonumentGroup.rotation.order = 'ZYX';
    if (typeof victoryMonumentGroup.rotation.set === 'function') {
      victoryMonumentGroup.rotation.set(-rx, -ry, -rz);
    } else {
      victoryMonumentGroup.rotation.x = -rx;
      victoryMonumentGroup.rotation.y = -ry;
      victoryMonumentGroup.rotation.z = -rz;
    }
  }
}

function projectVictorySurfaceRim(center, radius, offsetX) {
  const sectionRadius = Math.sqrt(radius * radius - offsetX * offsetX);
  const height = center.y - camera.position.y;
  const depth = camera.position.z - center.z;
  const rimAngle = Math.atan2(height, depth) + Math.asin(sectionRadius / Math.hypot(height, depth));
  const projectedRim = new THREE.Vector3(
    center.x + offsetX,
    center.y + sectionRadius * Math.cos(rimAngle),
    center.z + sectionRadius * Math.sin(rimAngle)
  ).project(camera);
  return {
    x: (projectedRim.x * 0.5 + 0.5) * window.innerWidth,
    y: (0.5 - projectedRim.y * 0.5) * window.innerHeight
  };
}

function updateVictoryOverlayScreenPosition() {
  if (!victoryOverlayEl || !victoryPlanetId) return;
  const activeMesh = victoryPlanetId === 'moon' ? moonMesh : marsMesh;
  const radius = (victoryPlanetId === 'moon' ? 1.15 : 1.3) * activeMesh.scale.y;
  const progress = victoryTotalRotation / VICTORY_TARGET_ROTATION;
  const runnerX = radius * (0.28 - 0.56 * progress);
  const runnerRim = projectVictorySurfaceRim(activeMesh.position, radius, runnerX);
  const style = victoryOverlayEl.style;
  style.left = `${Math.round(runnerRim.x)}px`;
  style.top = `${Math.round(runnerRim.y)}px`;

  if (victoryRunState === 'planting' || victoryRunState === 'posed') {
    const flagRim = projectVictorySurfaceRim(activeMesh.position, radius, runnerX - radius * 0.26);
    style.setProperty('--victory-flag-surface-x', `${Math.round(flagRim.x - runnerRim.x)}px`);
    style.setProperty('--victory-flag-surface-y', `${Math.round(flagRim.y - runnerRim.y)}px`);
  }
}

function spawnVictoryGoldFootprintParticle() {
  const layer = document.getElementById('victory-footprints-layer');
  if (!layer) return;
  const fp = document.createElement('span');
  fp.className = 'victory-gold-footprint';
  fp.style.bottom = `${victoryStepCount % 2 === 0 ? 4 : 1}px`;
  layer.appendChild(fp);
  if (layer.children.length > 14 && layer.children[0]) {
    if (typeof layer.removeChild === 'function') {
      layer.removeChild(layer.children[0]);
    } else if (typeof layer.children[0].remove === 'function') {
      layer.children[0].remove();
    }
  }
}

function spawnVictoryPlantDustBurst() {
  const dustLayer = document.getElementById('victory-dust-layer');
  if (!dustLayer) return;
  dustLayer.innerHTML = '';
  const offsets = [
    [-46, -18],
    [-34, -30],
    [-22, -14],
    [-14, -36],
    [14, -34],
    [22, -15],
    [34, -28],
    [46, -18],
    [-38, -6],
    [38, -6],
    [-20, -24],
    [20, -24]
  ];
  offsets.forEach(([dx, dy]) => {
    const p = document.createElement('span');
    p.className = 'victory-dust-particle';
    if (p.style && typeof p.style.setProperty === 'function') {
      p.style.setProperty('--dx', `${dx}px`);
      p.style.setProperty('--dy', `${dy}px`);
    } else if (p.style) {
      p.style.transform = `translate(${dx}px, ${dy}px)`;
    }
    dustLayer.appendChild(p);
  });
}

function completeVictoryRunAndPlantFlag() {
  if (victoryRunState !== 'running') return;
  victoryRunState = 'planting';
  victoryPlantSeconds = 0;

  const runnerEl = document.getElementById('victory-astro-runner');
  if (runnerEl) {
    runnerEl.classList.remove('running', 'walking', 'victory-pose');
    runnerEl.classList.add('planting-flag');
  }

  const flagWrap = document.getElementById('victory-flag-wrap');
  if (flagWrap) {
    flagWrap.classList.remove('carried');
    flagWrap.classList.add('planted');
  }

  spawnVictoryPlantDustBurst();
  playLiftFanfare();
  playCosmicVictoryFanfare();
}

function enterVictoryPose() {
  if (victoryRunState !== 'planting') return;
  victoryRunState = 'posed';

  const runnerEl = document.getElementById('victory-astro-runner');
  if (runnerEl) {
    runnerEl.classList.remove('running', 'walking', 'planting-flag');
    runnerEl.classList.add('victory-pose');
  }
}

function spawnVictoryRunnerOverlay(planetId = 'moon') {
  if (!pinsContainer) return;
  if (victoryWalkTimer) {
    clearInterval(victoryWalkTimer);
    victoryWalkTimer = null;
  }
  if (victoryOverlayEl) {
    if (typeof victoryOverlayEl.remove === 'function') {
      victoryOverlayEl.remove();
    } else if (victoryOverlayEl.parentNode && typeof victoryOverlayEl.parentNode.removeChild === 'function') {
      victoryOverlayEl.parentNode.removeChild(victoryOverlayEl);
    }
    victoryOverlayEl = null;
  }
  if (victorySwitchEl) {
    if (typeof victorySwitchEl.remove === 'function') {
      victorySwitchEl.remove();
    } else if (victorySwitchEl.parentNode && typeof victorySwitchEl.parentNode.removeChild === 'function') {
      victorySwitchEl.parentNode.removeChild(victorySwitchEl);
    }
    victorySwitchEl = null;
  }

  // Kuzey kutbu üzerinde tek çizgi film astronot + elde taşınan ve sonunda saplanan Türk Bayrağı sahnesi (Sadece Ay)
  const overlay = document.createElement('div');
  overlay.id = 'victory-scene-overlay';
  overlay.className = 'victory-scene-overlay';
  if (overlay.dataset) overlay.dataset.planet = 'moon';

  const stage = document.createElement('div');
  stage.id = 'victory-pole-stage';
  stage.className = 'victory-pole-stage';

  const footprintsLayer = document.createElement('div');
  footprintsLayer.id = 'victory-footprints-layer';
  footprintsLayer.className = 'victory-footprints-layer';

  const dustLayer = document.createElement('div');
  dustLayer.id = 'victory-dust-layer';
  dustLayer.className = 'victory-dust-layer';

  const flagWrap = document.createElement('div');
  flagWrap.id = 'victory-flag-wrap';
  flagWrap.className = 'victory-flag-wrap carried';
  flagWrap.innerHTML = `
    <div class="flag-soil-ring"></div>
    <div class="flag-soil-mound" aria-hidden="true"></div>
    <div class="victory-flag-pole">
      <span class="victory-pole-finial"></span>
      <span class="victory-pole-crossbar"></span>
      <span class="flag-hand-grip" aria-hidden="true"></span>
    </div>
    <svg class="victory-flag-svg" viewBox="0 0 220 148" xmlns="http://www.w3.org/2000/svg" aria-label="Türk Bayrağı">
      <defs>
        <linearGradient id="tr-flag-cloth" x1="0%" y1="0%" x2="100%" y2="8%">
          <stop offset="0%" stop-color="#991b1b"/>
          <stop offset="16%" stop-color="#e30a17"/>
          <stop offset="44%" stop-color="#ef2330"/>
          <stop offset="68%" stop-color="#b91c1c"/>
          <stop offset="86%" stop-color="#e30a17"/>
          <stop offset="100%" stop-color="#dc2626"/>
        </linearGradient>
        <linearGradient id="tr-flag-folds" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.22"/>
          <stop offset="22%" stop-color="#ffffff" stop-opacity="0.1"/>
          <stop offset="48%" stop-color="#000000" stop-opacity="0.14"/>
          <stop offset="74%" stop-color="#ffffff" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.08"/>
        </linearGradient>
        <clipPath id="tr-flag-wave-clip">
          <path d="M 4,14 C 58,4 112,24 166,12 C 190,8 206,12 214,15 L 214,133 C 164,126 112,144 58,130 C 30,124 14,130 4,132 Z"/>
        </clipPath>
      </defs>
      <g clip-path="url(#tr-flag-wave-clip)">
        <rect x="0" y="0" width="220" height="148" fill="url(#tr-flag-cloth)"/>
        <circle cx="80" cy="74" r="33" fill="#ffffff"/>
        <circle cx="88.5" cy="74" r="26.5" fill="url(#tr-flag-cloth)"/>
        <polygon fill="#ffffff" points="103,74 115.5,70 115.5,56.8 123.2,67.5 135.8,63.4 128,74 135.8,84.6 123.2,80.5 115.5,91.2 115.5,78"/>
        <rect x="0" y="0" width="220" height="148" fill="url(#tr-flag-folds)"/>
      </g>
      <path d="M 4,14 C 58,4 112,24 166,12 C 190,8 206,12 214,15 L 214,133 C 164,126 112,144 58,130 C 30,124 14,130 4,132 Z" fill="none" stroke="rgba(255, 255, 255, 0.24)" stroke-width="1.5"/>
    </svg>
  `;

  const runnerAstro = document.createElement('div');
  runnerAstro.id = 'victory-astro-runner';
  runnerAstro.className = 'victory-astro victory-astro-planter running walking';
  if (runnerAstro.dataset) runnerAstro.dataset.facing = 'left';
  if (typeof runnerAstro.setAttribute === 'function') runnerAstro.setAttribute('data-facing', 'left');
  runnerAstro.innerHTML = getVictoryRunnerAstronautSvgMarkup();

  stage.appendChild(footprintsLayer);
  stage.appendChild(dustLayer);
  stage.appendChild(flagWrap);
  stage.appendChild(runnerAstro);
  overlay.appendChild(stage);
  pinsContainer.appendChild(overlay);

  victoryOverlayEl = overlay;
  updateVictoryOverlayScreenPosition();
}

function buildVictoryMonumentOnPlanet(planetId, explorerName) {
  removeVictoryMonument(true);

  const activeMesh = planetId === 'moon' ? moonMesh : marsMesh;
  const radius = planetId === 'moon' ? 1.15 : 1.3;

  if (activeMesh && activeMesh.rotation) {
    activeMesh.rotation.x = 0;
    activeMesh.rotation.z = 0;
  }

  victoryPlanetId = planetId;
  victoryModeActive = true;
  victoryRunState = 'running';
  victoryTotalRotation = 0;
  victoryStepCount = 0;
  victoryPlantSeconds = 0;

  victoryMonumentGroup = new THREE.Group();
  victoryMonumentGroup.name = 'victoryMonumentGroup';
  victoryMonumentGroup.visible = true;

  // Tek astronot sahne hiyerarşisi (3B ağ gizli; kuzey kutbunda 2B çizgi film astronot sergilenir)
  const astro1 = createVictoryAstronaut3D(0xdc2626);
  astro1.name = 'victoryAstronaut';
  astro1.position.set(0, 0, 0);
  astro1.visible = false;
  victoryMonumentGroup.add(astro1);

  const poleMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.78, roughness: 0.25 });
  const poleMast = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.013, 0.52, 12), poleMat);
  poleMast.name = 'turkishFlagPole';
  poleMast.position.set(-0.08, 0.26, 0);
  poleMast.visible = false;
  victoryMonumentGroup.add(poleMast);

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xfde047,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.45,
    metalness: 0.85,
    roughness: 0.18
  });

  const flagTex = createTurkishFlagTexture();
  const flagGeo = new THREE.PlaneGeometry(0.34, 0.22, 18, 8);
  const flagMat = new THREE.MeshStandardMaterial({
    map: flagTex,
    side: THREE.DoubleSide,
    roughness: 0.42,
    metalness: 0.05
  });
  victoryFlagMesh = new THREE.Mesh(flagGeo, flagMat);
  victoryFlagMesh.name = 'turkishFlagMesh';
  victoryFlagMesh.position.set(0.08, 0.41, 0);
  victoryFlagMesh.visible = false;
  if (flagGeo && flagGeo.attributes && flagGeo.attributes.position && flagGeo.attributes.position.array) {
    victoryFlagBasePos = new Float32Array(flagGeo.attributes.position.array);
  }
  victoryMonumentGroup.add(victoryFlagMesh);

  const plaqueTex = createMiniPlaqueTexture(explorerName);
  const plaqueMat = plaqueTex
    ? new THREE.MeshStandardMaterial({ map: plaqueTex, metalness: 0.35, roughness: 0.32 })
    : goldMat;
  const plaqueFrame = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.18, 0.022), plaqueMat);
  plaqueFrame.name = 'certificatePlaque3D';
  plaqueFrame.position.set(0, 0.44, -0.08);
  plaqueFrame.visible = false;
  victoryMonumentGroup.add(plaqueFrame);

  // Altın ayak izi parçacıkları (koşucunun arkasında saat yönünde +X yayına uzanır)
  const footprintGroup = new THREE.Group();
  footprintGroup.name = 'goldenFootprintTrail';
  victoryFootprintParticles = [];
  for (let i = 0; i < 8; i++) {
    const stepZ = i % 2 === 0 ? -0.03 : 0.03;
    const fpMat = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.95,
      transparent: true,
      opacity: 0.9,
      roughness: 0.25,
      metalness: 0.5
    });
    const fp = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 8), fpMat);
    fp.scale.set(1.3, 0.4, 0.85);
    fp.userData = {
      sideZ: stepZ,
      phase: i / 8
    };
    footprintGroup.add(fp);
    victoryFootprintParticles.push(fp);
  }
  victoryMonumentGroup.add(footprintGroup);

  syncVictoryMonumentTransform(activeMesh, radius);
  activeMesh.add(victoryMonumentGroup);

  window.victoryMonumentGroup = victoryMonumentGroup;

  spawnVictoryRunnerOverlay(planetId);
  playSpaceFootstep(0);
  spawnVictoryGoldFootprintParticle();
}

function renderExplorerCertificateCanvas(explorerName, serialNo) {
  const canvas = document.getElementById('certificate-canvas');
  if (!canvas || typeof canvas.getContext !== 'function') return null;
  canvas.width = 1000;
  canvas.height = 700;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const w = 1000;
  const h = 700;
  const activeSerial = serialNo || generateExplorerSerialNumber(explorerName);

  // Koyu lacivert-uzay gradyanı arka plan
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#04081a');
  bg.addColorStop(0.5, '#0b1838');
  bg.addColorStop(1, '#071026');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Üst orta hafif nebula parıltısı
  const glow = ctx.createRadialGradient(500, 260, 20, 500, 260, 420);
  glow.addColorStop(0, 'rgba(56, 189, 248, 0.16)');
  glow.addColorStop(0.55, 'rgba(250, 204, 21, 0.07)');
  glow.addColorStop(1, 'rgba(4, 8, 26, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // Uzay yıldızları
  for (let s = 0; s < 130; s++) {
    const sx = (s * 137 + 41) % w;
    const sy = (s * 89 + 29) % h;
    const sr = s % 5 === 0 ? 2 : 1.1;
    ctx.fillStyle = s % 4 === 0 ? 'rgba(253, 224, 71, 0.65)' : 'rgba(226, 232, 240, 0.55)';
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Altın çift çerçeve
  if (typeof ctx.strokeRect === 'function') {
    const frameGrad = ctx.createLinearGradient(0, 0, w, h);
    frameGrad.addColorStop(0, '#fbbf24');
    frameGrad.addColorStop(0.5, '#fef08a');
    frameGrad.addColorStop(1, '#d97706');
    ctx.strokeStyle = frameGrad;
    ctx.lineWidth = 6;
    ctx.strokeRect(24, 24, w - 48, h - 48);

    ctx.strokeStyle = 'rgba(253, 224, 71, 0.45)';
    ctx.lineWidth = 2;
    ctx.strokeRect(38, 38, w - 76, h - 76);
  }

  // Köşe altın yıldızları
  ctx.fillStyle = '#fde047';
  [
    [58, 58],
    [w - 58, 58],
    [58, h - 58],
    [w - 58, h - 58]
  ].forEach(([cx, cy]) => {
    drawFivePointStar(ctx, cx, cy, 15, 6);
  });

  if (typeof ctx.fillText === 'function') {
    ctx.textAlign = 'center';

    // Üst başlık
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.fillText(`KAŞİF SERİ NO: ${activeSerial}  •  T.C. & NASA SPACE APPS CHALLENGE`, 500, 86);

    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 23px Georgia, serif';
    ctx.fillText('NASA SPACE APPS 2026 — SESSİZ ANITLAR UZAY KAŞİFİ BAŞARI BELGESİ', 500, 128);

    // Dekoratif ayırıcı çizgi
    ctx.fillStyle = 'rgba(250, 204, 21, 0.45)';
    ctx.fillRect(190, 148, 620, 2);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 16px Inter, sans-serif';
    ctx.fillText('BU BAŞARI BELGESİ ÜSTÜN KEŞİF GÖREVİYLE', 500, 188);

    // Büyük altın harflerle Ad Soyad
    const cleanName = String(explorerName || 'Genç Uzay Kaşifi').trim() || 'Genç Uzay Kaşifi';
    const upperName = cleanName.toLocaleUpperCase('tr-TR');
    ctx.save();
    ctx.fillStyle = '#fde047';
    ctx.shadowColor = 'rgba(250, 204, 21, 0.55)';
    ctx.shadowBlur = 18;
    ctx.font = 'bold 54px Georgia, serif';
    ctx.fillText(upperName, 500, 254);
    ctx.restore();

    ctx.fillStyle = 'rgba(56, 189, 248, 0.65)';
    ctx.fillRect(260, 276, 480, 2);

    // Başarı metni
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '500 19px Inter, sans-serif';
    ctx.fillText(
      'Ay ve Mars yüzeyindeki tüm terk edilmiş NASA keşif araçlarının hikâyelerini',
      500,
      318
    );
    ctx.fillText('çözerek Uzay Kaşifi unvanını kazanmıştır.', 500, 348);

    // 9 Kurtarılan Aracın Rozet İkonları
    const badges = [
      { label: 'Apollo Eagle', icon: '🦅' },
      { label: 'LRV', icon: '🚙' },
      { label: 'ALSEP', icon: '📡' },
      { label: 'Surveyor', icon: '🛰️' },
      { label: 'Sojourner', icon: '🤖' },
      { label: 'Spirit & Opportunity', icon: '☀️' },
      { label: 'Viking', icon: '🌋' },
      { label: 'Phoenix & InSight', icon: '❄️' },
      { label: 'Ingenuity', icon: '🚁' }
    ];

    const topRow = badges.slice(0, 5);
    const botRow = badges.slice(5);
    const drawBadgeRow = (items, y) => {
      const boxW = 164;
      const gap = 14;
      const totalW = items.length * boxW + (items.length - 1) * gap;
      const startX = (w - totalW) / 2;
      items.forEach((item, idx) => {
        const bx = startX + idx * (boxW + gap);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.fillRect(bx, y, boxW, 42);
        if (typeof ctx.strokeRect === 'function') {
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(bx, y, boxW, 42);
        }
        ctx.fillStyle = '#e0f2fe';
        ctx.font = 'bold 12.5px Inter, sans-serif';
        ctx.fillText(`${item.icon} ${item.label}`, bx + boxW / 2, y + 25);
      });
    };

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillText('KURTARILAN VE KEŞFEDİLEN 9 SESSİZ ANIT', 500, 390);

    drawBadgeRow(topRow, 410);
    drawBadgeRow(botRow, 466);

    // Sol alt görev doğrulama ve seri numarası bilgisi
    ctx.textAlign = 'left';
    ctx.fillStyle = '#86efac';
    ctx.font = 'bold 17px Inter, sans-serif';
    ctx.fillText('✅ GÖREV TAMAMLANDI • 9 / 9 ANIT', 72, 582);
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillText(`SERİ NO: ${activeSerial}`, 72, 608);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 13px Inter, sans-serif';
    ctx.fillText('Sessiz Anıtlar Dijital Uzay Kaşifleri Programı', 72, 632);

    // Sağ alt Türk Bayrağı mührü ve tarih
    const sealX = 810;
    const sealY = 556;
    drawTurkishFlagGraphic(ctx, sealX, sealY, 108, 72);
    if (typeof ctx.strokeRect === 'function') {
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 3;
      ctx.strokeRect(sealX, sealY, 108, 72);
    }

    const todayStr = new Date().toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.fillText(todayStr, 790, 590);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '500 13px Inter, sans-serif';
    ctx.fillText('TÜRKİYE • ONUR MÜHRÜ', 790, 616);
  }

  return canvas;
}

function buildVictoryMiniCollectionHtml() {
  const allEntries = [];
  ['moon', 'mars'].forEach((pId) => {
    const planetData = SPACE_DATA[pId];
    const items = planetData && Array.isArray(planetData.equipment) ? planetData.equipment : [];
    const planetTag = pId === 'moon' ? 'Ay' : 'Mars';
    items.forEach((eq) => {
      const meta = VICTORY_BADGE_META[eq.id] || {
        shortName: eq.name,
        icon: '🚀',
        achievementTitle: eq.shortDesc || 'Uzay Keşif Anıtı'
      };
      allEntries.push(`
        <div class="victory-mini-badge-card" data-vehicle-id="${eq.id}" tabindex="0" title="${escapeVictoryHtml(meta.achievementTitle)}">
          <div class="victory-badge-head">
            <span class="victory-badge-icon">${meta.icon}</span>
            <span class="victory-badge-planet">${planetTag}</span>
          </div>
          <div class="victory-badge-name">${escapeVictoryHtml(meta.shortName)}</div>
          <div class="victory-badge-title">${escapeVictoryHtml(meta.achievementTitle)}</div>
        </div>
      `);
    });
  });
  return allEntries.join('');
}

function focusVictoryPlanetTargets(planetId) {
  if (planetId === 'moon') {
    targets.moon.pos.set(-1.85, -0.78, 0.45);
    targets.moon.scale = 1.08;
    targets.mars.pos.set(14, 0, -6);
    targets.mars.scale = 0.5;
  } else {
    targets.mars.pos.set(-1.85, -0.78, 0.45);
    targets.mars.scale = 0.96;
    targets.moon.pos.set(-14, 0, -6);
    targets.moon.scale = 0.5;
  }
}

function plantFlagAndCreateCertificate(rawName) {
  stopStoryAudio();
  const explorerName = String(rawName || '').trim() || 'Genç Uzay Kaşifi';
  const serialNo = generateExplorerSerialNumber(explorerName);
  currentVictoryExplorerName = explorerName;
  currentVictorySerial = serialNo;

  if (celebrationModal) {
    celebrationModal.classList.add('hidden');
  }

  const activePlanetId = selectedPlanet || 'mars';
  selectedPlanet = activePlanetId;
  rotationPausedUntil = Infinity;
  focusRotationTarget = null;
  resetAstronaut();
  hideNostalgiaCard();
  syncTimelineUI(-1);

  if (introHint) introHint.classList.add('hidden');
  if (resetBtn) resetBtn.classList.remove('hidden');
  if (cosmicTimeline) cosmicTimeline.classList.add('victory-hidden');
  if (infoPanel) {
    infoPanel.classList.add('open');
    infoPanel.classList.add('victory-mode');
  }

  // Pin kalabalığını temizle ve gezegeni sol yarıya tepe alanı boş kalacak şekilde yerleştir
  if (pinsContainer) pinsContainer.innerHTML = '';
  activePinMarkers = [];
  focusVictoryPlanetTargets(activePlanetId);

  buildVictoryMonumentOnPlanet(activePlanetId, explorerName);

  const planetName = SPACE_DATA[activePlanetId] ? SPACE_DATA[activePlanetId].name : 'Gezegen';
  const safeExplorer = escapeVictoryHtml(explorerName);
  const albumBadgesHtml = buildVictoryMiniCollectionHtml();

  if (panelContent) {
    panelContent.innerHTML = `
      <div class="victory-panel-top-bar">
        <button id="victory-back-planet-btn" class="back-to-planet-btn" onclick="selectPlanet('${activePlanetId}')">← ${planetName} Anıtlarına Dön</button>
        <button id="reset-explorer-btn" class="reset-explorer-btn" type="button">↻ Yeni Kaşif İçin Sıfırla</button>
      </div>
      <div class="victory-banner">
        <h3>🇹🇷 Tebrikler ${safeExplorer}! Görev Tamamlandı!</h3>
        <p id="victory-banner-planet-msg">Astronotumuz ${activePlanetId === 'moon' ? "Ay'ın" : "Mars'ın"} tepesinde Türk Bayrağı ile koşuyor. Tüm anıtlar keşfedildi.</p>
      </div>
      <section class="victory-cert-section" aria-label="Başarı Belgesi">
        <div class="victory-section-heading">
          <span>🏅 BAŞARI BELGESİ</span>
          <span id="victory-serial-badge" class="victory-serial-badge">${serialNo}</span>
        </div>
        <div class="certificate-box">
          <canvas id="certificate-canvas" class="certificate-canvas" width="1000" height="700"></canvas>
          <button id="download-certificate-btn" class="download-certificate-btn" type="button">
            ⬇️ Sertifikayı İndir (PNG)
          </button>
        </div>
      </section>
      <section id="victory-collection-album" class="victory-collection-album" aria-label="Tamamlanan Koleksiyon Albümü">
        <div class="victory-section-heading">
          <span>🃏 TAMAMLANAN 9/9 KOLEKSİYON ALBÜMÜ</span>
          <span class="victory-album-count">9 / 9 Efsanevi Rozet</span>
        </div>
        <div class="victory-album-grid">
          ${albumBadgesHtml}
        </div>
      </section>
    `;
  }
  if (infoPanel) infoPanel.scrollTop = 0;

  const resetExplorerBtn = document.getElementById('reset-explorer-btn');
  if (resetExplorerBtn && typeof resetExplorerBtn.addEventListener === 'function') {
    resetExplorerBtn.addEventListener('click', resetForNewExplorer);
  }

  const certCanvas = renderExplorerCertificateCanvas(explorerName, serialNo);
  const downloadBtn = document.getElementById('download-certificate-btn');
  if (downloadBtn && certCanvas) {
    downloadBtn.addEventListener('click', () => {
      const pngDataUrl = certCanvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngDataUrl;
      a.download = 'uzay-kasifi-sertifikasi.png';
      document.body.appendChild(a);
      if (typeof a.click === 'function') a.click();
      if (typeof a.remove === 'function') a.remove();
    });
  }

  playCosmicVictoryFanfare();
}

function switchVictoryPlanet(targetPlanetId) {
  playUiClickSound();
  const nextPlanetId =
    targetPlanetId === 'moon' || targetPlanetId === 'mars'
      ? targetPlanetId
      : victoryPlanetId === 'moon'
      ? 'mars'
      : 'moon';

  selectedPlanet = nextPlanetId;
  focusRotationTarget = null;
  focusVictoryPlanetTargets(nextPlanetId);
  buildVictoryMonumentOnPlanet(nextPlanetId, currentVictoryExplorerName);

  const backBtn = document.getElementById('victory-back-planet-btn');
  const planetName = SPACE_DATA[nextPlanetId] ? SPACE_DATA[nextPlanetId].name : 'Gezegen';
  if (backBtn) {
    backBtn.textContent = `← ${planetName} Anıtlarına Dön`;
    if (typeof backBtn.setAttribute === 'function') {
      backBtn.setAttribute('onclick', `selectPlanet('${nextPlanetId}')`);
    }
  }
  const msgEl = document.getElementById('victory-banner-planet-msg');
  if (msgEl) {
    msgEl.textContent = `Astronotumuz ${nextPlanetId === 'moon' ? "Ay'ın" : "Mars'ın"} tepesinde Türk Bayrağı ile koşuyor. Tüm anıtlar keşfedildi.`;
  }
}

function resetForNewExplorer() {
  playUiClickSound();
  stopStoryAudio();
  removeVictoryMonument();
  resetAstronaut();
  hideNostalgiaCard();
  syncTimelineUI(-1);

  discoveredEquipment.clear();
  repairedVehicles.clear();
  unlockedCards.clear();
  Object.keys(cardLockProgress).forEach((key) => delete cardLockProgress[key]);
  celebrationTriggered = false;
  selectedPlanet = null;
  victoryPlanetId = null;
  currentVictoryExplorerName = 'Genç Uzay Kaşifi';
  currentVictorySerial = '';
  rotationPausedUntil = 0;
  focusRotationTarget = null;

  if (explorerNameInput) explorerNameInput.value = '';
  if (celebrationModal) celebrationModal.classList.add('hidden');
  if (cosmicTimeline) cosmicTimeline.classList.remove('victory-hidden');
  if (infoPanel) infoPanel.classList.remove('open', 'victory-mode');
  if (panelContent) panelContent.innerHTML = '';
  if (resetBtn) resetBtn.classList.add('hidden');
  if (introHint) introHint.classList.remove('hidden');
  if (pinsContainer) pinsContainer.innerHTML = '';
  activePinMarkers = [];

  targets.moon.pos.set(-1.9, 0, 0);
  targets.moon.scale = 1;
  targets.mars.pos.set(1.9, 0, 0);
  targets.mars.scale = 1;

  updateRepairProgressUI();
}

window.plantFlagAndCreateCertificate = plantFlagAndCreateCertificate;
window.switchVictoryPlanet = switchVictoryPlanet;
window.resetForNewExplorer = resetForNewExplorer;

if (quickDemoBtn) {
  quickDemoBtn.addEventListener('click', triggerQuickDemoCompletion);
}
if (closeCelebrationBtn && celebrationModal) {
  closeCelebrationBtn.addEventListener('click', () => {
    celebrationModal.classList.add('hidden');
  });
}
if (celebrationForm) {
  celebrationForm.addEventListener('submit', (e) => {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    const entered = explorerNameInput ? explorerNameInput.value : '';
    plantFlagAndCreateCertificate(entered);
  });
}

// Kozmik Zaman Çubuğu ve Nostaljik Gazete Manşetleri Senkronizasyonu
function getTimelineEventsList() {
  return typeof TIMELINE_EVENTS !== 'undefined' && Array.isArray(TIMELINE_EVENTS) ? TIMELINE_EVENTS : [];
}

function getEraBadgeLabel(gazeteTipi) {
  if (gazeteTipi === 'retro-60s' || gazeteTipi === 'retro-70s') {
    return 'UZAY GAZETESİ - ÖZEL BASKI';
  }
  if (gazeteTipi === 'digital-90s') {
    return 'WWW.UZAY-HABER.NET // PORTAL';
  }
  if (gazeteTipi === 'digital-2000s') {
    return 'DİJİTAL UZAY PORTALI // 2004';
  }
  return 'HOLO-GÜNLÜK // DERİN UZAY AĞI';
}

function renderNostalgiaCard(ev) {
  if (!nostalgiaCard || !ev) return;
  const badgeText = getEraBadgeLabel(ev.gazeteTipi);
  nostalgiaCard.className = `nostalgia-card ${ev.gazeteTipi}`;
  void nostalgiaCard.offsetWidth;
  nostalgiaCard.classList.add('card-animate');
  nostalgiaCard.innerHTML = `
    <div class="nostalgia-top">
      <span class="nostalgia-stamp">${badgeText}</span>
      <span class="nostalgia-year">${ev.year}</span>
    </div>
    <h3 class="nostalgia-headline">${ev.manşet}</h3>
    <div class="nostalgia-section">
      <strong>🚀 Uzay Yarışı</strong>
      <p>${ev.uzayYarisi}</p>
    </div>
    <div class="nostalgia-section">
      <strong>🌍 Dünyada O Yıl</strong>
      <p>${ev.dunyadaOYil}</p>
    </div>
  `;
}

function hideNostalgiaCard() {
  if (!nostalgiaCard) return;
  nostalgiaCard.className = 'nostalgia-card hidden';
  nostalgiaCard.innerHTML = '';
}

function initTimelineAstronaut() {
  if (!timelineAstronaut) return;
  timelineAstronaut.innerHTML = `
    <div class="timeline-astro-flip" id="timeline-astro-flip">
      <svg class="timeline-astro-svg" viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <radialGradient id="tlVisor" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#332e59"/>
            <stop offset="70%" stop-color="#191632"/>
            <stop offset="100%" stop-color="#0d0b1e"/>
          </radialGradient>
        </defs>
        <g stroke="#241c45" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
          <!-- Sırt çantası -->
          <rect x="33" y="68" width="54" height="36" rx="14" fill="#d7dcf0"/>
          <!-- Uzaya el sallayan sol kol -->
          <path d="M40 78 C24 68 18 52 24 44 C30 36 42 44 45 58 Z" fill="#ffffff"/>
          <ellipse cx="26" cy="46" rx="8" ry="10" transform="rotate(-24 26 46)" fill="#ffffff"/>
          <!-- Sağ kol -->
          <path d="M80 78 C95 84 99 98 92 104 C85 109 76 101 76 89 Z" fill="#ffffff"/>
          <!-- Bacaklar ve uzay botları -->
          <path d="M46 103 L42 126 C40 132 54 134 56 126 L58 104 Z" fill="#ffffff"/>
          <path d="M74 103 L78 126 C80 132 66 134 64 126 L62 104 Z" fill="#ffffff"/>
          <ellipse cx="47" cy="127" rx="11" ry="6" fill="#38bdf8"/>
          <ellipse cx="73" cy="127" rx="11" ry="6" fill="#38bdf8"/>
          <!-- Gövde -->
          <rect x="40" y="68" width="40" height="40" rx="16" fill="#ffffff"/>
          <!-- Kemer kontrol kutusu -->
          <rect x="49" y="83" width="24" height="14" rx="5" fill="#f1f5ff"/>
          <circle cx="57" cy="90" r="4.5" fill="#38bdf8"/>
          <circle cx="67" cy="90" r="2.2" fill="#f59e0b"/>
          <!-- Kulaklıklar & kask -->
          <rect x="19" y="34" width="14" height="19" rx="7" fill="#ffffff"/>
          <rect x="87" y="34" width="14" height="19" rx="7" fill="#ffffff"/>
          <ellipse cx="60" cy="42" rx="35" ry="33" fill="#ffffff"/>
        </g>
        <ellipse cx="60" cy="44" rx="28" ry="25" fill="url(#tlVisor)" stroke="#241c45" stroke-width="3.2"/>
        <path d="M68 25 C82 29 88 43 81 55" fill="none" stroke="rgba(255,255,255,0.42)" stroke-width="4" stroke-linecap="round"/>
        <circle cx="44" cy="36" r="4.2" fill="rgba(255,255,255,0.45)"/>
      </svg>
      <div class="timeline-astro-shadow"></div>
    </div>
  `;
}

function computeTimelineNodeX(nodeEl) {
  if (!nodeEl || !cosmicTimeline || !timelineTrack) return 72;
  const barRect = cosmicTimeline.getBoundingClientRect ? cosmicTimeline.getBoundingClientRect() : null;
  const nodeRect = nodeEl.getBoundingClientRect ? nodeEl.getBoundingClientRect() : null;
  if (barRect && nodeRect && barRect.width > 0 && nodeRect.width > 0) {
    const rawX = nodeRect.left - barRect.left + nodeRect.width / 2;
    return Math.max(54, Math.min(barRect.width - 54, rawX));
  }
  const trackOffset = timelineTrack.offsetLeft || 46;
  const nodeLeft = nodeEl.offsetLeft || 0;
  const nodeWidth = nodeEl.offsetWidth || 72;
  const scrollLeft = timelineTrack.scrollLeft || 0;
  return Math.max(54, trackOffset + nodeLeft - scrollLeft + nodeWidth / 2);
}

function moveTimelineAstronautToNode(index, options = {}) {
  if (!timelineAstronaut || !cosmicTimeline || !timelineTrack) return;
  const nodeEl = timelineNodeElements[index];
  if (!nodeEl) return;

  const animateWalk = options.animate !== false;
  const playAudio = options.playAudio !== false;
  const targetX = computeTimelineNodeX(nodeEl);
  const deltaX = targetX - timelineAstroX;
  const flipEl = timelineAstronaut.querySelector('.timeline-astro-flip');

  if (flipEl && Math.abs(deltaX) > 2) {
    flipEl.style.transform = deltaX >= 0 ? 'scaleX(1)' : 'scaleX(-1)';
  }

  timelineAstroX = targetX;
  timelineAstronaut.style.left = `${Math.round(targetX)}px`;

  if (animateWalk && Math.abs(deltaX) > 2) {
    timelineAstronaut.classList.remove('walking');
    void timelineAstronaut.offsetWidth;
    timelineAstronaut.classList.add('walking');
    if (timelineAstroWalkTimer) clearTimeout(timelineAstroWalkTimer);
    timelineAstroWalkTimer = setTimeout(() => {
      if (timelineAstronaut) timelineAstronaut.classList.remove('walking');
    }, 880);

    if (playAudio) {
      playTimelineFootsteps(4);
    }
  }
}

function syncTimelineUI(index) {
  currentTimelineIndex = index;
  const events = getTimelineEventsList();
  timelineNodeElements.forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });
  if (timelinePrevBtn) {
    timelinePrevBtn.disabled = events.length === 0 || index === 0;
  }
  if (timelineNextBtn) {
    timelineNextBtn.disabled = events.length === 0 || index >= events.length - 1;
  }
  const activeBtn = timelineNodeElements[index];
  if (activeBtn && typeof activeBtn.scrollIntoView === 'function') {
    lastProgrammaticTimelineScrollAt = Date.now();
    activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
  if (index >= 0) {
    const playTlAudio = timelineStepAudioRequested;
    timelineStepAudioRequested = false;
    moveTimelineAstronautToNode(index, { animate: true, playAudio: playTlAudio });
  }
}

function syncTimelineForEquipment(planetId, eqId) {
  const events = getTimelineEventsList();
  const idx = events.findIndex((ev) => ev.planet === planetId && ev.eqId === eqId);
  if (idx >= 0) {
    syncTimelineUI(idx);
    renderNostalgiaCard(events[idx]);
  } else {
    syncTimelineUI(-1);
    hideNostalgiaCard();
  }
}

function selectTimelineEventByIndex(index) {
  const events = getTimelineEventsList();
  if (!events.length) return;
  const clamped = Math.max(0, Math.min(events.length - 1, index));
  const ev = events[clamped];
  currentTimelineIndex = clamped;
  timelineStepAudioRequested = true;

  if (selectedPlanet !== ev.planet) {
    selectPlanet(ev.planet);
  }
  window.showEquipmentStory(ev.planet, ev.eqId);
}

window.selectTimelineEventByIndex = selectTimelineEventByIndex;

function initCosmicTimeline() {
  const events = getTimelineEventsList();
  if (!timelineTrack || !events.length) return;

  timelineTrack.innerHTML = '';
  timelineNodeElements = [];

  events.forEach((ev, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'timeline-node';
    btn.dataset.index = String(index);
    btn.dataset.planet = ev.planet;
    btn.innerHTML = `
      <span class="node-dot"></span>
      <span class="node-year">${ev.year}</span>
      <span class="node-planet">${ev.planet === 'moon' ? 'Ay' : 'Mars'}</span>
    `;
    btn.addEventListener('click', () => selectTimelineEventByIndex(index));
    timelineTrack.appendChild(btn);
    timelineNodeElements.push(btn);
  });

  if (timelinePrevBtn) {
    timelinePrevBtn.addEventListener('click', () => {
      const targetIdx = currentTimelineIndex <= 0 ? 0 : currentTimelineIndex - 1;
      selectTimelineEventByIndex(targetIdx);
    });
  }

  if (timelineNextBtn) {
    timelineNextBtn.addEventListener('click', () => {
      const targetIdx =
        currentTimelineIndex < 0 ? 0 : Math.min(events.length - 1, currentTimelineIndex + 1);
      selectTimelineEventByIndex(targetIdx);
    });
  }

  let lastScrollLeft = timelineTrack.scrollLeft || 0;
  let lastScrollHopAt = 0;

  timelineTrack.addEventListener(
    'wheel',
    (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        timelineTrack.scrollLeft += e.deltaY;
      }
    },
    { passive: false }
  );

  timelineTrack.addEventListener('scroll', () => {
    const curScrollLeft = timelineTrack.scrollLeft || 0;
    const isProgrammatic = Date.now() - lastProgrammaticTimelineScrollAt < 720;
    if (isProgrammatic) {
      if (currentTimelineIndex >= 0) {
        moveTimelineAstronautToNode(currentTimelineIndex, { animate: false, playAudio: false });
      }
      lastScrollLeft = curScrollLeft;
      return;
    }

    const delta = curScrollLeft - lastScrollLeft;
    lastScrollLeft = curScrollLeft;
    if (Math.abs(delta) < 2) return;

    const flipEl = timelineAstronaut ? timelineAstronaut.querySelector('.timeline-astro-flip') : null;
    if (flipEl) {
      flipEl.style.transform = delta >= 0 ? 'scaleX(1)' : 'scaleX(-1)';
    }

    if (currentTimelineIndex >= 0) {
      const now = Date.now();
      const shouldHop = now - lastScrollHopAt > 520;
      if (shouldHop) lastScrollHopAt = now;
      moveTimelineAstronautToNode(currentTimelineIndex, { animate: shouldHop, playAudio: shouldHop });
    } else if (timelineNodeElements.length > 0) {
      const midIdx = Math.min(
        timelineNodeElements.length - 1,
        Math.max(0, Math.round((curScrollLeft / Math.max(1, timelineTrack.scrollWidth - timelineTrack.clientWidth)) * (timelineNodeElements.length - 1)))
      );
      const now = Date.now();
      const shouldHop = now - lastScrollHopAt > 520;
      if (shouldHop) lastScrollHopAt = now;
      moveTimelineAstronautToNode(midIdx, { animate: shouldHop, playAudio: shouldHop });
    }
  });

  window.addEventListener('resize', () => {
    const idx = currentTimelineIndex >= 0 ? currentTimelineIndex : 0;
    moveTimelineAstronautToNode(idx, { animate: false, playAudio: false });
  });

  initTimelineAstronaut();
  syncTimelineUI(-1);
  requestAnimationFrame(() => {
    moveTimelineAstronautToNode(0, { animate: false, playAudio: false });
  });
}

updateRepairProgressUI();
initCosmicTimeline();
animate();
preloadStoryAudioFiles();
preloadNasaArchivePhotos();
