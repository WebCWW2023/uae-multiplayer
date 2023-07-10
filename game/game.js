var socket = io();
var socketName;
var playerData;
/*-----------------import-------------------*/
import * as THREE from "three";
import * as DAT from "../cdn/newadded/dat.js";
import { GLTFLoader } from "../cdn/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "../cdn/jsm/loaders/DRACOLoader.js";
import { FBXLoader } from "../cdn/jsm/loaders/fbx_lib/FBXLoader.js";
import { KTX2Loader } from "../cdn/addons/KTX2Loader.js";
import { MeshoptDecoder } from "../cdn/addons/meshopt_decoder.module.js";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "../cdn/jsm/renderers/CSS2DRenderer.js";
import { ambientLightM, directionalLightM, hemisphereLightM } from "./Light.js";
import { resizeM } from "./Resize.js";
import { sceneM } from "./Scene.js";
import { remoteUser, startBasicCall, startVoice } from "./voice/voice.js";
import { UpdateMaterial } from "./Different/UpdateMaterial.js";
import { CharAnimation, JumpAnimation } from "./animation/CharAnimation.js";
import { ChangeView } from "./common/ChangeView.js";
import { addObjectToArray, UpdateMesh } from "./Different/UpdateMesh.js";
import {
  characterMeshPosition,
  teleportNameArray,
} from "./Different/ObjectPosition.js";
import { LightProbeGenerator } from "../cdn/jsm/LightProbeGenerator.js";
import { Water } from "../cdn/newadded/Water.js";
import { FullScreenM } from "./common/FullScreen.js";
import { Stats } from "../cdn/newadded/stats.js";
import { addBanner } from "./updateTexture/UpdateTexture.js";
import { createHeart } from "./common/CreateHeart.js";
import { saveFile } from "./common/screenshot.js";
import { positionGUI, rotationGUI, scaleGUI } from "./common/CommonFunction.js";
import { createSnowflake, randomRange } from "./animation/Snow.js";
import { Sitting } from "./Different/Sitting.js";
// import { AddPlayer } from "./common/AddPlayer.js";
import { WalkCollision } from "./common/WalkCollision.js";
import { CheckOrientation } from "./common/CheckOrientation.js";
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
var selectedBannername;

/*-----------------window-------------------*/
var isPopupOn = false;
var globalUrl = "https://digimetaverse.live/";
let notFound = "../static/texture/banner.jpg";
var strDownloadMime = "image/octet-stream";
var isMobile = /(Mobi)/i.test(navigator.userAgent);
var isTablet = /(Tablet|iPad)/i.test(navigator.userAgent);
var isIosTabWebview = !/safari/.test(window.navigator.userAgent.toLowerCase());
if (isTablet || isIosTabWebview) {
  isMobile = true;
}

var canvas,
  renderer,
  labelRenderer,
  scene,
  mainModel,
  keyboard = new THREEx.KeyboardState(),
  sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  modelMixer,
  modelAction,
  water,
  stats;

//camera
var camera2;
const direction = new THREE.Vector3();

/*-----------------avtar-------------------*/
var myPlayer;
var avtarAction = {};
var walkspeed = 5.0;
var walkspeedSlow = 5.0;
var walkspeedFast = 10.0;
var walkRotateSpeed = 1.0;
var avtarViewCount = 0;
var isSpeed = false;
var avtarAnimation = "Idle";

