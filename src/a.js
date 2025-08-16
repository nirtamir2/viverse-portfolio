import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

// Debug
const gui = new GUI({ width: 225 });
const debugObject = {
	displacement: true,
	doubleSide: false,
	displacementDivider: 2,
	scaleZ: 0.05,
	zFightingOffset: 0.001,
	autoDepthSeparation: true
};

gui.add(debugObject, "displacement").name("Displacement").onChange(createMesh);
gui
	.add(debugObject, "displacementDivider")
	.min(1)
	.max(16)
	.step(1)
	.name("Displacement Divider")
	.onChange(createMesh);
gui.add(debugObject, "doubleSide").name("Double Side").onChange(createMesh);
gui.add(debugObject, "zFightingOffset", 0.0001, 0.01, 0.0001).name("Z-Fighting Offset").onChange(createMesh);
gui.add(debugObject, "autoDepthSeparation").name("Auto Depth Separation").onChange(createMesh);

// Debug controls for gradient visibility
const gradientDebug = {
	textureResolution: 1024,
	enhanceContrast: true,
	metalness: 0.1,
	roughness: 0.3,
	envMapIntensity: 0.2,
	showGradientInfo: true,
	forceGradientUVs: true
};

gui.add(gradientDebug, "textureResolution", [256, 512, 1024, 2048]).name("Gradient Resolution").onChange(createMesh);
gui.add(gradientDebug, "enhanceContrast").name("Enhance Contrast").onChange(createMesh);
gui.add(gradientDebug, "metalness", 0, 1, 0.01).name("Gradient Metalness").onChange(updateGradientMaterials);
gui.add(gradientDebug, "roughness", 0, 1, 0.01).name("Gradient Roughness").onChange(updateGradientMaterials);
gui.add(gradientDebug, "envMapIntensity", 0, 1, 0.01).name("Env Map Intensity").onChange(updateGradientMaterials);
gui.add(gradientDebug, "showGradientInfo").name("Show Gradient Info");
gui.add(gradientDebug, "forceGradientUVs").name("Force Gradient UVs").onChange(createMesh);

// Debug controls for mask functionality
const maskDebug = {
	enableMasks: true,
	maskResolution: 512,
	showMaskTextures: false,
	maskOpacity: 1.0,
	debugMaskColors: false
};

gui.add(maskDebug, "enableMasks").name("Enable Masks").onChange(createMesh);
gui.add(maskDebug, "maskResolution", [256, 512, 1024]).name("Mask Resolution").onChange(createMesh);
gui.add(maskDebug, "showMaskTextures").name("Show Mask Textures");
gui.add(maskDebug, "maskOpacity", 0, 1, 0.01).name("Mask Opacity").onChange(updateMaskMaterials);
gui.add(maskDebug, "debugMaskColors").name("Debug Mask Colors").onChange(createMesh);

// Debug controls for use element functionality
const useDebug = {
	enableUse: true,
	maxUseDepth: 5,
	showUseInstances: true,
	debugUseColors: false,
	inheritTransforms: true
};

gui.add(useDebug, "enableUse").name("Enable <use>").onChange(createMesh);
gui.add(useDebug, "maxUseDepth", 1, 10, 1).name("Max Use Depth").onChange(createMesh);
gui.add(useDebug, "showUseInstances").name("Show Use Instances");
gui.add(useDebug, "debugUseColors").name("Debug Use Colors").onChange(createMesh);
gui.add(useDebug, "inheritTransforms").name("Inherit Transforms").onChange(createMesh);

function updateGradientMaterials() {
	if (mesh) {
		mesh.traverse((child) => {
			if (child.isMesh && child.material && child.material.map) {
				child.material.metalness = gradientDebug.metalness;
				child.material.roughness = gradientDebug.roughness;
				child.material.envMapIntensity = gradientDebug.envMapIntensity;
			}
		});
	}
}

function updateMaskMaterials() {
	if (mesh) {
		mesh.traverse((child) => {
			if (child.isMesh && child.material && child.material.alphaMap) {
				child.material.opacity = maskDebug.maskOpacity;
				child.material.needsUpdate = true;
			}
		});
	}
}

function updateUseMaterials() {
	if (mesh) {
		mesh.traverse((child) => {
			if (child.isMesh && child.userData.isUseInstance && useDebug.debugUseColors) {
				// Apply debug colors to use instances
				const hue = (child.userData.useDepth * 60) % 360;
				child.material.color.setHSL(hue / 360, 0.7, 0.5);
				child.material.needsUpdate = true;
			}
		});
	}
}

/**
 * Base
 */
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
const rgbeLoader = new RGBELoader();
const svgLoader = new SVGLoader();

// Environment map
rgbeLoader.load(
	"https://modelviewer.dev/shared-assets/environments/whipple_creek_regional_park_04_1k.hdr",
	(environmentMap) => {
		environmentMap.mapping = THREE.EquirectangularReflectionMapping;

		scene.background = environmentMap;
		scene.backgroundBlurriness = 0.4;
		scene.environment = environmentMap;
	}
);

