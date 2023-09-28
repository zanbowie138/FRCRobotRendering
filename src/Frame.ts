import * as THREE from 'three';
import {WebGL} from './WebGL';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder }from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import Stats from 'stats.js'


export class Frame extends WebGL {
    constructor() {
        // Initialize WebGL class
        super();

        this.loadGLTF();
    }

    private loadGLTF() {
        const loader = new GLTFLoader();
        loader.setMeshoptDecoder(MeshoptDecoder);

        // Get progress bar with tag "progressBar"
        const progressBar = document.getElementById(
            'progressBar'
        ) as HTMLProgressElement
        const label = document.getElementById(
            'progressBarLabel'
        ) as HTMLProgressElement
        
        // Hide canvas until loading is finished
        this.renderer.domElement.style.display = 'none';

        // Initially set progress bar value to zero
        progressBar.value = 0;

        label.textContent = "Loading... 0%"

        // Load a glTF resource
        loader.load(
            // resource URL
            'models/robot/robot_compressed.gltf',

            // called when the resource is loaded
            ( gltf ) => {
                progressBar.style.display = 'none';
                this.renderer.domElement.style.display = 'block';
                label.style.display = 'none';

                gltf.scene.scale.setScalar(3); // scale by 3
                gltf.scene.rotation.x = -Math.PI/2;   // rotate the model

                var box = new THREE.Box3().setFromObject( gltf.scene );
                
                var center = new THREE.Vector3();
                box.getCenter( center );

                gltf.scene.position.sub( new THREE.Vector3(center.x, 0, center.z) ); // center the x and z
                
                // var boxHelper = new THREE.Box3Helper(box);
                // this.scene.add(boxHelper);
                this.scene.add( gltf.scene );

                this.init();
            },
            // called while loading is progressing
            function ( xhr ) {
                const percentComplete = (xhr.loaded / xhr.total) * 100

                // Update progress bar
                progressBar.value = percentComplete === Infinity ? 100 : percentComplete;
                label.textContent = "Loading... " + percentComplete + "%";
            },
            // called when loading has errors
            function ( error ) {
                console.log(error);
                alert( error );

            }
        );
    }



    init() {
        var stats = new Stats();
        stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( stats.dom );
        
        this.scene.add(new THREE.AxesHelper(5))

        const controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.camera.position.set( 0, 2, 10 );
        controls.autoRotate = true;
        controls.update();

        this.renderer.shadowMap.enabled = true;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;

        this.scene.background = new THREE.Color( 0x4a4a4a );
        

        const ambient_light = new THREE.AmbientLight( 0xffffff, 0.5);
        this.scene.add(ambient_light);

        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 1 );
        hemiLight.position.set( 0, 20, 0 );
        this.scene.add( hemiLight );

        const point_light = new THREE.PointLight( 0xffffff, 10, 0, 1 );
        const pointLightHelper = new THREE.PointLightHelper(point_light, 0.5);
        point_light.position.set( 0, 5, 0 );
        point_light.castShadow = true;
        this.scene.add( point_light, pointLightHelper );

        const anim = () => {
            stats.begin();
            controls.update();
            
            this.renderer.render(this.scene, this.camera)
            stats.end();
        }

        this.requestAnimationFrame(anim)
    }
}