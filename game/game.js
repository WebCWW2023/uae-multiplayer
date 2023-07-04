const socket = io();
var socketName;
var myVoiceId;
/*-----------------canvas-------------------*/
import * as THREE from "three";
import * as DAT from "../cdn/newadded/dat.js";
import { GLTFLoader } from "../cdn/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "../cdn/jsm/loaders/DRACOLoader.js";
import { FBXLoader } from "../cdn/jsm/loaders/fbx_lib/FBXLoader.js";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "../cdn/jsm/renderers/CSS2DRenderer.js";
import {
  ambientLightM,
  directionalLightM,
  hemisphereLightM,
} from "./Light.js";
import { resizeM } from "./Resize.js";
import { sceneM } from "./Scene.js";
import { remoteUser, startBasicCall, startVoice } from "./voice/voice.js";
import { changeAnimation } from "./animation/ChangeAnimation.js";
import { UpdateMaterial } from "./Different/UpdateMaterial.js";
import { CharAnimation, JumpAnimation } from "./animation/CharAnimation.js";
import { ChangeView } from "./common/ChangeView.js";
import { addObjectToArray, UpdateMesh } from "./Different/UpdateMesh.js";
import { characterMeshPosition, teleportNameArray } from "./Different/ObjectPosition.js";
import { LightProbeGenerator } from '../cdn/jsm/LightProbeGenerator.js';
import { Water } from "../cdn/newadded/Water.js";
import { FullScreenM } from "./common/FullScreen.js";
import { Stats } from "../cdn/newadded/stats.js";
import { addBanner } from "./updateTexture/UpdateTexture.js";
import { createHeart } from "./common/CreateHeart.js";
import { saveFile } from "./common/screenshot.js";
import { positionGUI, rotationGUI, scaleGUI } from "./common/CommonFunction.js";

/*----------------- gui -------------------*/
var gui;
// gui = new DAT.GUI();
var lightGui = false;
var statsGui = false;
// gui.close();
/*-----------------url-------------------*/
let url_str = window.location.href;
let url = new URL(url_str);
let search_params = url.searchParams;
var avtarId = search_params.get("id");
var avtarName = search_params.get("name");
var isadmin = search_params.get("isadmin");
var roomName = search_params.get("room");
// var sceneid = search_params.get("scene");
var selectedBannername;

/*-----------------window-------------------*/
var globalUrl = 'https://digimetaverse.live/';
let notFound = '../static/texture/banner.jpg';
var strDownloadMime = "image/octet-stream";
const isMobile = /Mobi/.test(navigator.userAgent);
var canvas,
  renderer,
  labelRenderer,
  scene,
  mainModel,
  isScreenFull = false,
  isDoorClosed = true,
  isDoorOpening = false,
  keyboard = new THREEx.KeyboardState(),
  sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  modelMixer,
  modelAction,
  water,
  stats,
  dLight;

/*-----------------avtar-------------------*/
var walkspeed = 14.0;
var walkspeedFast = 20.0;
var walkRotateSpeed = 1.0;
var avtarViewCount = 0;
var isSpeed = false;
var avtarAnimation = "Idle";

var characterMeshRotation = {
  x: 0,
  y: 0,
  z: 0,
},
  characterMeshScale = {
    x: 0.5,
    y: 0.5,
    z: 0.5,
  },
  characterPosition = {
    x: 0,
    y: -1.2,
    z: 0,
  },
  avtarlabelPosition = {
    x: 0,
    y: 0.7,
    z: 0,
  },
  characterScale = {
    x: 1,
    y: 1,
    z: 1,
  },
  chracterCameraPosition = {
    x: 0,
    y: 0.6,
    z: 5.5,
  },
  characterYWalkingPosition = 1.2;
var animationsArray = {};
var characherMixerArray = {};
var isAnimationExist = false;
var isFirstTimeLoaded = true;
var isPlayerFirsttimeLoaded = true;
var loadingManager;
/*-----------------raycaster-------------------*/
var objectArray = [];
var playersPeer = {};
var playersPeerData = {};
var playersPeerToggle = {};

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

  enableForward = true,
  enableBackward = true,
  enableRight = true,
  enableLeft = true,

  colliderDistanceFB = 2.0,
  colliderDistanceLR = 2.0,
  arrowHelper;

/*-----------------camera-------------------*/
var mouse = new THREE.Vector2();
var camera,
  controls,
  cameraDistance = -5,
  targetCameraOffset = new THREE.Vector3(),
  cameraLerpFactor = 0.5,
  cameraOffset = new THREE.Vector3(0, 1.0, -cameraDistance),
  cameraPosition = { x: 0, y: 1.0, z: -cameraDistance };
/*-----------------animate-------------------*/
var clock = new THREE.Clock(),
  previousTime = 0;
let flagV = new THREE.Vector3();