// Mesh
let mesh = new THREE.Mesh(
	new THREE.BoxGeometry(2, 2, 2),
	new THREE.MeshStandardMaterial({
		metalness: 0,
		roughness: 0.5,
		color: "#85d534"
	})
);
mesh.castShadow = true;
mesh.receiveShadow = true;
scene.add(mesh);

// Evento del botón
document.getElementById("loadSvg").addEventListener("click", createMesh);

function createMesh() {
	if (mesh) {
		scene.remove(mesh);
	}

	let svgText = document.getElementById("svgInput").value;
	let options = {
		depth: 2,
		color: 0xff0000,
		scale: new THREE.Vector3(
			debugObject.scaleZ,
			debugObject.scaleZ,
			debugObject.scaleZ
		)
	};

	mesh = svgToMesh(svgText, options);

	const box = new THREE.Box3().setFromObject(mesh);
	const size = new THREE.Vector3();
	box.getSize(size);

	const TARGET_SIZE = 5;

	const worldScale = new THREE.Vector3();
	mesh.getWorldScale(worldScale);

	const scaleFactor = TARGET_SIZE / Math.max(size.x, size.y);
	mesh.scale.multiply(new THREE.Vector3(scaleFactor, scaleFactor, 1));

	const newBox = new THREE.Box3().setFromObject(mesh);
	const newSize = new THREE.Vector3();
	newBox.getSize(newSize);

	mesh.position.set(-newSize.x / 2, newSize.y / 2, 0);

	mesh.rotation.x = Math.PI;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	scene.add(mesh);
}

createMesh();

gui
	.add(debugObject, "scaleZ")
	.min(0.01)
	.max(1)
	.step(0.001)
	.name("scaleZ")
	.onChange(() => {
		mesh.scale.z = debugObject.scaleZ;
	});

function exportGLTFModel() {
	const exporter = new GLTFExporter();
	exporter.parse(
		mesh,
		(result) => {
			const link = document.createElement("a");
			link.style.display = "none";
			document.body.appendChild(link);

			const blob = new Blob([JSON.stringify(result)], {
				type: "application/octet-stream"
			});
			const url = URL.createObjectURL(blob);

			link.href = url;
			link.download = "model.gltf";
			link.click();

			URL.revokeObjectURL(url);
		},
		{
			binary: true
		}
	);
}

// Lights
const directionalLight = new THREE.DirectionalLight("#ffffff", 2);
directionalLight.position.set(6.25, 3, 4);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
	pixelRatio: Math.min(window.devicePixelRatio, 2)
};

window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;
	sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(sizes.pixelRatio);
});

// Camera
const camera = new THREE.PerspectiveCamera(
	35,
	sizes.width / sizes.height,
	0.1,
	10000
);
camera.position.set(0, 0, 16);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: true
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

// Improve depth precision to reduce z-fighting
renderer.sortObjects = true;
renderer.capabilities.logarithmicDepthBuffer = true;

// Animate
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();

/*
svg-to-mesh 2.0.0 by Suryansh Gupta with Linear Gradient, Mask, and Use Support
Original code: https://github.com/suryanshgupta6502/svg-to-mesh
Enhanced with gradient, mask, and use element support
*/