var characterMeshScale = {
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
  avtarlabelPositionOther = {
    x: 0,
    y: 0.8,
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
  };
var characterMeshRotation = {},
  characterYWalkingPosition = 1.2;

var animationsArray = {};
var isAnimationFirstTime = false;
var isFirstTimeLoaded = true;
var isFirstTimeMyPlayerLoading = true;
var isFirstTimeOtherPlayerLoading = true;
var characherMixerArray = {};
var isPlayerFirsttimeLoaded = true;
var sittingMeshArray = [];
var loadingManager;

/*-----------------city-------------------*/
var sittingLoaderMesh;
var isSitting = false;
var sittingLoaderMeshArray = [];
//raycaster
var objectArray = [];
var playersPeer = {};
var playersPeerData = {};
var playersPeerToggle = {};
var infoMeshArray = [];
var bannerMeshArray = [];

var enableForward = true,
  enableBackward = true,
  arrowHelper;

/*-----------------animate-------------------*/
var clock = new THREE.Clock(),
  previousTime = 0;

/*-----------------group-------------------*/
// var playerGroup = new THREE.Group();
// playerGroup.name = "playerGroup";
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
var snowGroup = new THREE.Group();
snowGroup.name = "snowGroup";
/*-----------------texure-------------------*/
var mouse = new THREE.Vector2();
var bannerNameArray = [];
var mouseRaycaster = new THREE.Raycaster();
/*-----------------joystick-------------------*/
var joystickX = 0,
  joystickY = 0,
  joystickAmount = 25;
var isJoystickTouched = false;
/*-----------------different-------------------*/
const snowflakes = [];
/*-----------------dom-------------------*/
var texturePopupClose = document.querySelector(".texturePopupClose");
var texturePopup = document.querySelector(".texturePopup");
var textureUpdateForm = document.querySelector(".textureUpdateForm");
var bannerImage = document.querySelector(".bannerImage");

const newPlayerJoin = document.querySelector(".newPlayerJoin");
var playerCount = document.querySelector(".playerCount");
var loadingScreenContainer = document.querySelector(".loadingScreenContainer");
var joystick = document.getElementById("joystick");
var stick = document.getElementById("stick");
var booster_button = document.querySelector(".booster_button");

var callButton = document.querySelector(".callButton");
var selfMute = document.querySelector(".selfMute");
var fullScreen = document.querySelector(".fullScreen");

var screenButtonToggle = document.querySelector(".screenButtonToggle");
var screenButtonBottom = document.querySelector(".screenButtonBottom");
var viewB = document.querySelector(".viewB");
var shortcutB = document.querySelector(".shortcutB");
var raiseB = document.querySelector(".raiseB");
var shakeB = document.querySelector(".shakeB");
var createEmoji = document.querySelector(".createEmoji");
var screenshot = document.querySelector(".screenshot");
var screenButtonsEmoji = document.querySelector(".screenButtonsEmoji");

const smallMap = document.querySelector(".smallMap");
const smallAvtar = document.querySelector(".smallAvtar");

var shorcutKeyScreen = document.querySelector(".shorcutKeyScreen");
const loadingCount = document.querySelector(".loadingCount");

const htmlEvents = () => {
  playerCount.style.display = "none";
  fullScreen.style.display = "flex";
  callButton.style.display = "none";
  selfMute.style.display = "flex";
  shorcutKeyScreen.style.display = "flex";

  texturePopupClose.addEventListener("click", () => {
    texturePopup.style.display = "none";
    setTimeout(() => {
      isPopupOn = false;
    }, 500);
  });

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
    if (!myPlayer) {
      return;
    }
    if (e.code === "KeyH") {
      shorcutKeyScreen.style.display = "flex";
    }
    if (e.code === "KeyV") {
      if (avtarViewCount === 3) {
        avtarViewCount = 0;
      }
      ChangeView(playersPeer[socketName], avtarViewCount);
      avtarViewCount++;
    }
    if (e.code === "KeyL") {
      let emojiname = "heart";
      function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      async function createHeartLoop() {
        for (let i = 0; i < 15; i++) {
          createHeart(emojiname, heartsGroup, myPlayer.position);
          await delay(100); // Wait for one second
        }
      }
      createHeartLoop();

      socket.emit("createEmoji", {
        emojiname: "heart",
        roomName: roomName,
        playerPosition: myPlayer.position,
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
  callButton.addEventListener("click", (e) => {});
  shortcutB.addEventListener("click", (e) => {
    shorcutKeyScreen.style.display = "flex";
  });

  viewB.addEventListener("click", (e) => {
    if (avtarViewCount === 3) {
      avtarViewCount = 0;
    }
    ChangeView(playersPeer[socketName], avtarViewCount);
    avtarViewCount++;
  });

  raiseB.addEventListener("click", (e) => {
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
              for (let i = 0; i < 15; i++) {
                createHeart(emojiname, heartsGroup, myPlayer.position);
                await delay(100);
              }
            }
            createHeartLoop();
            socket.emit("createEmoji", {
              emojiname: emojiname,
              roomName: roomName,
              playerPosition: myPlayer.position,
            });
          }
        });
      });
    }
  });

  /*-----------------fullscreen-------------------*/
  FullScreenM(fullScreen);
  /*-----------------css button-------------------*/
  if (isTablet || isIosTabWebview) {
    screenButtonToggle.style.display = "flex";
  }
};