/*-----------------group-------------------*/
var playerGroup = new THREE.Group();
playerGroup.name = "playerGroup";
var cityGroup = new THREE.Group();
cityGroup.name = "cityGroup";
var lightGroup = new THREE.Group();
lightGroup.name = "lightGroup";
var helperGroup = new THREE.Group();
helperGroup.name = "helperGroup";
var demoGroup = new THREE.Group();
demoGroup.name = "demoGroup";
var iframeGroup = new THREE.Group();
iframeGroup.name = "iframeGroup";
var heartsGroup = new THREE.Group();
heartsGroup.name = "heartsGroup";
/*-----------------texure-------------------*/
var bannerNameArray = [];
var bannerMeshArray = [];
var raycaster = new THREE.Raycaster();
var mouseRaycaster = new THREE.Raycaster();
/*-----------------joystick-------------------*/
var joystickX = 0,
  joystickY = 0;
var isJoystickTouched = false;
/*-----------------dom-------------------*/
var textureUpdate = document.querySelector(".textureUpdate");
var textureUpdateForm = document.querySelector(".textureUpdateForm");
var bannerImage = document.querySelector(".bannerImage");

var loadingScreenContainer = document.querySelector(".loadingScreenContainer");
var joystick = document.getElementById("joystick");
var stick = document.getElementById("stick");
var booster_button = document.querySelector(".booster_button");

var screenButtonToggle = document.querySelector(".screenButtonToggle");
var screenButtonBottom = document.querySelector(".screenButtonBottom");

var callButton = document.querySelector(".callButton");
var selfMute = document.querySelector(".selfMute");
var fullScreen = document.querySelector(".fullScreen");

var shortcutB = document.querySelector(".shortcutB");
var viewB = document.querySelector(".viewB");
var raiseB = document.querySelector(".raiseB");
var shakeB = document.querySelector(".shakeB");
var createEmoji = document.querySelector(".createEmoji");
var screenshot = document.querySelector(".screenshot");
var screenButtonsEmoji = document.querySelector(".screenButtonsEmoji");

const smallMap = document.querySelector(".smallMap");
const smallAvtar = document.querySelector(".smallAvtar");

var shorcutKeyScreen = document.querySelector(".shorcutKeyScreen");
const loadingCount = document.querySelector(".loadingCount");
const newPlayerJoin = document.querySelector(".newPlayerJoin");

const htmlEvents = () => {
  fullScreen.style.display = "flex";
  callButton.style.display = "none";
  selfMute.style.display = "flex";
  shorcutKeyScreen.style.display = "flex";
 screenButtonToggle.addEventListener("click", () => {
    if (screenButtonBottom.style.display !== "flex") {
      screenButtonBottom.style.display = "flex";
      screenButtonToggle.innerHTML = '<i class="fas fa-times"></i>';
    } else {
      screenButtonBottom.style.display = "none";
      screenButtonsEmoji.style.display = "none";
      screenButtonToggle.innerHTML =
        '<i class="fas fa-angle-double-right"></i>';
    }
  });

  document.addEventListener("keyup", function (e) {
    if (e.code === "KeyH") {
      shorcutKeyScreen.style.display = "flex";
    }
    if (e.code === "KeyV") { 
      [cameraPosition, avtarViewCount] = ChangeView(playersPeer[socketName], avtarViewCount); 
    }
    if (e.code === "KeyL") {
      let emojiname = "heart";
      function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      async function createHeartLoop() {
        for (let i = 0; i < 25; i++) {
          createHeart(
            emojiname,
            heartsGroup,
            playersPeer[socketName].children[0].position
          );
          await delay(100); // Wait for one second
        }
      }
      createHeartLoop();

      socket.emit("createEmoji", {
        emojiname: "heart",
        roomName: roomName,
        playerPosition: playersPeer[socketName].children[0].position,
      });
    }
    if (e.code === "KeyC") {
      var imgData;
      try {
        var strMime = "image/jpeg";
        imgData = renderer.domElement.toDataURL(strMime);
        saveFile(imgData.replace(strMime, strDownloadMime), "worldbeyond.jpg");
      } catch (e) {
        return;
      }
    }
    if (
      e.code === "ArrowUp" ||
      e.code === "ArrowDown" ||
      e.code === "ArrowLeft" ||
      e.code === "ArrowRight" ||
      e.code === "KeyW" ||
      e.code === "KeyA" ||
      e.code === "KeyS" ||
      e.code === "KeyD"
    ) {
      updatePlayerLocally("Idle");
      updatePlayerGloally("Idle");
    }
    if (e.code === "Digit1") {
      updatePlayerLocally("Hand_Raise");
      updatePlayerGloally("Hand_Raise");
    }
    if (e.code === "Digit2") {
      updatePlayerLocally("Hand_Shake");
      updatePlayerGloally("Hand_Shake");
    }
  });

  screenshot.addEventListener("click", (e) => {
    var imgData;
    try {
      var strMime = "image/jpeg";
      imgData = renderer.domElement.toDataURL(strMime);
      saveFile(imgData.replace(strMime, strDownloadMime), "worldbeyond.jpg");
    } catch (e) {
      return;
    }
  });
  callButton.addEventListener("click", (e) => {
    
  });
  shortcutB.addEventListener("click", (e) => {
    shorcutKeyScreen.style.display = "flex";
  });

  viewB.addEventListener("click", (e) => {
    [cameraPosition, avtarViewCount] = ChangeView(playersPeer[socketName], avtarViewCount);
  });
  raiseB.addEventListener("click", (e) => {
	  
		  startVoice();
    updatePlayerLocally("Hand_Raise");
    updatePlayerGloally("Hand_Raise");
  });
  shakeB.addEventListener("click", (e) => {
    updatePlayerLocally("Hand_Shake");
    updatePlayerGloally("Hand_Shake");
  });
  createEmoji.addEventListener("click", (e) => {
    if (screenButtonsEmoji.style.display == "flex") {
      screenButtonsEmoji.style.display = "none";
    } else {
      screenButtonsEmoji.style.display = "flex";
      const emojiButtons = document.querySelectorAll(".emojiButton");
      let emojiname;
      emojiButtons.forEach((button) => {
        button.addEventListener("click", () => {
          emojiname = button.getAttribute("title");
          if (emojiname) {
            const delay = (ms) => {
              return new Promise((resolve) => setTimeout(resolve, ms));
            };
            async function createHeartLoop() {
              for (let i = 0; i < 25; i++) {
                createHeart(
                  emojiname,
                  heartsGroup,
                  playersPeer[socketName].children[0].position
                );
                await delay(100);
              }
            }
            createHeartLoop();
            socket.emit("createEmoji", {
              emojiname: emojiname,
              roomName: roomName,
              playerPosition: playersPeer[socketName].children[0].position,
            });
          }
        });
      });
    }
  });

  /*-----------------fullscreen-------------------*/
  FullScreenM(fullScreen);
};

