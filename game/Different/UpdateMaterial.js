import * as THREE from "three";
import { bannerNameArray } from "../game.js";

var texture1 = new THREE.TextureLoader().load('../static/texture/banner.jpg');
texture1.flipY = false;
texture1.minFilter = THREE.LinearFilter;
var texture2 = new THREE.TextureLoader().load('../static/texture/banner2.jpg');
texture2.flipY = false;
texture2.minFilter = THREE.LinearFilter;

let glassColor = new THREE.Color(0x575757);
const banner1_material1 = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide });
const hoardingMaterial_1 = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide });
const hoardingMaterial_2 = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide });
const hoardingMaterial_3 = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide });
const hoardingMaterial_4 = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide });
const hoardingMaterial_5 = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide });
const hoardingMaterial_6 = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide });
const hoardingMaterial_7 = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide });
const hoardingMaterial_8 = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide });
const hoardingMaterial_9 = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide });

const UpdateMaterial = (object) => {
    switch (object.material.name) {

        /*-----------------booth-------------------*/
        case 'b1_b1':
            object.material.map = texture1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b2':
            object.material.map = texture1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b3':
            object.material.map = texture1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b4':
            object.material.map = texture1;
            bannerNameArray.push(object.name);
            break;

        case 'b1_b1.001':
            object.material.map = texture1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b2.001':
            object.material.map = texture1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b3.001':
            object.material.map = texture1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b4.001':
            object.material.map = texture1;
            bannerNameArray.push(object.name);
            break;

        case 'b1_b1.002':
            object.material.map = texture1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b2.002':
            object.material.map = texture1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b3.002':
            object.material.map = texture1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b4.002':
            object.material.map = texture1;
            bannerNameArray.push(object.name);
            break;

        case 'b1_b1.003':
            object.material.map = texture1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b2.003':
            object.material.map = texture1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b3.003':
            object.material = banner1_material1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b4.003':
            object.material = banner1_material1;
            bannerNameArray.push(object.name);
            break;

        case 'b1_b1.004':
            object.material.map = texture1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b2.004':
            object.material.map = texture1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b3.004':
            object.material.map = texture1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b4.004':
            object.material.map = texture1;
            bannerNameArray.push(object.name);
            break;

        case 'b1_b1.006':
            object.material = banner1_material1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b2.006':
            object.material = banner1_material1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b3.006':
            object.material = banner1_material1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b4.006':
            object.material = banner1_material1;
            bannerNameArray.push(object.name);
            break;

        case 'b1_b1.007':
            object.material = banner1_material1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b2.007':
            object.material = banner1_material1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b3.007':
            object.material = banner1_material1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b4.007':
            object.material = banner1_material1;
            bannerNameArray.push(object.name);
            break;

        case 'b1_b1.008':
            object.material = banner1_material1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b2.008':
            object.material = banner1_material1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b3.008':
            object.material = banner1_material1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b4.008':
            object.material = banner1_material1;
            bannerNameArray.push(object.name);
            break;

        case 'b1_b1.009':
            object.material = banner1_material1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b2.009':
            object.material = banner1_material1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b3.009':
            object.material = banner1_material1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b4.009':
            object.material = banner1_material1;
            bannerNameArray.push(object.name);
            break;

        case 'b1_b1.010':
            object.material = banner1_material1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b2.010':
            object.material = banner1_material1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b3.010':
            object.material = banner1_material1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b4.010':
            object.material = banner1_material1;
            bannerNameArray.push(object.name);
            break;

        case 'b1_b1.011':
            object.material = banner1_material1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b2.011':
            object.material = banner1_material1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b3.011':
            object.material = banner1_material1;
            bannerNameArray.push(object.name);
            break;
        case 'b1_b4.011':
            object.material = banner1_material1;
            bannerNameArray.push(object.name);
            break;


        /*-----------------hoardings-------------------*/
        case 'b1':
            object.material = hoardingMaterial_1;
            bannerNameArray.push(object.name);
            break;
        case 'b1.001':
            object.material = hoardingMaterial_1;
            bannerNameArray.push(object.name);
            break;
        case 'b1.002':
            object.material = hoardingMaterial_1;
            bannerNameArray.push(object.name);
            break;
        case 'b1.003':
            object.material = hoardingMaterial_1;
            bannerNameArray.push(object.name);
            break;
        case 'b1.004':
            object.material = hoardingMaterial_1;
            bannerNameArray.push(object.name);
            break;
        case 'b1.005':
            object.material = hoardingMaterial_1;
            bannerNameArray.push(object.name);
            break;
        case 'b1.006':
            object.material = hoardingMaterial_1;
            bannerNameArray.push(object.name);
            break;
        case 'b1.007':
            object.material = hoardingMaterial_1;
            bannerNameArray.push(object.name);
            break;
        case 'b1.008':
            object.material = hoardingMaterial_1;
            bannerNameArray.push(object.name);
            break;
        case 'b1.009':
            object.material = hoardingMaterial_1;
            bannerNameArray.push(object.name);
            break;
        case 'b1.010':
            object.material = hoardingMaterial_1;
            bannerNameArray.push(object.name);
            break;

        default:
            break;
    }



}

export { UpdateMaterial }