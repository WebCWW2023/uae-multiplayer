import * as THREE from "three";
import {
  characterYWalkingPosition,
  objectArray,
  playersPeer,
  socketName,
} from "../game.js";
import { characterMeshPosition } from "../Different/ObjectPosition.js";

let rayDownTarget = new THREE.Vector3(0, -Math.PI, 0);
rayDownTarget.normalize();

let rayForwardTargetVector = new THREE.Vector3(0, 0, 1);
let rayBackwordTargetVector = new THREE.Vector3(0, 0, -Math.PI);
let rayRightTargetVector = new THREE.Vector3(-1, 0, 0);
let rayLeftTargetVector = new THREE.Vector3(0, 0, 1);

var cameraRaycasterForward,
  cameraRaycasterBackward,
  cameraRaycasterLeft,
  cameraRaycasterRight,
  cameraRaycasterDown,
  forwardIntersectedObjects,
  backwardIntersectedObjects,
  leftIntersectedObjects,
  rightIntersectedObjects,
  downIntersectedObjects,
  colliderDistanceFB = 2.0,
  colliderDistanceLR = 2.0;

/*-----------------collisionDetection-------------------*/
const WalkCollision = (enableForward, enableBackward, direction) => {
  /*-----------------ray collider-------------------*/
  let cubeMesh = playersPeer[socketName].children[0];
  let cubeMeshPosition = playersPeer[socketName].children[0].position;
  /*-----------------down-------------------*/
  cameraRaycasterDown = new THREE.Raycaster(cubeMeshPosition, rayDownTarget);
  /*-----------------forward-------------------*/
  let rayTargetForward = playersPeer[
    socketName
  ].children[0].children[1].getWorldDirection(
    new THREE.Vector3(rayForwardTargetVector)
  );
  rayTargetForward.normalize();
  cameraRaycasterForward = new THREE.Raycaster(
    cubeMeshPosition,
    rayTargetForward
  );
  /*-----------------backward-------------------*/
  let rayTargetBackward = playersPeer[socketName].children[0].getWorldDirection(
    rayBackwordTargetVector
  );
  rayTargetBackward.normalize();
  cameraRaycasterBackward = new THREE.Raycaster(
    cubeMeshPosition,
    rayTargetBackward
  );

  /*------------------------------------*/
  if (objectArray && objectArray.length) {
    forwardIntersectedObjects =
      cameraRaycasterForward.intersectObjects(objectArray);
    backwardIntersectedObjects =
      cameraRaycasterBackward.intersectObjects(objectArray);

    downIntersectedObjects = cameraRaycasterDown.intersectObjects(objectArray);

    if (downIntersectedObjects && downIntersectedObjects.length) {
      playersPeer[socketName].children[0].position.y =
        downIntersectedObjects[0].point.y + characterYWalkingPosition;
    } else {
      // playersPeer[socketName].children[0].position.copy(characterMeshPosition)
    }
    if (
      forwardIntersectedObjects &&
      forwardIntersectedObjects.length &&
      forwardIntersectedObjects[0].distance < colliderDistanceFB
    ) {
      enableForward = false;
      enableBackward = true;
    } else if (
      backwardIntersectedObjects &&
      backwardIntersectedObjects.length &&
      backwardIntersectedObjects[0].distance < colliderDistanceFB
    ) {
      enableBackward = false;
      enableForward = true;
    } else {
      enableBackward = true;
      enableForward = true;
    }
  }

  return [enableForward, enableBackward];

  // arrowHelperM(cubeMeshPosition, rayDownTarget);
  // arrowHelperM(cubeMeshPosition, rayTargetForward);
  // arrowHelperM(cubeMeshPosition, rayTargetBackward);
};

export { WalkCollision };