// Function to parse and expand <use> elements
function parseAndExpandUseElements(svgText) {
	const parser = new DOMParser();
	const doc = parser.parseFromString(svgText, 'image/svg+xml');
	
	// Create a map of all referenceable elements (with id attributes)
	const elementRegistry = new Map();
	const allElements = doc.querySelectorAll('[id]');
	
	console.log(`Found ${allElements.length} elements with IDs for use referencing`);
	
	allElements.forEach(element => {
		const id = element.getAttribute('id');
		elementRegistry.set(id, element);
		console.log(`Registered element: ${id} (${element.tagName})`);
	});
	
	// Find all <use> elements and expand them
	const useElements = doc.querySelectorAll('use');
	const expandedElements = [];
	
	console.log(`Found ${useElements.length} <use> elements to expand`);
	
	function expandUseElement(useElement, depth = 0, parentTransform = null) {
		if (depth > useDebug.maxUseDepth) {
			console.warn(`Max use depth (${useDebug.maxUseDepth}) exceeded, skipping`);
			return [];
		}
		
		const href = useElement.getAttribute('href') || useElement.getAttribute('xlink:href');
		if (!href) {
			console.warn('Use element without href found');
			return [];
		}
		
		const targetId = href.replace('#', '');
		const targetElement = elementRegistry.get(targetId);
		
		if (!targetElement) {
			console.warn(`Referenced element not found: ${targetId}`);
			return [];
		}
		
		// Get use element transform attributes
		const x = parseFloat(useElement.getAttribute('x') || '0');
		const y = parseFloat(useElement.getAttribute('y') || '0');
		const width = useElement.getAttribute('width');
		const height = useElement.getAttribute('height');
		const transform = useElement.getAttribute('transform') || '';
		
		// Calculate combined transform
		let combinedTransform = '';
		if (parentTransform) {
			combinedTransform = parentTransform;
		}
		if (x !== 0 || y !== 0) {
			combinedTransform += ` translate(${x}, ${y})`;
		}
		if (transform) {
			combinedTransform += ` ${transform}`;
		}
		
		// Clone the target element
		const clonedElement = targetElement.cloneNode(true);
		
		// Apply transforms and attributes from use element
		if (combinedTransform.trim()) {
			const existingTransform = clonedElement.getAttribute('transform') || '';
			clonedElement.setAttribute('transform', `${combinedTransform} ${existingTransform}`.trim());
		}
		
		// Handle width/height for symbol elements
		if (targetElement.tagName.toLowerCase() === 'symbol' && (width || height)) {
			// Symbols need special handling for width/height
			if (width) clonedElement.setAttribute('width', width);
			if (height) clonedElement.setAttribute('height', height);
		}
		
		// Copy relevant attributes from use element (style, class, etc.)
		const attributesToCopy = ['style', 'class', 'fill', 'stroke', 'stroke-width', 'opacity', 'mask'];
		attributesToCopy.forEach(attr => {
			const value = useElement.getAttribute(attr);
			if (value && !clonedElement.getAttribute(attr)) {
				clonedElement.setAttribute(attr, value);
			}
		});
		
		// Add metadata for debugging
		clonedElement.setAttribute('data-use-instance', 'true');
		clonedElement.setAttribute('data-use-depth', depth.toString());
		clonedElement.setAttribute('data-use-target', targetId);
		
		// Remove id from cloned element to avoid conflicts
		clonedElement.removeAttribute('id');
		
		const results = [clonedElement];
		
		// Recursively expand any nested use elements in the cloned content
		const nestedUseElements = clonedElement.querySelectorAll('use');
		nestedUseElements.forEach(nestedUse => {
			const nestedResults = expandUseElement(nestedUse, depth + 1, combinedTransform);
			results.push(...nestedResults);
			// Remove the original nested use element since we've expanded it
			nestedUse.remove();
		});
		
		console.log(`Expanded use element referencing ${targetId} at depth ${depth}`);
		
		return results;
	}
	
	// Expand all use elements
	useElements.forEach(useElement => {
		if (useDebug.enableUse) {
			const expandedResults = expandUseElement(useElement);
			expandedElements.push(...expandedResults);
		}
	});
	
	// Insert expanded elements into the document
	expandedElements.forEach(element => {
		// Find appropriate parent (usually the same parent as the original use element or root svg)
		const svg = doc.querySelector('svg');
		if (svg) {
			svg.appendChild(element);
		}
	});
	
	// Remove original use elements if we've processed them
	if (useDebug.enableUse) {
		useElements.forEach(useElement => {
			useElement.remove();
		});
	}
	
	console.log(`Expanded ${expandedElements.length} elements from ${useElements.length} use elements`);
	
	// Return the modified SVG as text
	return new XMLSerializer().serializeToString(doc);
}

// Function to parse transforms from transform attribute
function parseTransform(transformStr) {
	const transforms = {
		translate: { x: 0, y: 0 },
		scale: { x: 1, y: 1 },
		rotate: { angle: 0, cx: 0, cy: 0 },
		skewX: 0,
		skewY: 0
	};
	
	if (!transformStr) return transforms;
	
	// Parse translate
	const translateMatch = transformStr.match(/translate\s*\(\s*([^)]+)\)/);
	if (translateMatch) {
		const values = translateMatch[1].split(/[\s,]+/).map(v => parseFloat(v));
		transforms.translate.x = values[0] || 0;
		transforms.translate.y = values[1] || 0;
	}
	
	// Parse scale
	const scaleMatch = transformStr.match(/scale\s*\(\s*([^)]+)\)/);
	if (scaleMatch) {
		const values = scaleMatch[1].split(/[\s,]+/).map(v => parseFloat(v));
		transforms.scale.x = values[0] || 1;
		transforms.scale.y = values[1] || values[0] || 1;
	}
	
	// Parse rotate
	const rotateMatch = transformStr.match(/rotate\s*\(\s*([^)]+)\)/);
	if (rotateMatch) {
		const values = rotateMatch[1].split(/[\s,]+/).map(v => parseFloat(v));
		transforms.rotate.angle = (values[0] || 0) * Math.PI / 180; // Convert to radians
		transforms.rotate.cx = values[1] || 0;
		transforms.rotate.cy = values[2] || 0;
	}
	
	return transforms;
}