/*-----------------socket-------------------*/
socket.on("connect", () => {
  socketName = avtarName;
  /*-----------------add player-------------------*/
  socket.emit("addPlayer", {
    socket_id: socket.id,
    socketName2: socketName,
    position: characterMeshPosition,
    rotation: characterMeshRotation,
    color1: Math.random(),
    color2: Math.random() * 0.2 + 0.05,
    avtarId: avtarId,
    avtarName: avtarName,
    roomName: roomName,
    voiceId: null,
  });
});
socket.on('addVoiceId',(data)=>{ 
  myVoiceId=data.myVoiceId;
  console.log('ok myVoiceId',myVoiceId);
})
const init = () => {
  /*-----------------loadingManager-------------------*/
  loadingManager = new THREE.LoadingManager(
    // Loaded
    () => {
      loadingScreenContainer.style.display = "none";

      if (isMobile) {
        smallMap.style.display = "none";
        smallAvtar.style.display = "none";
        joystick.style.display = "block";
        booster_button.style.display = "block";
      }
      if (isFirstTimeLoaded) {
        bannerMeshArray = bannerNameArray.map((item) =>
          mainModel.scene.getObjectByName(item)
        );
        addBanner();
		 // startVoice();
        isFirstTimeLoaded = false;
      }
    },

    // Progress
    (itemUrl, itemsLoaded, itemsTotal) => {
      const progressRatio = itemsLoaded / itemsTotal;
      loadingCount.innerHTML = "Loading..." + Math.floor(progressRatio * 100) + "%";
      if (progressRatio === 1) {
        Object.keys(playersPeer).map(
          (key) => (playersPeer[key].visible = true)
        );
        loadingCount.style.display = "none";

      }
    }
  );
  /*-----------------load animations-------------------*/
  if (!isAnimationExist) {
    const aniLoader = new FBXLoader(loadingManager);
    CharAnimation('Idle', aniLoader, animationsArray)
    CharAnimation('Walking', aniLoader, animationsArray)
    CharAnimation('Running', aniLoader, animationsArray)
    CharAnimation('Hand_Raise', aniLoader, animationsArray)
    CharAnimation('Hand_Shake', aniLoader, animationsArray)
    CharAnimation('Sitting', aniLoader, animationsArray)
    CharAnimation('SittingF', aniLoader, animationsArray)
    isAnimationExist = true;
  }
  /*-----------------canvas-------------------*/
  canvas = document.querySelector("#canvas_floor");
  // const axesHelper = new THREE.AxesHelper(5);
  // scene.add(axesHelper);
  /*-----------------Renderer-------------------*/
  renderer = new THREE.WebGLRenderer({
    canvas,
    powerPreference: 'low-power',
    antialias: true,
    preserveDrawingBuffer: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMapSoft = true;
  renderer.shadowMap.enabled = isMobile ? true : true;

  labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0px";
  document.body.appendChild(labelRenderer.domElement);
  stats = Stats()
  statsGui && document.body.appendChild(stats.dom)
  /*-----------------Scene-------------------*/
  scene = sceneM('gui');
  camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    500
  );
  camera.position.set(0, 0, 3);

  /*-----------------light-------------------*/
  ambientLightM(gui, lightGroup, 0.5, 0x9c9c9c, lightGui);
  directionalLightM(gui, lightGroup, helperGroup, 0, 30, 0, 0, 0, 0, 0.4, 0xffffff, lightGui);
  hemisphereLightM(gui, lightGroup, 1, 0x7a5c43, 0x6b6b6b, lightGui);

  /*-----------------mainModel okg-------------------*/
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("../static/draco/");
  var gltfLoader = new GLTFLoader(loadingManager);
  gltfLoader.setDRACOLoader(dracoLoader);


  const glbLoader = (name) => {
    gltfLoader.load(
      `../static/models/glb/${name}.glb`,
      (gltf) => {
        mainModel = gltf;
        mainModel.scene.traverse((n) => {
          if (n.isMesh) {
            n.castShadow = true;
            n.receiveShadow = true;
            n.material.transparent = false;
            n.material.depthWrite = true;
            n.material.metalness = 0.6;
            n.material.roughness = 0.6;
            UpdateMaterial(n);
            addObjectToArray(n);
          }
        });

        // /*------------------------------------*/
        UpdateMesh(cityGroup, mainModel, gui);

        /*-----------------animation-------------------*/
        modelMixer = new THREE.AnimationMixer(mainModel.scene)
        for (let i = 0; i < mainModel.animations.length; i++) {
          modelAction = modelMixer.clipAction(mainModel.animations[i])
          modelAction.play();
        }
        /*------------------------------------*/
        cityGroup.add(mainModel.scene);


      },
      (xhr) => {
        let total = xhr.loaded / xhr.total * 100;
        if (total === 100) {
          /*-----------------probe-------------------*/
          const genCubeUrls = function (prefix, postfix) {
            return [
              prefix + 'px' + postfix, prefix + 'nx' + postfix,
              prefix + 'py' + postfix, prefix + 'ny' + postfix,
              prefix + 'pz' + postfix, prefix + 'nz' + postfix
            ];
          };
          const urls = genCubeUrls('../static/texture/env/2/', '.png');
          new THREE.CubeTextureLoader().load(urls, function (cubeTexture) {
            cubeTexture.encoding = THREE.sRGBEncoding;
            scene.background = cubeTexture;
            let lightProbe = new THREE.LightProbe();
            lightProbe.copy(LightProbeGenerator.fromCubeTexture(cubeTexture));
            lightProbe.intensity = 2;
            lightGui && gui.add(lightProbe, 'intensity', 0, 10, 0.1)
            lightGroup.add(lightProbe);
          });
          /*-----------------water-------------------*/
          const waterGeometry = new THREE.PlaneGeometry(40, 40);
          water = new Water(
            waterGeometry,
            {
              textureWidth: 512,
              textureHeight: 512,
              waterNormals: new THREE.TextureLoader().load('../static/images/water.jpg', function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
              }),
              waterColor: 0x000,
              distortionScale: 0,
            }
          );
          water.rotation.x = - Math.PI / 2;
          water.rotation.z = 11;
          water.position.set(0, -3.6, 0);
          water.scale.set(39.6, 46.6, 1);
          water.name = 'water';
          cityGroup.add(water);
          /*------------------------------------*/
          dLight = scene.getObjectByName('dayDirectionalLight')

        }
      }
      // (error) => {
      //   alert('refresh the page');
      // }
    );
  };
  glbLoader('model');


  /*-----------------mousemove events-------------------*/

  window.addEventListener("click", (e) => {
    if (playersPeer[socketName]) {
      mouse.x = (e.clientX / sizes.width) * 2 - 1;
      mouse.y = -(e.clientY / sizes.height) * 2 + 1;
      raycaster.setFromCamera(
        mouse,
        camera
      );
      const textureUpdateRayCaster =
        raycaster.intersectObjects(bannerMeshArray);
      if (textureUpdateRayCaster.length > 0) {
        const changeTexture = (name) => {
          if (textureUpdateRayCaster[0].object.name === `${name}`) {
            textureUpdate.style.display = "block";
            selectedBannername = name;
            isadmin != "true" && (textureUpdateForm.style.display = "none");
            var textureImg = new Image();
            textureImg.src = `${globalUrl}/assets/images/texture/${roomName}/${textureUpdateRayCaster[0].object.name}.jpeg`;
            textureImg.onerror = function () {
              bannerImage.setAttribute('src', notFound);
            };
            textureImg.onload = function () {
              bannerImage.setAttribute('src', textureImg.src);
            };

          }
        };
        for (let index = 0; index < bannerMeshArray.length; index++) {
          changeTexture(bannerMeshArray[index].name, index + 1);
        }
      }
    }
  });
  !isMobile && window.addEventListener("dblclick", (e) => {
    mouse.x = (e.clientX / sizes.width) * 2 - 1;
    mouse.y = -(e.clientY / sizes.height) * 2 + 1;
    mouseRaycaster.setFromCamera(
      mouse,
      camera
    );
    let intersects = mouseRaycaster.intersectObjects(objectArray);
    if (intersects.length > 0 && teleportNameArray.includes(intersects[0].object.name)) {
      let playerNewPosition = {
        x: intersects[0].point.x,
        y: intersects[0].point.y + characterYWalkingPosition,
        z: intersects[0].point.z,
      }
      playersPeer[socketName].children[0].position.copy(playerNewPosition);
      updatePlayerLocally('Idle');
      updatePlayerGloally('Idle');
    }
  })
  let lastTouchTime = 0;
  isMobile &&
    window.addEventListener(
      "touchstart",
      function (event) {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastTouchTime;
        if (timeDiff < 300) {
          mouseRaycaster.setFromCamera(
            mouse,
            camera
          );
          let intersects = mouseRaycaster.intersectObjects(objectArray);
          if (
            intersects.length > 0 &&
            teleportNameArray.includes(intersects[0].object.name)
          ) {
            let playerNewPosition = {
              x: intersects[0].point.x,
              y: intersects[0].point.y + characterYWalkingPosition,
              z: intersects[0].point.z,
            };
            playersPeer[socketName].children[0].position.copy(
              playerNewPosition
            );
            updatePlayerLocally("Idle");
            updatePlayerGloally("Idle");
          }
        }
        lastTouchTime = currentTime;
      },
      { passive: false }
    );

  /*-----------------add player-------------------*/

  socket.on("addPlayer", function (players) {

    const addClient = (data) => {
      if (!isFirstTimeLoaded && data.avtarName && data.avtarName !== avtarName) {
        newPlayerJoin.style.display = "block";
        newPlayerJoin.innerHTML = data.avtarName + " has joined";
        setTimeout(function () {
          newPlayerJoin.style.display = "none";
        }, 2000);
      }
      let fbxLoader = new FBXLoader(loadingManager);
      fbxLoader.load(
        `../static/models/avtar/${data.avtarId}.fbx`,
        (characterFbx) => {
          let characterMesh = new THREE.Mesh(
            new THREE.BoxGeometry(
              characterMeshScale.x,
              characterMeshScale.y,
              characterMeshScale.z
            ),
            new THREE.MeshStandardMaterial({
              transparent: true,
              opacity: 0,
            })
          );
          characterMesh.name = data.avtarName;

          characterMesh.position.copy(data.position);
          if (
            Object.keys(data.rotation).length &&
            data.socketName2 !== socketName
          ) {
            characterMesh.rotation.copy(data.rotation);
          } else {
            characterMesh.rotation.set(0, 0, 0);
          }
          let characterHeadName = document.createElement("div");
          characterHeadName.className = "avtarLabel";
          characterHeadName.textContent = data.avtarName;
          let avtarLabel2 = new CSS2DObject(characterHeadName);
          if (data.socketName2 !== socketName) {
            avtarLabel2.position.set(0, 0.8, 0);
          } else {
            avtarLabel2.position.copy(avtarlabelPosition);
          }
          avtarLabel2.name = "avtarlabel" + data.socketName2;
          characterMesh.add(avtarLabel2);

          /*-----------------characterFbx-------------------*/
          characterFbx.rotateY(Math.PI);
          characterFbx.name = "person" + socketName;
          characterFbx.scale.copy(characterScale);
          characterFbx.position.copy(characterPosition);
          characterMesh.add(characterFbx);

          /*-----------------ani charani-------------------*/
          let cm = new THREE.AnimationMixer(characterFbx);
          characherMixerArray[data.socketName2] = cm;
          if (data.animationName && data.animationName === "Sitting") {
            let a = characherMixerArray[data.socketName2];
            changeAnimation(a, animationsArray, data.animationName, false);
          } else if (
            data.animationName &&
            data.animationName === "SittingF"
          ) {
            let a = characherMixerArray[data.socketName2];
            changeAnimation(a, animationsArray, data.animationName, false);
          } else {
            let a = characherMixerArray[data.socketName2];
            changeAnimation(a, animationsArray, "Idle", false);
          }
          let playerGroup = new THREE.Group();
          playerGroup.name = data.avtarName;
          if (data.socketName2 !== socketName) {
            objectArray.push(characterMesh);
          }

          playerGroup.add(characterMesh);
          playerGroup.socketName2 = data.socketName2;
          scene.add(playerGroup);

          playersPeer[data.socketName2] = playerGroup;

        }
      );
    };
    Object.keys(players).map((playerKey) => {
      if (!Object.keys(playersPeer).includes(playerKey)) {
        addClient(players[playerKey]);
      }
    });
  });

  /*-----------------removePlayer-------------------*/


  socket.on("removePlayer", function (data) {
    let r = scene.getObjectByName("avtarlabel" + data.socketName2);
    playersPeer[data.socketName2] && playersPeer[data.socketName2].children[0].remove(r);
    scene.remove(playersPeer[data.socketName2]);
    delete playersPeer[data.socketName2];
    delete playersPeerData[data.socketName2];
    delete playersPeerToggle[data.socketName2];
    objectArray = objectArray.filter((item) => item.name !== data.socketName2);
  });



  /*-----------------oka updatePlayer-------------------*/
  socket.on("updatePlayer", function (data) {
    let a = characherMixerArray[data.socketName2];
    if (playersPeerToggle[data.socketName2] == undefined) {
      playersPeerToggle[data.socketName2] = {};
      playersPeerToggle[data.socketName2].idle = true;
      playersPeerToggle[data.socketName2].walking = true;
      playersPeerToggle[data.socketName2].running = true;
    } else {
      if (data.animation === "Idle" && playersPeerToggle[data.socketName2].idle) {
        changeAnimation(a, animationsArray, "Idle", false);
        playersPeerToggle[data.socketName2].idle = false;
        playersPeerToggle[data.socketName2].walking = true;
        playersPeerToggle[data.socketName2].running = true;
      }
      else if (data.animation === "Walking" && playersPeerToggle[data.socketName2].walking) {
        changeAnimation(a, animationsArray, "Walking", false);
        playersPeerToggle[data.socketName2].idle = true;
        playersPeerToggle[data.socketName2].walking = false;
        playersPeerToggle[data.socketName2].running = true;
      }
      else if (data.animation === "Running" && playersPeerToggle[data.socketName2].running) {
        changeAnimation(a, animationsArray, "Running", false);
        playersPeerToggle[data.socketName2].idle = true;
        playersPeerToggle[data.socketName2].walking = true;
        playersPeerToggle[data.socketName2].running = false;
      }
      else if (data.animation === "Sitting") {
        changeAnimation(a, animationsArray, "Sitting", false);
      }
      else if (data.animation === "SittingF") {
        changeAnimation(a, animationsArray, "SittingF", false);
      }
      else if (data.animation === "Hand_Raise") {
        changeAnimation(a, animationsArray, "Hand_Raise", true);
      }
      else if (data.animation === "Hand_Shake") {
        changeAnimation(a, animationsArray, "Hand_Shake", true);
      }
    }

    playersPeerData[data.socketName2] = data;
    if (playersPeer[socketName] && playersPeer[socketName].children[0]) {
	    console.log('ok 1',remoteUser);
      let distance = playersPeer[socketName].children[0].position.distanceTo(
        playersPeer[data.socketName2].children[0].position
      ); 
      if (Object.keys(remoteUser).length) { 
        if (distance < 8) {
          remoteUser[data.voiceId].play();
        } else {
          remoteUser[data.voiceId].stop();
        }
      }
    }
  });

  socket.on("createEmoji", (data) => {
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function createHeartLoop() {
      for (let i = 0; i < 25; i++) {
        createHeart(data.emojiname, heartsGroup, data.playerPosition);
        await delay(100); // Wait for one second
      }
    }
    createHeartLoop();
  });
  // oks
  scene.add(cityGroup);
  scene.add(lightGroup);
  scene.add(heartsGroup);
  scene.add(demoGroup)
  // scene.add(helperGroup)

  /*-----------------resize-------------------*/
  window.addEventListener("resize", function () {
    resizeM(camera, renderer, labelRenderer, socketName);
  });
  // console.clear();
};


