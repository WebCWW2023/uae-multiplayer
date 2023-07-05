import * as THREE from "three";
// import { positionGUI, scaleGUI } from "../common/CommonFunction.js";
import { objectArray, scene } from "../game.js";

// let glassColor = new THREE.Color(0x575757);
let glassOpacity = 0.4;
const UpdateMesh = (gui) => {
  // let glassObjectsNames = [
  //   "exterior001",
  // ];
  // glassObjectsNames.map((item) => {
  //   let glassObject = scene.getObjectByName(item);
  //   glassObject.material = new THREE.MeshBasicMaterial({
  //     transparent: true,
  //     opacity: glassOpacity,
  //   });
  // });
};

const addObjectToArray = (object) => {
  switch (object.material.name) {
    case "tree_03":
      break;
    case "Tree_Bamboo":
      break;
    case "017_Tree":
      break;
    case "020_Tree":
      break;
    case "Shrub":
      break;
    case "02_tree":
      break;
    default:
      objectArray.push(object);
      break;
  }
};
export { UpdateMesh, addObjectToArray };