// Function to parse masks from SVG
function parseMasks(svgText) {
	const masks = new Map();
	const parser = new DOMParser();
	const doc = parser.parseFromString(svgText, 'image/svg+xml');
	
	const maskElements = doc.querySelectorAll('mask');
	
	console.log(`Found ${maskElements.length} mask definitions`);
	
	maskElements.forEach(maskElement => {
		const id = maskElement.getAttribute('id');
		const maskUnits = maskElement.getAttribute('maskUnits') || 'objectBoundingBox';
		const maskContentUnits = maskElement.getAttribute('maskContentUnits') || 'userSpaceOnUse';
		
		// Get mask bounds
		const x = parseFloat(maskElement.getAttribute('x') || '0');
		const y = parseFloat(maskElement.getAttribute('y') || '0');
		const width = parseFloat(maskElement.getAttribute('width') || '1');
		const height = parseFloat(maskElement.getAttribute('height') || '1');
		
		// Parse mask content (shapes, paths, etc.)
		const maskContent = [];
		const children = maskElement.children;
		
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			const tagName = child.tagName.toLowerCase();
			
			if (tagName === 'rect' || tagName === 'circle' || tagName === 'ellipse' || 
				tagName === 'polygon' || tagName === 'path' || tagName === 'g') {
				
				const fill = child.getAttribute('fill') || 'white';
				const opacity = parseFloat(child.getAttribute('opacity') || '1');
				const fillOpacity = parseFloat(child.getAttribute('fill-opacity') || '1');
				
				maskContent.push({
					element: child,
					tagName,
					fill,
					opacity: opacity * fillOpacity,
					attributes: Array.from(child.attributes).reduce((acc, attr) => {
						acc[attr.name] = attr.value;
						return acc;
					}, {})
				});
			}
		}
		
		const maskData = {
			id,
			x, y, width, height,
			maskUnits,
			maskContentUnits,
			content: maskContent
		};
		
		masks.set(id, maskData);
		console.log(`Parsed mask ${id}:`, maskData);
	});
	
	return masks;
}