/*-----------------oka updatePlayerLocally-------------------*/
const updatePlayerLocally = (animation) => {
	
  let a = characherMixerArray[socketName];
  if (playersPeerToggle[socketName] == undefined) {
    playersPeerToggle[socketName] = {};
    playersPeerToggle[socketName].idle = true;
    playersPeerToggle[socketName].walking = true;
    playersPeerToggle[socketName].running = true;
  } else {
    if (animation === "Idle" && playersPeerToggle[socketName].idle) {
      changeAnimation(a, animationsArray, "Idle", false);
      playersPeerToggle[socketName].idle = false;
      playersPeerToggle[socketName].walking = true;
      playersPeerToggle[socketName].running = true;
    }
    else if (animation === "Walking" && playersPeerToggle[socketName].walking) {
      changeAnimation(a, animationsArray, "Walking", false);
      playersPeerToggle[socketName].idle = true;
      playersPeerToggle[socketName].walking = false;
      playersPeerToggle[socketName].running = true;
    }
    else if (animation === "Running" && playersPeerToggle[socketName].running) {
      changeAnimation(a, animationsArray, "Running", false);
      playersPeerToggle[socketName].idle = true;
      playersPeerToggle[socketName].walking = true;
      playersPeerToggle[socketName].running = false;
    }
    else if (animation === "Sitting") {
      changeAnimation(a, animationsArray, "Sitting", false);
    }
    else if (animation === "SittingF") {
      changeAnimation(a, animationsArray, "SittingF", false);
    }
    else if (animation === "Hand_Raise") {
      changeAnimation(a, animationsArray, "Hand_Raise", true);
    }
    else if (animation === "Hand_Shake") {
      changeAnimation(a, animationsArray, "Hand_Shake", true);
    }
  }
};