const AddPlayer = (isme, isFirstTimeMyPlayerLoading, data) => {
  if (scene.getObjectByName(data.avtarName)) {
    let duplicatePlayer = scene.getObjectByName(data.avtarName);
    scene.remove(duplicatePlayer);
  } else {
    let fbxLoader;
    fbxLoader = isme ? new FBXLoader(loadingManager) : new FBXLoader();
    fbxLoader.load(
      `../../static/models/avtar/${data.avtarId}.fbx`,
      (characterFbx) => {
        characterFbx.traverse((n) => {
          if (n.isMesh) {
            n.material.shininess = 0;
          }
        });
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
        characterMesh.name = data.socketName2;

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
          avtarLabel2.position.copy(avtarlabelPositionOther);
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

        /*-----------------ani-------------------*/
        let cm = new THREE.AnimationMixer(characterFbx);
        characherMixerArray[data.socketName2] = cm;
        let playerAnimation;
        if (data.animationName === "Sitting") {
          playerAnimation = "Sitting";
        } else if (data.animationName === "SittingF") {
          playerAnimation = "SittingF";
        } else {
          playerAnimation = "Idle";
        }
        avtarAction[data.socketName2] = characherMixerArray[
          data.socketName2
        ].clipAction(animationsArray[playerAnimation].animations[0]);
        avtarAction[data.socketName2].play();

        let playerGroup = new THREE.Group();
        playerGroup.name = data.avtarName;
        if (data.socketName2 === socketName) {
          let camera = new THREE.PerspectiveCamera(
            35,
            window.innerWidth / window.innerHeight,
            1,
            300
          );
          camera.position.copy(chracterCameraPosition);
          characterMesh.add(camera);
        } else {
          objectArray.push(characterMesh);
        }

        playerGroup.add(characterMesh);
        scene.add(playerGroup);
        playersPeer[data.socketName2] = playerGroup;
        /*-----------------html-------------------*/
        playerCount.innerHTML = Object.keys(playersPeer).length;

        const playerLocationDiv = document.createElement("div");
        playerLocationDiv.className = "smallAvtar";
        if (data.socketName2 === avtarName) {
          playerLocationDiv.style.backgroundColor = "red";
        }
        playerLocationDiv.id = data.socketName2;
        smallMap.appendChild(playerLocationDiv);

        if (!isFirstTimeMyPlayerLoading && data.avtarName !== avtarName) {
          newPlayerJoin.style.display = "block";
          newPlayerJoin.innerHTML =
            data.avtarName.toUpperCase() + " has joined";
          setTimeout(function () {
            newPlayerJoin.style.display = "none";
          }, 2000);
        }
      }
    );
  }
};

const changeAnimation = (playerName, animationName) => {
  let nextAction = characherMixerArray[playerName].clipAction(
    animationsArray[animationName].animations[0]
  );
  nextAction.setEffectiveTimeScale(1);
  nextAction.setEffectiveWeight(1);
  avtarAction[playerName].fadeOut(0.5);
  nextAction.fadeIn(0.5);
  if (animationName == "Hand_Raise" || animationName == "Hand_Shake") {
    nextAction.timeScale = 1;
    nextAction.setLoop(THREE.LoopOnce, 1);
    nextAction.clampWhenFinished = true;
  }
  nextAction.play();
  avtarAction[playerName] = nextAction;
  avtarAction[playerName].reset();
};

CheckOrientation();
window.addEventListener("orientationchange", CheckOrientation);

const loadAni = () => {
  /*-----------------load animations-------------------*/
  if (!isAnimationFirstTime) {
    const aniLoader = new FBXLoader(loadingManager);
    CharAnimation("Idle", aniLoader, animationsArray);
    CharAnimation("Walking", aniLoader, animationsArray);
    CharAnimation("Running", aniLoader, animationsArray);
    CharAnimation("Hand_Raise", aniLoader, animationsArray);
    CharAnimation("Hand_Shake", aniLoader, animationsArray);
    CharAnimation("Sitting", aniLoader, animationsArray);
    CharAnimation("SittingF", aniLoader, animationsArray);
    isAnimationFirstTime = true;
  }
};

/*------------------------------------*/
const arrowHelperM = (origin, dir) => {
  let hex = 0xffff00;
  scene.remove(arrowHelper);
  arrowHelper = new THREE.ArrowHelper(dir, origin, 5, hex);
  scene.add(arrowHelper);
};