// Function to create mask texture from mask definition
function createMaskTexture(maskDef, targetBounds, width = 512, height = 512) {
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d');
	
	// Clear with black (transparent in mask)
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, width, height);
	
	// Calculate scaling factors based on mask units
	let scaleX = 1, scaleY = 1, offsetX = 0, offsetY = 0;
	
	if (maskDef.maskUnits === 'objectBoundingBox') {
		// Mask coordinates are relative to the object bounding box (0-1)
		scaleX = width;
		scaleY = height;
	} else {
		// userSpaceOnUse - mask coordinates are in user coordinate system
		const targetWidth = targetBounds.max.x - targetBounds.min.x;
		const targetHeight = targetBounds.max.y - targetBounds.min.y;
		
		scaleX = width / targetWidth;
		scaleY = height / targetHeight;
		offsetX = -targetBounds.min.x * scaleX;
		offsetY = -targetBounds.min.y * scaleY;
	}
	
	ctx.save();
	ctx.scale(scaleX, scaleY);
	ctx.translate(offsetX / scaleX, offsetY / scaleY);
	
	// Render mask content
	maskDef.content.forEach(item => {
		const opacity = Math.max(0, Math.min(1, item.opacity));
		const grayValue = Math.round(opacity * 255);
		
		if (maskDebug.debugMaskColors) {
			// Use colors for debugging
			ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 50%)`;
		} else {
			// Use grayscale based on opacity (white = visible, black = transparent)
			ctx.fillStyle = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
		}
		
		ctx.globalAlpha = 1; // Don't use canvas alpha, encode in color
		
		// Render different mask shapes
		switch (item.tagName) {
			case 'rect':
				const x = parseFloat(item.attributes.x || '0');
				const y = parseFloat(item.attributes.y || '0');
				const rectWidth = parseFloat(item.attributes.width || '0');
				const rectHeight = parseFloat(item.attributes.height || '0');
				ctx.fillRect(x, y, rectWidth, rectHeight);
				break;
				
			case 'circle':
				const cx = parseFloat(item.attributes.cx || '0');
				const cy = parseFloat(item.attributes.cy || '0');
				const r = parseFloat(item.attributes.r || '0');
				ctx.beginPath();
				ctx.arc(cx, cy, r, 0, Math.PI * 2);
				ctx.fill();
				break;
				
			case 'ellipse':
				const ex = parseFloat(item.attributes.cx || '0');
				const ey = parseFloat(item.attributes.cy || '0');
				const rx = parseFloat(item.attributes.rx || '0');
				const ry = parseFloat(item.attributes.ry || '0');
				ctx.beginPath();
				ctx.ellipse(ex, ey, rx, ry, 0, 0, Math.PI * 2);
				ctx.fill();
				break;
				
			case 'path':
				// For paths, we'll create a simplified approximation
				// In a full implementation, you'd parse the path data
				const d = item.attributes.d;
				if (d) {
					try {
						const path2D = new Path2D(d);
						ctx.fill(path2D);
					} catch (e) {
						console.warn('Could not render path in mask:', e);
					}
				}
				break;
		}
	});
	
	ctx.restore();
	
	const texture = new THREE.CanvasTexture(canvas);
	texture.wrapS = THREE.ClampToEdgeWrapping;
	texture.wrapT = THREE.ClampToEdgeWrapping;
	texture.flipY = false;
	texture.needsUpdate = true;
	
	// Configure texture for use as alpha map
	texture.magFilter = THREE.LinearFilter;
	texture.minFilter = THREE.LinearFilter;
	
	console.log(`Created mask texture for ${maskDef.id}:`, {
		size: { width, height },
		bounds: targetBounds,
		scaling: { scaleX, scaleY, offsetX, offsetY }
	});
	
	return texture;
}

// Function to parse linear gradients from SVG with enhanced support
function parseGradients(svgText) {
	const gradients = new Map();
	const parser = new DOMParser();
	const doc = parser.parseFromString(svgText, 'image/svg+xml');
	
	const linearGradients = doc.querySelectorAll('linearGradient');
	
	console.log(`Found ${linearGradients.length} linear gradients`);
	
	linearGradients.forEach(gradient => {
		const id = gradient.getAttribute('id');
		
		// Handle percentage and absolute values with better parsing
		let x1 = gradient.getAttribute('x1') || '0%';
		let y1 = gradient.getAttribute('y1') || '0%';
		let x2 = gradient.getAttribute('x2') || '100%';
		let y2 = gradient.getAttribute('y2') || '0%';
		
		// More robust percentage parsing
		const parseCoordinate = (coord) => {
			if (typeof coord === 'string') {
				if (coord.includes('%')) {
					return parseFloat(coord.replace('%', '')) / 100;
				} else {
					// Handle absolute values - normalize them
					const value = parseFloat(coord);
					// If it's a large number, assume it's in SVG coordinate space
					if (Math.abs(value) > 2) {
						return value / 100; // Rough normalization
					}
					return value;
				}
			}
			return parseFloat(coord) || 0;
		};
		
		x1 = parseCoordinate(x1);
		y1 = parseCoordinate(y1);
		x2 = parseCoordinate(x2);
		y2 = parseCoordinate(y2);
		
		// Ensure coordinates are in valid range
		x1 = Math.max(-1, Math.min(2, x1));
		y1 = Math.max(-1, Math.min(2, y1));
		x2 = Math.max(-1, Math.min(2, x2));
		y2 = Math.max(-1, Math.min(2, y2));
		
		const stops = [];
		const stopElements = gradient.querySelectorAll('stop');
		
		console.log(`Gradient ${id} has ${stopElements.length} stops`);
		
		stopElements.forEach((stop, index) => {
			let offset = stop.getAttribute('offset') || `${index * 100 / (stopElements.length - 1)}%`;
			
			// Parse offset more robustly
			if (typeof offset === 'string') {
				if (offset.includes('%')) {
					offset = parseFloat(offset.replace('%', '')) / 100;
				} else {
					offset = parseFloat(offset);
				}
			}
			
			// Ensure offset is in valid range
			offset = Math.max(0, Math.min(1, offset));
			
			const color = stop.getAttribute('stop-color') || '#000000';
			const opacity = parseFloat(stop.getAttribute('stop-opacity') || '1');
			
			stops.push({ 
				offset, 
				color, 
				opacity: Math.max(0, Math.min(1, opacity))
			});
			
			console.log(`  Stop ${index}: offset=${offset}, color=${color}, opacity=${opacity}`);
		});
		
		// Sort stops by offset and ensure we have at least 2 stops
		stops.sort((a, b) => a.offset - b.offset);
		
		// Add default stops if none exist
		if (stops.length === 0) {
			stops.push({ offset: 0, color: '#000000', opacity: 1 });
			stops.push({ offset: 1, color: '#ffffff', opacity: 1 });
		} else if (stops.length === 1) {
			// Duplicate single stop
			const singleStop = stops[0];
			stops.push({ ...singleStop, offset: 1 });
		}
		
		// Ensure first stop is at 0 and last at 1 for proper interpolation
		if (stops[0].offset > 0) {
			stops.unshift({ ...stops[0], offset: 0 });
		}
		if (stops[stops.length - 1].offset < 1) {
			stops.push({ ...stops[stops.length - 1], offset: 1 });
		}
		
		const gradientData = {
			id,
			x1, y1, x2, y2,
			stops
		};
		
		gradients.set(id, gradientData);
		
		console.log(`Parsed gradient ${id}:`, gradientData);
	});
	
	console.log('All parsed gradients:', gradients);
	return gradients;
}

// Function to create gradient texture with advanced color interpolation
function createGradientTexture(gradientDef, width = 1024, height = 1024) {
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d');
	
	// Calculate gradient direction and length
	const x1 = gradientDef.x1 * width;
	const y1 = gradientDef.y1 * height;
	const x2 = gradientDef.x2 * width;
	const y2 = gradientDef.y2 * height;
	
	// Calculate gradient vector for proper UV mapping later
	const gradientVecX = x2 - x1;
	const gradientVecY = y2 - y1;
	const gradientLength = Math.sqrt(gradientVecX * gradientVecX + gradientVecY * gradientVecY);
	
	// Store gradient info for UV calculation
	gradientDef.calculatedLength = gradientLength;
	gradientDef.normalizedVecX = gradientLength > 0 ? gradientVecX / gradientLength : 1;
	gradientDef.normalizedVecY = gradientLength > 0 ? gradientVecY / gradientLength : 0;
	
	const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
	
	// Add color stops with improved color handling and interpolation
	gradientDef.stops.forEach(stop => {
		let color = stop.color;
		
		// Handle rgba colors and ensure proper alpha
		if (stop.opacity < 1) {
			// Convert hex to rgba if needed
			if (color.startsWith('#')) {
				const hex = color.substring(1);
				const r = parseInt(hex.substring(0, 2), 16);
				const g = parseInt(hex.substring(2, 4), 16);
				const b = parseInt(hex.substring(4, 6), 16);
				color = `rgba(${r}, ${g}, ${b}, ${stop.opacity})`;
			} else if (color.startsWith('rgb(')) {
				// Convert rgb() to rgba()
				color = color.replace('rgb(', 'rgba(').replace(')', `, ${stop.opacity})`);
			}
		}
		
		// Clamp offset to valid range
		const clampedOffset = Math.max(0, Math.min(1, stop.offset));
		gradient.addColorStop(clampedOffset, color);
		
		console.log(`Adding color stop: offset=${clampedOffset}, color=${color}`);
	});
	
	// Clear canvas with transparency
	ctx.clearRect(0, 0, width, height);
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, width, height);
	
	const texture = new THREE.CanvasTexture(canvas);
	texture.wrapS = THREE.ClampToEdgeWrapping;
	texture.wrapT = THREE.ClampToEdgeWrapping;
	texture.flipY = false;
	texture.needsUpdate = true;
	
	// Enhance texture quality
	texture.magFilter = THREE.LinearFilter;
	texture.minFilter = THREE.LinearMipMapLinearFilter;
	texture.generateMipmaps = true;
	
	console.log('Created gradient texture:', {
		id: gradientDef.id,
		direction: { x1: gradientDef.x1, y1: gradientDef.y1, x2: gradientDef.x2, y2: gradientDef.y2 },
		stops: gradientDef.stops,
		length: gradientLength
	});
	
	return texture;
}

// Function to calculate shape complexity for better z-sorting
function calculateShapeComplexity(shape) {
	let complexity = 0;
	
	// Count holes (negative impact on complexity for layering)
	if (shape.holes && shape.holes.length > 0) {
		complexity -= shape.holes.length * 10;
	}
	
	// Count curves points
	const curves = shape.curves || [];
	complexity += curves.length;
	
	// Calculate approximate area (larger shapes should be behind)
	const points = shape.getPoints();
	let area = 0;
	for (let i = 0; i < points.length; i++) {
		const j = (i + 1) % points.length;
		area += points[i].x * points[j].y;
		area -= points[j].x * points[i].y;
	}
	area = Math.abs(area) / 2;
	complexity += area * 0.1;
	
	return complexity;
}

function generateGradientUVs(geometry, gradientDef, boundingBox) {
	const uvAttribute = geometry.getAttribute('uv');
	const positionAttribute = geometry.getAttribute('position');
	
	if (!uvAttribute || !positionAttribute) return;
	
	const uvArray = uvAttribute.array;
	const positionArray = positionAttribute.array;
	
	// Calculate bounding box dimensions
	const width = boundingBox.max.x - boundingBox.min.x;
	const height = boundingBox.max.y - boundingBox.min.y;
	
	// Calculate gradient vector
	const gradientVecX = gradientDef.x2 - gradientDef.x1;
	const gradientVecY = gradientDef.y2 - gradientDef.y1;
	const gradientLength = Math.sqrt(gradientVecX * gradientVecX + gradientVecY * gradientVecY);
	
	// Normalize gradient vector
	const normalizedGradX = gradientVecX / gradientLength;
	const normalizedGradY = gradientVecY / gradientLength;
	
	for (let i = 0; i < uvArray.length; i += 2) {
		const vertexIndex = i / 2;
		const x = positionArray[vertexIndex * 3];
		const y = positionArray[vertexIndex * 3 + 1];
		
		// Normalize position to 0-1 range
		const normalizedX = (x - boundingBox.min.x) / width;
		const normalizedY = (y - boundingBox.min.y) / height;
		
		// Project position onto gradient vector
		const projectionX = normalizedX - gradientDef.x1;
		const projectionY = normalizedY - gradientDef.y1;
		const dotProduct = projectionX * normalizedGradX + projectionY * normalizedGradY;
		
		// Calculate UV coordinates based on gradient direction
		const u = Math.max(0, Math.min(1, dotProduct / gradientLength));
		const v = 0.5; // Use middle of texture for consistent gradient
		
		uvArray[i] = u;
		uvArray[i + 1] = v;
	}
	
	uvAttribute.needsUpdate = true;
}

function extractFillReference(styleStr, fillAttr) {
	let fillRef = null;
	
	// Check style attribute first
	if (styleStr) {
		const fillMatch = styleStr.match(/fill:\s*url\(#([^)]+)\)/);
		if (fillMatch) {
			fillRef = fillMatch[1];
		}
	}
	
	// Check fill attribute
	if (!fillRef && fillAttr) {
		const fillMatch = fillAttr.match(/url\(#([^)]+)\)/);
		if (fillMatch) {
			fillRef = fillMatch[1];
		}
	}
	
	return fillRef;
}

function extractMaskReference(styleStr, maskAttr) {
	let maskRef = null;
	
	// Check style attribute first
	if (styleStr) {
		const maskMatch = styleStr.match(/mask:\s*url\(#([^)]+)\)/);
		if (maskMatch) {
			maskRef = maskMatch[1];
		}
	}
	
	// Check mask attribute
	if (!maskRef && maskAttr) {
		const maskMatch = maskAttr.match(/url\(#([^)]+)\)/);
		if (maskMatch) {
			maskRef = maskMatch[1];
		}
	}
	
	return maskRef;
}

function svgToMesh(svgText, options = { depth, color, position, scale }) {
	try {
		const {
			depth = 50,
			color = 0xffffff,
			position = new THREE.Vector3(0, 0, 0),
			scale = new THREE.Vector3(1, 1, 1)
		} = options;

		// First, expand any <use> elements in the SVG
		let processedSvgText = svgText;
		if (useDebug.enableUse) {
			console.log('Processing <use> elements...');
			processedSvgText = parseAndExpandUseElements(svgText);
			console.log('Use elements expanded');
		}

		// Parse gradients and masks from processed SVG
		const gradients = parseGradients(processedSvgText);
		const masks = maskDebug.enableMasks ? parseMasks(processedSvgText) : new Map();
		
		const gradientTextures = new Map();
		const maskTextures = new Map();
		
		// Create textures for each gradient
		gradients.forEach((gradientDef, id) => {
			const texture = createGradientTexture(gradientDef, gradientDebug.textureResolution, gradientDebug.textureResolution);
			gradientTextures.set(id, texture);
		});

		const loader = new SVGLoader();
		const data = loader.parse(processedSvgText);

		const group = new THREE.Group();
		let i = 0;
		
		// First pass: collect all paths and their bounding boxes for mask processing
		const pathData = [];
		for (const path of data.paths) {
			const shapes = SVGLoader.createShapes(path);
			
			for (const shape of shapes) {
				const geometry = new THREE.ExtrudeGeometry(shape, {
					depth: depth,
					bevelEnabled: false
				});
				
				geometry.computeBoundingBox();
				const boundingBox = geometry.boundingBox;
				
				// Check for mask reference
				const style = path.userData?.node?.getAttribute?.('style');
				const maskAttr = path.userData?.node?.getAttribute?.('mask');
				const maskRef = extractMaskReference(style, maskAttr);
				
				// Check if this is a use instance
				const isUseInstance = path.userData?.node?.getAttribute?.('data-use-instance') === 'true';
				const useDepth = parseInt(path.userData?.node?.getAttribute?.('data-use-depth') || '0');
				const useTarget = path.userData?.node?.getAttribute?.('data-use-target');
				
				// Parse transform from the path if it's a use instance
				const transformAttr = path.userData?.node?.getAttribute?.('transform');
				const parsedTransform = parseTransform(transformAttr);
				
				pathData.push({
					path,
					shape,
					geometry,
					boundingBox,
					maskRef,
					isUseInstance,
					useDepth,
					useTarget,
					transform: parsedTransform
				});
			}
		}
		
		// Create mask textures for referenced masks
		masks.forEach((maskDef, id) => {
			// Find paths that use this mask to determine appropriate bounds
			const maskedPaths = pathData.filter(p => p.maskRef === id);
			
			if (maskedPaths.length > 0) {
				// Calculate combined bounding box for all paths using this mask
				let combinedBounds = maskedPaths[0].boundingBox.clone();
				maskedPaths.forEach(pathInfo => {
					combinedBounds.union(pathInfo.boundingBox);
				});
				
				const maskTexture = createMaskTexture(maskDef, combinedBounds, maskDebug.maskResolution, maskDebug.maskResolution);
				maskTextures.set(id, maskTexture);
			}
		});
		
		// Second pass: create meshes with proper materials
		for (const pathInfo of pathData) {
			const { path, shape, geometry, boundingBox, maskRef, isUseInstance, useDepth, useTarget, transform } = pathInfo;
			const shapeColor = path.color;
			
			// Check if path has gradient fill
			const style = path.userData?.node?.getAttribute?.('style');
			const fill = path.userData?.node?.getAttribute?.('fill');
			const gradientRef = extractFillReference(style, fill);
			
			console.log('Processing path:', {
				gradientRef,
				maskRef,
				isUseInstance,
				useDepth,
				useTarget,
				style,
				fill
			});
			
			let material;
			
			// Create base material (gradient or solid color)
			if (gradientRef && gradientTextures.has(gradientRef)) {
				console.log('Using gradient texture for:', gradientRef);
				const gradientTexture = gradientTextures.get(gradientRef);
				const gradientDef = gradients.get(gradientRef);
				
				// Generate proper UV coordinates for the gradient
				generateGradientUVs(geometry, gradientDef, boundingBox);
				
				material = new THREE.MeshStandardMaterial({
					map: gradientTexture,
					side: debugObject.doubleSide ? THREE.DoubleSide : THREE.FrontSide,
					metalness: gradientDebug.metalness,
					roughness: gradientDebug.roughness,
					envMapIntensity: gradientDebug.envMapIntensity
				});
			} else {
				// Use solid color
				let finalColor = shapeColor;
				
				// Apply debug coloring for use instances
				if (isUseInstance && useDebug.debugUseColors) {
					const hue = (useDepth * 60) % 360;
					finalColor = new THREE.Color().setHSL(hue / 360, 0.7, 0.5);
				}
				
				material = new THREE.MeshStandardMaterial({
					color: finalColor,
					side: debugObject.doubleSide ? THREE.DoubleSide : THREE.FrontSide,
					metalness: 0,
					roughness: 0.5
				});
			}
			
			// Apply mask if present
			if (maskRef && maskTextures.has(maskRef)) {
				console.log('Applying mask texture for:', maskRef);
				const maskTexture = maskTextures.get(maskRef);
				
				// Set up material for masking
				material.alphaMap = maskTexture;
				material.transparent = true;
				material.opacity = maskDebug.maskOpacity;
				
				// Generate UV coordinates for mask (usually same as object coordinates)
				const uvAttribute = geometry.getAttribute('uv');
				const positionAttribute = geometry.getAttribute('position');
				
				if (uvAttribute && positionAttribute) {
					const uvArray = uvAttribute.array;
					const positionArray = positionAttribute.array;
					
					// Calculate bounding box dimensions for UV mapping
					const width = boundingBox.max.x - boundingBox.min.x;
					const height = boundingBox.max.y - boundingBox.min.y;
					
					for (let j = 0; j < uvArray.length; j += 2) {
						const vertexIndex = j / 2;
						const x = positionArray[vertexIndex * 3];
						const y = positionArray[vertexIndex * 3 + 1];
						
						// Normalize position to 0-1 range for mask UV
						const u = (x - boundingBox.min.x) / width;
						const v = (y - boundingBox.min.y) / height;
						
						// For masks, we might need to flip V coordinate
						uvArray[j] = Math.max(0, Math.min(1, u));
						uvArray[j + 1] = Math.max(0, Math.min(1, 1 - v)); // Flip Y for proper mask orientation
					}
					
					uvAttribute.needsUpdate = true;
				}
			}

			const mesh = new THREE.Mesh(geometry, material);
			
			// Apply transforms from use elements if enabled
			if (isUseInstance && useDebug.inheritTransforms && transform) {
				// Apply translation
				mesh.position.set(transform.translate.x, transform.translate.y, 0);
				
				// Apply scale
				mesh.scale.set(transform.scale.x, transform.scale.y, 1);
				
				// Apply rotation (around the specified center point)
				if (transform.rotate.angle !== 0) {
					mesh.rotation.z = transform.rotate.angle;
					// Note: rotation center handling could be more sophisticated
					// For now, we apply simple rotation around object center
				}
			}
			
			if (debugObject.displacement) {
				mesh.position.z =
					mesh.position.z -
					i / (debugObject.displacementDivider * debugObject.displacementDivider);
			}
			
			// Add custom data for debugging
			mesh.userData = {
				hasGradient: !!gradientRef,
				hasMask: !!maskRef,
				gradientId: gradientRef,
				maskId: maskRef,
				isUseInstance,
				useDepth,
				useTarget,
				originalTransform: transform
			};
			
			group.add(mesh);
			i++;
		}

		const box = new THREE.Box3().setFromObject(group);
		const center = new THREE.Vector3();
		box.getCenter(center);
		group.position.sub(center);

		group.position.add(position);
		group.scale.set(scale.x, scale.y, scale.z);

		// Log summary
		const useInstances = pathData.filter(p => p.isUseInstance).length;
		console.log('SVG processing complete:', {
			totalMeshes: group.children.length,
			gradientsUsed: gradientTextures.size,
			masksUsed: maskTextures.size,
			useInstances,
			masksEnabled: maskDebug.enableMasks,
			useEnabled: useDebug.enableUse
		});

		return group;
	} catch (error) {
		console.error("Error procesando el SVG:", error);
		throw error;
	}
}