/*-----------------oka updatePlayerGloally-------------------*/
const updatePlayerGloally = (animation) => {
  socket.emit("updatePlayer", {
    socketName2: socketName,
    position: playersPeer[socketName].children[0].position,
    rotation: playersPeer[socketName].children[0].rotation,
    animation: animation,
    roomName: roomName,
  });
};


/*-----------------joystick-------------------*/

isMobile && joystick.addEventListener("touchmove", function (event) {
  event.preventDefault();
  let x = event.touches[0].pageX - joystick.offsetLeft - stick.offsetWidth / 2;
  let y = event.touches[0].pageY - joystick.offsetTop - stick.offsetHeight / 2;

  if (x < 0) x = 0;
  if (x > joystick.offsetWidth - stick.offsetWidth)
    x = joystick.offsetWidth - stick.offsetWidth;
  if (y < 0) y = 0;
  if (y > joystick.offsetHeight - stick.offsetHeight)
    y = joystick.offsetHeight - stick.offsetHeight;

  stick.style.left = x + "px";
  stick.style.top = y + "px";
  isJoystickTouched = true;
  getJoystickPosition();
});

isMobile && joystick.addEventListener("touchend", function (event) {
  stick.style.left = "25px";
  stick.style.top = "25px";
  isJoystickTouched = false;
  updatePlayerLocally("Idle");
  socket.emit("updatePlayer", {
    socketName2: socketName,
    position: playersPeer[socketName].children[0].position,
    rotation: playersPeer[socketName].children[0].rotation,
    animation: "Idle",
    roomName: roomName,
  });
});

