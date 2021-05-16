import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { Vector3 } from 'three'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import pointFragmentShader from './shaders/pointFragment.glsl'

// Debug
const gui = new dat.GUI()

const debug = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Textures
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('/textures/matcaps/7.png')
const starShape = textureLoader.load('/StarShape/1.png')

//Font Loader
const fontLoader = new THREE.FontLoader()

//Material
// const textMaterial = new THREE.MeshMatcapMaterial({
//     matcap: texture
// })

const textMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
        uColor: { value: null },
        uTime: { value: 0 }
    }
})



// Text

const textGroup = new THREE.Group()
scene.add(textGroup)

fontLoader.load('/fonts/gentilis_regular.typeface.json', async (font) => {
    
    const textGeometry = new THREE.TextBufferGeometry("Hi I'm Manish", {
        font: font,
        size: 0.5,
        height: 0.1,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4
    })
    
    textGeometry.center()
    
    const text = new THREE.Mesh(textGeometry, textMaterial)
    textGroup.add(text)
})

//Particles

const count = 10000

let starsGeometry = null
let starsMaterial = null
let stars = null

function generateStars(){
    
    //Dispose code
    
    //Create code
    starsGeometry = new THREE.BufferGeometry()
    const starsPos = new Float32Array(count * 3)
    
    for(let i=0; i<count; i++){
        starsPos[i*3 + 0] = (Math.random() - 0.5) * 20
        starsPos[i*3 + 1] = (Math.random() - 0.5) * 20
        starsPos[i*3 + 2] = (Math.random() - 0.5) * 20
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPos, 3))
    
    starsMaterial = new THREE.PointsMaterial({
        color: 'green',
        size: 0.06,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        map: starShape
    })
    // starsMaterial = new THREE.ShaderMaterial({
    //     vertexShader: vertexShader,
    //     fragmentShader: pointFragmentShader,
    //     side: THREE.DoubleSide,
    //     uniforms: {
    //         uColor: { value: null },
    //         uTime: { value: 0 }
    //     }
    // })
    
    stars = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(stars)
}

generateStars()

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    
    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera




const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 1.5
scene.add(camera)





// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true
// controls.enableZoom = false

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

let mouseX = 0
let mouseY = 0
const mouseFX = {
    moveText(cX, cY) {
        mouseX = (cX / sizes.width) * 2 - 1
        mouseY = -(cY / sizes.height) * 2 + 1

        const c = 3;
        textGroup.rotation.x = mouseX * c
        textGroup.rotation.y = mouseY * c

        textGroup.matrixAutoUpdate = false
        textGroup.updateMatrix()
    },
    moveStars(cX, cY) {
        const c = 0.009
        mouseX = (cX - sizes.width*0.5) * c
        mouseY = (cY - sizes.height*0.5) * c
    },
    onMouseMove(e) {
        // mouseFX.moveText(e.clientX, e.clientY)
        mouseFX.moveStars(e.clientX, e.clientY)
        console.log('MouseMove Detected');
    }
}

document.addEventListener('mousemove', mouseFX.onMouseMove)


const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()
    textMaterial.uniforms.uTime.value = elapsedTime

    // Update objects

    // Update Orbital Controls
    // controls.update()

    // Animate the particles + typo
	const rotX = Math.sin(elapsedTime * 0.8) * 0.3;
	const rotY = Math.sin(elapsedTime * 1.2) * 0.3;
	stars.rotation.x = rotX;
	stars.rotation.y = rotY;
	// Animate only on start
	textGroup.rotation.x = rotX;
	textGroup.rotation.y = rotY;

    //Animate colours
    const cAnim = Math.sin(elapsedTime * 0.25)
    const colors = new THREE.Vector3(0.3 + cAnim, 0.7 - cAnim, 0.67 + cAnim)
    // elapsedTime < 1 && console.log(colors)
    textMaterial.uniforms.uColor.value = colors

    starsMaterial.color.setRGB(0.3 + cAnim, 0.7 - cAnim, 0.67 + cAnim)

    // Animate camera movements
	const ease = 0.03;
	camera.position.x += (mouseX - camera.position.x) * ease;
	camera.position.y += (mouseY * -1 - camera.position.y) * ease;
	camera.lookAt(scene.position);

    

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()