const init = () => {
  /*-----------------loadingManager-------------------*/
  const loadingCount = document.querySelector(".loadingCount");
  loadingManager = new THREE.LoadingManager(
    // Loaded
    () => {
      loadingScreenContainer.style.display = "none";
      if (isMobile) {
        smallMap.style.display = "none";
        joystick.style.display = "block";
        booster_button.style.display = "block";
      }
      if (isFirstTimeLoaded) {
        camera2 = playersPeer[socketName].children[0].children[2];
        myPlayer = playersPeer[socketName].children[0];
        UpdateMaterial(objectArray);
        addBanner();
         startVoice();
        socket.emit("getAllPlayerData", { roomName: roomName });
        isFirstTimeLoaded = false;
      }
    },

    // Progress
    (itemUrl, itemsLoaded, itemsTotal) => {
      const progressRatio = itemsLoaded / itemsTotal;
      loadingCount.innerHTML = Math.floor(progressRatio * 100) + "%";
      if (progressRatio === 1) {
        Object.keys(playersPeer).map(
          (key) => (playersPeer[key].visible = true)
        );
        loadingCount.style.display = "none";
      }
    }
  );
  loadAni();
  /*-----------------socket-------------------*/
  socket.on("connect", () => {
    socketName = avtarName;
    playerData = {
      socket_id: socket.id,
      socketName2: socketName,
      position: characterMeshPosition,
      rotation: characterMeshRotation,
      avtarId: avtarId,
      avtarName: avtarName,
      roomName: roomName,
      voiceId: null,
      animationName: "",
    };

    if (isFirstTimeMyPlayerLoading) {
      AddPlayer(true, isFirstTimeMyPlayerLoading, playerData);
      socket.emit("addMeToOther", playerData);
      isFirstTimeMyPlayerLoading = false;
    } else if (!isFirstTimeMyPlayerLoading) {
      /*-----------------add player-------------------*/
      socket.emit("addData", {
        socket_id: socket.id,
        socketName2: socketName,
        position: myPlayer.position,
        rotation: myPlayer.rotation,
        avtarId: avtarId,
        avtarName: avtarName,
        roomName: roomName,
        voiceId: null,
      });
    }
  });
  /*-----------------addMeToOther-------------------*/

  socket.on("addMeToOther", function (players) {
    AddPlayer(false, isFirstTimeLoaded, players);
  });
  socket.on("getAllPlayerData", (players) => {
    if (isFirstTimeOtherPlayerLoading) {
      Object.keys(players).map((playerKey) => {
        if (playerKey !== avtarName) {
          AddPlayer(false, isFirstTimeLoaded, players[playerKey]);
        }
      });
      isFirstTimeOtherPlayerLoading = false;
    }
  });
  /*-----------------canvas-------------------*/
  canvas = document.querySelector("#canvas_floor");
  // const axesHelper = new THREE.AxesHelper(5);
  // scene.add(axesHelper);
  /*-----------------Renderer-------------------*/

  renderer = new THREE.WebGLRenderer({
    canvas,
    powerPreference: "low-power",
    antialias: true,
    preserveDrawingBuffer: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMapSoft = true;
  renderer.shadowMap.enabled = isMobile ? false : false;

  labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0px";
  document.body.appendChild(labelRenderer.domElement);
  stats = Stats();
  statsGui && document.body.appendChild(stats.dom);
  /*-----------------Scene-------------------*/
  scene = sceneM("gui");

  /*-----------------light-------------------*/
  ambientLightM(gui, lightGroup, 1.1, 0xe2e3f8, lightGui);
  // hemisphereLightM(gui, lightGroup, 0.3, 0xc7dbf5, 0x8888aa, lightGui);

  // directionalLightM(
  //   gui,
  //   lightGroup,
  //   helperGroup,
  //   -30,
  //   250,
  //   0,
  //   0,
  //   0,
  //   0,
  //   1.0,
  //   0xffffff,
  //   lightGui
  // );

  /*-----------------mainModel okg-------------------*/
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("../static/draco/");
  // GLTF loader
  var gltfLoader = new GLTFLoader(loadingManager);
  gltfLoader.setDRACOLoader(dracoLoader);

  const ktx2Loader = new KTX2Loader()
    .setTranscoderPath("../cdn/addons/libs/basis/")
    .detectSupport(renderer);
  gltfLoader.setKTX2Loader(ktx2Loader);
  gltfLoader.setMeshoptDecoder(MeshoptDecoder);

  var glbCount = 1;
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
            n.material.metalness = 0.5;
            n.material.roughness = 0.6;
            addObjectToArray(n);
          }
        });

        /*-----------------animation-------------------*/
        modelMixer = new THREE.AnimationMixer(mainModel.scene);
        for (let i = 0; i < mainModel.animations.length; i++) {
          modelAction = modelMixer.clipAction(mainModel.animations[i]);
          modelAction.play();
        }
        /*-----------------water-------------------*/
        const waterGeometry = new THREE.CircleGeometry(2, 40);
        water = new Water(waterGeometry, {
          textureWidth: 512,
          textureHeight: 512,
          waterNormals: new THREE.TextureLoader().load(
            "https://raw.githubusercontent.com/IanUme/ThreejsTest/master/textures/waternormals.jpg",
            function (texture) {
              texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }
          ),
          waterColor: 0x6191a8,
          distortionScale: 3.7,
        });
        water.rotation.x = -Math.PI / 2;
        water.position.set(8.5, 0.43, 107.2);
        water.scale.set(1.5, 1.4, 1);
        cityGroup.add(water);
        /*------------------------------------*/
        cityGroup.add(mainModel.scene);
        /*------------------------------------*/
        // UpdateMesh(gui);
        /*-----------------sittingLoader-------------------*/
        const m1Geometry = new THREE.TetrahedronGeometry(0.2, 0);
        const m1Material = new THREE.MeshBasicMaterial({
          color: "#3CB043",
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.4,
        });

        sittingLoaderMesh = new THREE.Mesh(m1Geometry, m1Material);
        sittingLoaderMesh.rotation.x = Math.PI * 0.5;
        const sittingLoader = (x, y, z) => {
          const sittingLoader = sittingLoaderMesh.clone();
          sittingLoader.position.set(x, y - 0.6, z);
          sittingLoaderMeshArray.push(sittingLoader);
          cityGroup.add(sittingLoader);
        };
      },
      (xhr) => {
        let total = (xhr.loaded / xhr.total) * 100;
        if (total === 100) {
          /*-----------------env probe-------------------*/
          const genCubeUrls = function (prefix, postfix) {
            return [
              prefix + "px" + postfix,
              prefix + "nx" + postfix,
              prefix + "py" + postfix,
              prefix + "ny" + postfix,
              prefix + "pz" + postfix,
              prefix + "nz" + postfix,
            ];
          };
          const urls = genCubeUrls("../static/texture/env/0/", ".png");
          new THREE.CubeTextureLoader().load(urls, function (cubeTexture) {
            // cubeTexture.encoding = THREE.sRGBEncoding;
            scene.background = cubeTexture;
            let lightProbe = new THREE.LightProbe();
            lightProbe.copy(LightProbeGenerator.fromCubeTexture(cubeTexture));
            lightProbe.intensity = 1.5;
            lightGui && gui.add(lightProbe, "intensity", 0, 10, 0.1);
            lightGroup.add(lightProbe);
          });
        }
        /*-----------------snow-------------------*/
        // for (let i = 0; i < 300; i++) {
        //   createSnowflake(snowGroup, snowflakes);
        // }
      }
      // (error) => {
      //   alert('refresh the page');
      // }
    );
  };
  glbLoader("model");
  /*-----------------mousemove events-------------------*/

  window.addEventListener("click", (e) => {
    if (camera2 && !isPopupOn && playersPeer[socketName]) {
      mouse.x = (e.clientX / sizes.width) * 2 - 1;
      mouse.y = -(e.clientY / sizes.height) * 2 + 1;
      mouseRaycaster.setFromCamera(mouse, camera2);
      const textureUpdateRayCaster =
        mouseRaycaster.intersectObjects(bannerMeshArray);
      const sittingRayCaster =
        mouseRaycaster.intersectObjects(sittingMeshArray);
      const infoRayCaster = mouseRaycaster.intersectObjects(infoMeshArray);

      if (textureUpdateRayCaster.length > 0) {
        const changeTexture = (name) => {
          if (textureUpdateRayCaster[0].object.name === `${name}`) {
            texturePopup.style.display = "block";
            selectedBannername = name;
            isadmin != "true" && (textureUpdateForm.style.display = "none");
            var textureImg = new Image();
            textureImg.src = `${globalUrl}assets/images/texture/${roomName}/${textureUpdateRayCaster[0].object.name}.jpeg`;
            textureImg.onerror = function () {
              bannerImage.setAttribute("src", notFound);
            };
            textureImg.onload = function () {
              bannerImage.setAttribute("src", textureImg.src);
            };
          }
          isPopupOn = true;
        };
        for (let index = 0; index < bannerMeshArray.length; index++) {
          changeTexture(bannerMeshArray[index].name);
        }
      }
      /*-----------------sitting-------------------*/
      if (sittingRayCaster.length > 0) {
        // ChangeView(playersPeer[socketName], 0);
        // avtarViewCount = 1;

        const sittingM = (playersPeerData, x, y, z, xr, yr, zr) => {
          playersPeerData[socketName] = {
            socketName2: socketName,
            position: { x, y, z },
            rotation: new THREE.Euler(xr, yr, zr, "XYZ"),
          };
          // playersPeerData[socketName].position.y += 0.4;

          setTimeout(() => {
            if (
              [
                "1",
                "4",
                "5",
                "7",
                "8",
                "10",
                "11",
                "12",
                "13",
                "16",
                "20",
              ].includes(avtarId)
            ) {
              updatePlayerLocally("Sitting");
              updatePlayerGloally("Sitting");
            } else {
              updatePlayerLocally("SittingF");
              updatePlayerGloally("SittingF");
            }
            delete playersPeerData[socketName];
          }, 100);
          isSitting = true;
          sittingLoaderMeshArray.length &&
            sittingLoaderMeshArray.map((item) => {
              item.material.transparent = true;
              item.material.opacity = 0;
            });
        };
        switch (sittingRayCaster[0].object.name) {
          case "chair_Part008":
            sittingM(playersPeerData, -157.2, 1.3, 34.3, 0, 1.9, 0);
            break;

          case "chair_Part009":
            sittingM(playersPeerData, -156.8, 1.3, 35.9, 0, 1.7, 0);
            break;

          case "chair_Part014":
            sittingM(playersPeerData, -156.65, 1.3, 37.5, 0, 1.6, 0);
            break;

          case "chair_Part019":
            sittingM(playersPeerData, -156.62, 1.3, 39.15, 0, 1.5, 0);
            break;

          case "chair_Part024":
            sittingM(playersPeerData, -156.8, 1.3, 40.8, 0, 1.3, 0);
            break;

          case "chair_Part029":
            sittingM(playersPeerData, -157.2, 1.3, 42.45, 0, 1.13, 0);
            break;

          case "chair_Part034":
            sittingM(playersPeerData, -159.3, 1.3, 35.35, 0, 1.9, 0);
            break;

          case "chair_Part039":
            sittingM(playersPeerData, -159.08, 1.3, 36.95, 0, 1.7, 0);
            break;

          case "chair_Part044":
            sittingM(playersPeerData, -159, 1.3, 38.55, 0, 1.5, 0);
            break;

          case "chair_Part049":
            sittingM(playersPeerData, -159.1, 1.3, 40.25, 0, 1.35, 0);
            break;

          case "chair_Part054":
            sittingM(playersPeerData, -159.35, 1.3, 41.7, 0, 1.2, 0);
            break;

          case "chair_Part059":
            sittingM(playersPeerData, -161.1, 1.3, 36.4, 0, 1.85, 0);
            break;

          case "chair_Part064":
            sittingM(playersPeerData, -161, 1.3, 37.9, 0, 1.6, 0);
            break;

          case "chair_Part069":
            sittingM(playersPeerData, -160.95, 1.3, 39.4, 0, 1.45, 0);
            break;

          case "chair_Part074":
            sittingM(playersPeerData, -161.08, 1.3, 40.5, 0, 1.25, 0);
            break;

          case "chair_Part079":
            sittingM(playersPeerData, -162.55, 1.3, 36.85, 0, 1.82, 0);
            break;

          case "chair_Part084":
            sittingM(playersPeerData, -162.45, 1.3, 38.45, 0, 1.58, 0);
            break;

          case "chair_Part089":
            sittingM(playersPeerData, -162.6, 1.3, 40.15, 0, 1.3, 0);
            break;

          default:
            break;
        }
      }
    }
  });

  window.addEventListener("dblclick", (e) => {
    if (!isMobile && camera2) {
      mouse.x = (e.clientX / sizes.width) * 2 - 1;
      mouse.y = -(e.clientY / sizes.height) * 2 + 1;
      mouseRaycaster.setFromCamera(mouse, camera2);
      const intersects = mouseRaycaster.intersectObjects(objectArray);
      if (
        intersects.length > 0 &&
        teleportNameArray.includes(intersects[0].object.name)
      ) {
        let playerNewPosition = {
          x: intersects[0].point.x,
          y: intersects[0].point.y + characterYWalkingPosition,
          z: intersects[0].point.z,
        };
        playersPeer[socketName].children[0].position.copy(playerNewPosition);
        updatePlayerGloally("Idle");
      }
    }
  });
  let lastTouchTime = 0;
  isMobile &&
    window.addEventListener(
      "touchstart",
      function (event) {
        // if(isMobile && camera2)
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastTouchTime;
        if (timeDiff < 300) {
          mouseRaycaster.setFromCamera(mouse, camera2);
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
            updatePlayerGloally("Idle");
          }
        }
        lastTouchTime = currentTime;
      },
      { passive: false }
    );

  /*-----------------removePlayer-------------------*/
  socket.on("removePlayer", function (data) {
    let r = scene.getObjectByName("avtarlabel" + data.socketName2);
    playersPeer[data.socketName2] &&
      playersPeer[data.socketName2].children[0].remove(r);
    scene.remove(playersPeer[data.socketName2]);
    delete playersPeer[data.socketName2];
    delete playersPeerData[data.socketName2];
    delete playersPeerToggle[data.socketName2];
    delete avtarAction[data.socketName2];
    objectArray = objectArray.filter((item) => item.name !== data.socketName2);
    const divToDelete = document.querySelector(
      `.smallMap #${data.socketName2}`
    );
    if (divToDelete) {
      divToDelete.remove();
    }
    playerCount.innerHTML = Object.keys(playersPeer).length;
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
      if (
        data.animation === "Idle" &&
        playersPeerToggle[data.socketName2].idle
      ) {
        changeAnimation(data.socketName2, "Idle");
        playersPeerToggle[data.socketName2].idle = false;
        playersPeerToggle[data.socketName2].walking = true;
        playersPeerToggle[data.socketName2].running = true;
      } else if (
        data.animation === "Walking" &&
        playersPeerToggle[data.socketName2].walking
      ) {
        changeAnimation(data.socketName2, "Walking");
        playersPeerToggle[data.socketName2].idle = true;
        playersPeerToggle[data.socketName2].walking = false;
        playersPeerToggle[data.socketName2].running = true;
      } else if (
        data.animation === "Running" &&
        playersPeerToggle[data.socketName2].running
      ) {
        changeAnimation(data.socketName2, "Running");
        playersPeerToggle[data.socketName2].idle = true;
        playersPeerToggle[data.socketName2].walking = true;
        playersPeerToggle[data.socketName2].running = false;
      } else if (data.animation === "Sitting") {
        changeAnimation(data.socketName2, "Sitting");
      } else if (data.animation === "SittingF") {
        changeAnimation(data.socketName2, "SittingF");
      } else if (data.animation === "Hand_Raise") {
        changeAnimation(data.socketName2, "Hand_Raise");
      } else if (data.animation === "Hand_Shake") {
        changeAnimation(data.socketName2, "Hand_Shake");
      }
    }

    playersPeerData[data.socketName2] = data;

    if (playersPeer[socketName] && myPlayer) {
      let distance = myPlayer.position.distanceTo(
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
      return new Promise((resolve) => setTimeout(resolve, ms));
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
  // scene.add(snowGroup);
  // scene.add(demoGroup)
  // scene.add(helperGroup)
  scene.add(heartsGroup);

  /*-----------------resize-------------------*/
  window.addEventListener("resize", function () {
    (sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    }),
      resizeM(playersPeer, renderer, labelRenderer, socketName);
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
      changeAnimation(socketName, "Idle");
      playersPeerToggle[socketName].idle = false;
      playersPeerToggle[socketName].walking = true;
      playersPeerToggle[socketName].running = true;
    } else if (
      animation === "Walking" &&
      playersPeerToggle[socketName].walking
    ) {
      changeAnimation(socketName, "Walking");
      playersPeerToggle[socketName].idle = true;
      playersPeerToggle[socketName].walking = false;
      playersPeerToggle[socketName].running = true;
    } else if (
      animation === "Running" &&
      playersPeerToggle[socketName].running
    ) {
      changeAnimation(socketName, "Running");
      playersPeerToggle[socketName].idle = true;
      playersPeerToggle[socketName].walking = true;
      playersPeerToggle[socketName].running = false;
    } else if (animation === "Sitting") {
      changeAnimation(socketName, "Sitting");
    } else if (animation === "SittingF") {
      changeAnimation(socketName, "SittingF");
    } else if (animation === "Hand_Raise") {
      changeAnimation(socketName, "Hand_Raise");
    } else if (animation === "Hand_Shake") {
      changeAnimation(socketName, "Hand_Shake");
    }
  }
};

/*-----------------oka updatePlayerGloally-------------------*/

const updatePlayerGloally = (animation) => {
  myPlayer &&
    socket.emit("updatePlayer", {
      socketName2: socketName,
      position: myPlayer.position,
      rotation: myPlayer.rotation,
      animation: animation,
      roomName: roomName,
    });
};

/*-----------------joystick-------------------*/

isMobile &&
  joystick.addEventListener("touchmove", function (event) {
    event.preventDefault();
    let x =
      event.touches[0].pageX - joystick.offsetLeft - stick.offsetWidth / 2;
    let y =
      event.touches[0].pageY - joystick.offsetTop - stick.offsetHeight / 2;

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

isMobile &&
  joystick.addEventListener("touchend", function (event) {
    stick.style.left = "25px";
    stick.style.top = "25px";
    isJoystickTouched = false;
    updatePlayerLocally("Idle");
    socket.emit("updatePlayer", {
      socketName2: socketName,
      position: myPlayer.position,
      rotation: myPlayer.rotation,
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

  /*-----------------updatePlayer css-------------------*/
  if (Object.keys(playersPeer).length > 0) {
    Object.keys(playersPeer).map((playerName) => {
      const playerLocationDiv2 = document.getElementById(playerName);
      if (playerLocationDiv2) {
        let x = playersPeer[playerName].children[0].position.x / 2.5;
        let z = playersPeer[playerName].children[0].position.z / 2.5;
        playerLocationDiv2.style.left = 90 + x + "px";
        playerLocationDiv2.style.top = 95 + z + "px";
      }
    });
  }
  /*-----------------updatePlayer-------------------*/

  playersPeerData &&
    Object.keys(playersPeerData).map((item) => {
      playersPeer[item] &&
        playersPeer[item].children[0].position.copy(
          playersPeerData[item].position
        );
      playersPeer[item] &&
        playersPeer[item].children[0].rotation.copy(
          playersPeerData[item].rotation
        );
    });

  /*-----------------joystick-------------------*/

  if (myPlayer && isMobile && isJoystickTouched && playersPeer[socketName]) {
    booster_button.style.display = "block";

    if (
      (joystickY < 0 &&
        joystickX > -joystickAmount &&
        joystickX < joystickAmount) ||
      (joystickX === -25 && joystickY == -25) ||
      (joystickX === 35 && joystickY == -25)
    ) {
      // if (isSitting) {
      //   sittingLoaderMeshArray.length &&
      //     sittingLoaderMeshArray.map((item) => {
      //       item.material.transparent = true;
      //       item.material.opacity = 0.4;
      //     });
      //   isSitting = false;
      // }
      enableForward && myPlayer.translateZ(-walkspeed * deltaTime);

      [enableForward, enableBackward] = WalkCollision(
        enableForward,
        enableBackward,
        "forward"
      );
      if (isSpeed) {
        updatePlayerLocally("Running");
        updatePlayerGloally("Running");
      } else {
        updatePlayerLocally("Walking");
        updatePlayerGloally("Walking");
      }

      booster_button.addEventListener("touchstart", function (e) {
        isSpeed = true;
        booster_button.style.backgroundColor = "#FF0000";
      });
      booster_button.addEventListener("touchend", function (e) {
        isSpeed = false;
        booster_button.style.backgroundColor = "#000000";
      });
    } else if (
      (joystickY > 0 &&
        joystickX > -joystickAmount &&
        joystickX < joystickAmount) ||
      (joystickX === -25 && joystickY == 35) ||
      (joystickX === 35 && joystickY == 35)
    ) {
      // if (isSitting) {
      //   sittingLoaderMeshArray.length &&
      //     sittingLoaderMeshArray.map((item) => {
      //       item.material.transparent = true;
      //       item.material.opacity = 0.4;
      //     });
      //   isSitting = false;
      // }
      enableBackward && myPlayer.translateZ(walkspeed * deltaTime);
      [enableForward, enableBackward] = WalkCollision(
        enableForward,
        enableBackward,
        "forward"
      );

      updatePlayerLocally("Walking");
      updatePlayerGloally("Walking");
    } else if (
      joystickX < 0 &&
      joystickY > -joystickAmount &&
      joystickY < joystickAmount
    ) {
      // left
      myPlayer.rotateY(+walkRotateSpeed * deltaTime);
      updatePlayerLocally("Walking");
      updatePlayerGloally("Walking");
    } else if (
      joystickX > 0 &&
      joystickY > -joystickAmount &&
      joystickY < joystickAmount
    ) {
      // right
      myPlayer.rotateY(-walkRotateSpeed * deltaTime);
      updatePlayerLocally("Walking");
      updatePlayerGloally("Walking");
    }
  } else {
    booster_button.style.display = "none";
  }

  /*-----------------keyboard-------------------*/
  if (myPlayer) {
    if (keyboard.pressed("shift")) {
      walkspeed = walkspeedFast;
      avtarAnimation = "Running";
    } else {
      walkspeed = walkspeedSlow;
      avtarAnimation = "Walking";
    }
    if (keyboard.pressed("up") || keyboard.pressed("w")) {
      if (isSitting) {
        sittingLoaderMeshArray.length &&
          sittingLoaderMeshArray.map((item) => {
            item.material.transparent = true;
            item.material.opacity = 0.4;
          });
        isSitting = false;
      }
      enableForward && myPlayer.translateZ(-walkspeed * deltaTime);
      [enableForward, enableBackward] = WalkCollision(
        enableForward,
        enableBackward,
        "forward"
      );
      updatePlayerLocally(avtarAnimation);
      updatePlayerGloally(avtarAnimation);
    }
    if (keyboard.pressed("down") || keyboard.pressed("s")) {
      if (isSitting) {
        sittingLoaderMeshArray.length &&
          sittingLoaderMeshArray.map((item) => {
            item.material.transparent = true;
            item.material.opacity = 0.4;
          });
        isSitting = false;
      }
      enableBackward && myPlayer.translateZ(walkspeed * deltaTime);
      [enableForward, enableBackward] = WalkCollision(
        enableForward,
        enableBackward,
        "forward"
      );
      updatePlayerLocally(avtarAnimation);
      updatePlayerGloally(avtarAnimation);
    }
    if (keyboard.pressed("left") || keyboard.pressed("a")) {
      myPlayer.rotateY(+walkRotateSpeed * deltaTime);

      updatePlayerLocally(avtarAnimation);
      updatePlayerGloally(avtarAnimation);
    }
    if (keyboard.pressed("right") || keyboard.pressed("d")) {
      myPlayer.rotateY(-walkRotateSpeed * deltaTime);

      updatePlayerLocally(avtarAnimation);
      updatePlayerGloally(avtarAnimation);
    }
  }
  /*-----------------city-------------------*/
  // sittingLoaderMeshArray.length &&
  //   sittingLoaderMeshArray.map((item) => {
  //     item.position.y += 0.005 * Math.sin(Date.now() / 100);
  //   });
  if (water) {
    water.material.uniforms["time"].value += (1.0 / 60.0) * 0.2;
  }
  if (modelMixer) {
    modelMixer.update(deltaTime);
  }
  /*-----------------person animation-------------------*/
  if (characherMixerArray && Object.keys(characherMixerArray).length) {
    Object.keys(characherMixerArray).map((keys) => {
      characherMixerArray[keys].update(deltaTime);
    });
  }
  /*------------------------------------*/
  camera2 && renderer.render(scene, camera2);
  camera2 && labelRenderer.render(scene, camera2);
  requestAnimationFrame(animate);
  stats.update();
};

/*------------------------------------*/
// var secInterval;
// var isTokenReceived = true;
// const saveToken = (event) => {
//   if (event.origin == "http://localhost:3001") {
//     // isTokenReceived = true;
//   }
// };

// const secFunction = () => {
//   parent.postMessage({ message: "Hello from Game.JS" }, "*");
//   isTokenReceived && clearInterval(secInterval);
//   !isTokenReceived && window.addEventListener("message", saveToken, false);
//   if (isTokenReceived) {
// socket = io();
htmlEvents();
init();
startBasicCall();
animate();
//   }
// };
// secInterval = setInterval(secFunction, 100);

export {
  scene,
  isadmin,
  bannerNameArray,
  bannerMeshArray,
  selectedBannername,
  objectArray,
  notFound,
  globalUrl,
  sittingMeshArray,
  loadingManager,
  socketName,
  characherMixerArray,
  animationsArray,
  playersPeer,
  characterYWalkingPosition,
  avtarName,
  smallMap,
  infoMeshArray,
};
