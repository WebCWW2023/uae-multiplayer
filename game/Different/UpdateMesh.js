import * as THREE from "three";
import { positionGUI, scaleGUI } from "../common/CommonFunction.js";
import { objectArray } from "../game.js";

let glassColor = new THREE.Color(0x575757);
let glassOpacity = 0.4;
const UpdateMesh = (cityGroup, hall, gui) => {

    // let glassObjectsNames = ['Bu_202', 'Mod_101', 'Mod_302', 'Mod_401', 'Mod_501', 'Bu_209'];
    // glassObjectsNames.map(item => {
    //     let glassObject = hall.scene.getObjectByName(item);
    //     glassObject.material.transparent = true;
    //     glassObject.material.opacity = glassOpacity;
    // });
    // let transparentObjectNames = ['Object004', 'Arc003'];
    // transparentObjectNames.map(item => {
    //     let transparentObject = hall.scene.getObjectByName(item);
    //     transparentObject.material.transparent = true;
    //     transparentObject.material.opacity = 0;
    // });


    // var shop1_alpha = new THREE.TextureLoader().load('../../static/texture/shop1_alpha.png');
    // let shop1 = hall.scene.getObjectByName('Shop_03_011');
    // shop1.material.alphaMap = shop1_alpha;
    // shop1.material.transparent = true;
    // shop1.material.opacity = 1;
}

const addObjectToArray = (object) => {
    switch (object.material.name) {
        case 'tree_03':
            break;
        case 'Tree_Bamboo':
            break;
        case '017_Tree':
            break;
        case '020_Tree':
            break;
        case 'Shrub':
            break;
        case '02_tree':
            break;
        default:
            objectArray.push(object);
            break;
    }
}
export { UpdateMesh, addObjectToArray }