function getJoystickPosition() {
  let x = parseInt(stick.style.left) - 25;
  let y = parseInt(stick.style.top) - 25;
  joystickX = x;
  joystickY = y;
}


/*-----------------animate-------------------*/
const animate = () => {
  let elapsedTime = clock.getElapsedTime();
  let deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  /*-----------------update player-------------------*/

  playersPeerData &&
    Object.keys(playersPeerData).map((item) => {
      playersPeer[item] && playersPeer[item].children[0].position.copy(
        playersPeerData[item].position
      );
      playersPeer[item] && playersPeer[item].children[0].rotation.copy(
        playersPeerData[item].rotation
      );
    });
  /*-----------------person animation-------------------*/
  if (characherMixerArray && Object.keys(characherMixerArray).length) {
    Object.keys(characherMixerArray).map((keys) => {
      characherMixerArray[keys].update(deltaTime);
    });
  }

  /*-----------------joystick-------------------*/
  if (isMobile && isJoystickTouched && playersPeer[socketName]) {
    booster_button.style.display = "block";
    if (joystickY < 0 && joystickX > -25 && joystickX < 25) {
      if (isSpeed) {
        booster_button.style.backgroundColor = "#f44336";
        enableForward &&
          playersPeer[socketName].children[0].translateZ(
            -walkspeedFast * deltaTime
          );
        collisionDetection("forward");
        updatePlayerLocally("Running");
        updatePlayerGloally("Running");
      } else {
        booster_button.style.backgroundColor = "#000000";
        enableForward &&
          playersPeer[socketName].children[0].translateZ(-walkspeed * deltaTime);
        collisionDetection("forward");
        updatePlayerLocally("Walking");
        updatePlayerGloally("Walking");
      }
      booster_button.addEventListener("touchstart", function (e) {
        isSpeed = true;
      });
      booster_button.addEventListener("touchend", function (e) {
        isSpeed = false;
      });
    } else if (joystickY > 0 && joystickX > -25 && joystickX < 25) {
      enableForward &&
        playersPeer[socketName].children[0].translateZ(+walkspeed * deltaTime);
      collisionDetection("forward");
      updatePlayerLocally("Walking");
      updatePlayerGloally("Walking");
    } else if (joystickX < 0 && joystickY > -25 && joystickY < 25) {
      playersPeer[socketName].children[0].rotateY(+walkRotateSpeed * deltaTime);
      updatePlayerLocally("Walking");
      updatePlayerGloally("Walking");
    } else if (joystickX > 0 && joystickY > -25 && joystickY < 25) {
      // right
      playersPeer[socketName].children[0].rotateY(-walkRotateSpeed * deltaTime);
      updatePlayerLocally("Walking");
      updatePlayerGloally("Walking");
    }
  } else {
    booster_button.style.display = "none";
  }
  /*-----------------keyboard-------------------*/
  if (playersPeer[socketName]) {
    let x = playersPeer[socketName].children[0].position.x / 8;
    let z = playersPeer[socketName].children[0].position.z / 8;
    smallAvtar.style.left = 90 + x + "px";
    smallAvtar.style.top = 90 + z + "px";
    dLight && (dLight.position.x = playersPeer[socketName].children[0].position.x + 10)
    dLight && (dLight.position.z = playersPeer[socketName].children[0].position.z + 10)
    dLight && (dLight.target = playersPeer[socketName].children[0])
    if (keyboard.pressed("shift")) {
      walkspeed = walkspeedFast;
      avtarAnimation = "Running";
    } else {
      walkspeed = walkspeed;
      avtarAnimation = "Walking";
    }
    if (keyboard.pressed("up") || keyboard.pressed("w")) {
      enableForward &&
        playersPeer[socketName].children[0].translateZ(-walkspeed * deltaTime);
      collisionDetection("forward");
      updatePlayerLocally(avtarAnimation);
      updatePlayerGloally(avtarAnimation);
    }
    if (keyboard.pressed("down") || keyboard.pressed("s")) {
      enableBackward &&
        playersPeer[socketName].children[0].translateZ(+walkspeed * deltaTime);
      collisionDetection("backward");
      updatePlayerLocally(avtarAnimation);
      updatePlayerGloally(avtarAnimation);
    }
    if (keyboard.pressed("left") || keyboard.pressed("a")) {
      collisionDetection("forward");
      enableLeft &&
        playersPeer[socketName].children[0].rotateY(
          +walkRotateSpeed * deltaTime
        );
      updatePlayerLocally(avtarAnimation);
      updatePlayerGloally(avtarAnimation);
    }
    if (keyboard.pressed("right") || keyboard.pressed("d")) {
      collisionDetection("forward");
      enableRight &&
        playersPeer[socketName].children[0].rotateY(
          -walkRotateSpeed * deltaTime
        );
      updatePlayerLocally(avtarAnimation);
      updatePlayerGloally(avtarAnimation);
    }
  }
  /*-----------------city-------------------*/
  if (water) {
    water.material.uniforms['time'].value += 1.0 / 60.0;
  }

  /*------------------------------------*/
  if (modelMixer) {
    modelMixer.update(deltaTime);
  }
  /*-----------------camera-------------------*/
  if (playersPeer[socketName] &&
    playersPeer[socketName].children.length) {
    targetCameraOffset.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    const cameraDirection = new THREE.Vector3(0, 0, -1);
    cameraDirection.applyQuaternion(playersPeer[socketName].children[0].quaternion);
    targetCameraOffset.applyQuaternion(playersPeer[socketName].children[0].quaternion);
    targetCameraOffset.add(playersPeer[socketName].children[0].position);
    cameraOffset.lerp(targetCameraOffset, cameraLerpFactor);
    camera.position.copy(cameraOffset);
    camera.lookAt(playersPeer[socketName].children[0].position.x, playersPeer[socketName].children[0].position.y + 0.8, playersPeer[socketName].children[0].position.z);
  }
  /*------------------------------------*/
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);

  requestAnimationFrame(animate);
  stats.update()

};

