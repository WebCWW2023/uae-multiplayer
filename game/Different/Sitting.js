import * as THREE from "three";
import { sittingMeshArray } from "../game.js";

const Sitting = (object, mainModel) => {
  switch (object.material.name) {
    case "chair":
      let chair = mainModel.scene.getObjectByName(object.name);
      sittingMeshArray.push(chair);
      break;
    default:
      break;
  }
};
export { Sitting, sittingMeshArray };
