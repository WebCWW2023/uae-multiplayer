import * as THREE from "three";
import { bannerMeshArray, bannerNameArray, scene } from "../game.js";

var texture1 = new THREE.TextureLoader().load("../static/texture/banner.jpg");
texture1.flipY = false;
texture1.minFilter = THREE.LinearFilter;

var texture2 = new THREE.TextureLoader().load(
  "../static/texture/fountain_alpha.png"
);
texture2.flipY = false;
texture2.minFilter = THREE.LinearFilter;

const glassMaterialNameArray = [
  // "glass",
  // "WINDOW_GLASS",
  // "Screen_Wall_Copy",
  // "Wall_Panal copy",
  // "Wall_Panal_1",
  // "Wall_Panal_2",
  // "GLASS_1",
  // "Back_Side_Copy",
  // "Wall_Panal_2",
  // "GLASS_1",
];

const banerMaterialNameArray = [
  "b1_b1",
  "b1_b2",
  "b1_b3",
  "b1_b4",
  "b1_b1.001",
  "b1_b2.001",
  "b1_b3.001",
  "b1_b4.001",
  "b1_b1.002",
  "b1_b2.002",
  "b1_b3.002",
  "b1_b4.002",
  "b1_b1.003",
  "b1_b2.003",
  "b1_b3.003",
  "b1_b4.003",
  "b1_b1.004",
  "b1_b2.004",
  "b1_b3.004",
  "b1_b4.004",
  "b1_b1.006",
  "b1_b2.006",
  "b1_b3.006",
  "b1_b4.006",
  "b1_b1.007",
  "b1_b2.007",
  "b1_b3.007",
  "b1_b4.007",
  "b1_b1.008",
  "b1_b2.008",
  "b1_b3.008",
  "b1_b4.008",
  "b1_b1.009",
  "b1_b2.009",
  "b1_b3.009",
  "b1_b4.009",
  "b1_b1.010",
  "b1_b2.010",
  "b1_b3.010",
  "b1_b4.010",
  "b1_b1.011",
  "b1_b2.011",
  "b1_b3.011",
  "b1_b4.011",
  "b1",
  "b1.001",
  "b1.002",
  "b1.003",
  "b1.004",
  "b1.005",
  "b1.006",
  "b1.007",
  "b1.008",
  "b1.009",
  "b1.010",
  "b1_b2.005",
  "b1_b1.005",
  "b1_b3.005",
  "b1_b4.005",
];
const UpdateMaterial = (objectArray) => {
  Object.values(objectArray).map((obj) => {
    // if (glassMaterialNameArray.includes(obj.material.name)) {
    //   obj.material.transparent = true;
    //   obj.material.opacity = 0.3;
    // }
    if (banerMaterialNameArray.includes(obj.material.name)) {
      obj.material.map = texture1;
      bannerMeshArray.push(obj);
    }
  });
};

export { UpdateMaterial };