/*-----------------collisionDetection-------------------*/
const collisionDetection = (direction) => {
  /*-----------------ray collider-------------------*/
  if (playersPeer[socketName]) {
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
    let rayTargetBackward =
      playersPeer[socketName].children[0].getWorldDirection(rayBackwordTargetVector);
    rayTargetBackward.normalize();
    cameraRaycasterBackward = new THREE.Raycaster(
      cubeMeshPosition,
      rayTargetBackward
    );

    /*-----------------left-------------------*/
    let rayTargetLeft = cubeMesh.getWorldDirection(rayLeftTargetVector);
    rayTargetLeft.applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI * 0.5);
    rayTargetLeft.normalize();
    cameraRaycasterLeft = new THREE.Raycaster(
      cubeMeshPosition,
      rayTargetLeft
    );
    /*-----------------right-------------------*/
    let rayTargetRight = cubeMesh.getWorldDirection(rayRightTargetVector);
    rayTargetRight.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 0.5);
    rayTargetRight.normalize();
    cameraRaycasterRight = new THREE.Raycaster(
      cubeMeshPosition,
      rayTargetRight
    );

    /*------------------------------------*/
    if (objectArray && objectArray.length) {
      forwardIntersectedObjects = cameraRaycasterForward.intersectObjects(objectArray);
      backwardIntersectedObjects = cameraRaycasterBackward.intersectObjects(objectArray);
      leftIntersectedObjects = cameraRaycasterLeft.intersectObjects(objectArray);
      rightIntersectedObjects = cameraRaycasterRight.intersectObjects(objectArray);
      downIntersectedObjects = cameraRaycasterDown.intersectObjects(objectArray);

      if (downIntersectedObjects && downIntersectedObjects.length) {
        if (downIntersectedObjects[0].object.name === "Rectangle071") {
          playersPeer[socketName].children[0].position.copy(characterMeshPosition);
        } else {
          playersPeer[socketName].children[0].position.y = downIntersectedObjects[0].point.y + characterYWalkingPosition;
        }
      }
      else {
        playersPeer[socketName].children[0].position.copy(characterMeshPosition);
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
  }
};
htmlEvents();
init();
animate();
startBasicCall();

export {
  socket,
  mainModel,
  isadmin,
  bannerNameArray,
  bannerMeshArray,
  selectedBannername,
  objectArray,
  scene,
  globalUrl
};
