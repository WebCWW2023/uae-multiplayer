import * as THREE from "three";
import { scene } from "../game.js";
import { positionGUI, rotationGUI } from "../common/CommonFunction.js";

const flagM = (cityGroup, flag, gui) => {
    /*-----------------flag-------------------*/
    const flagLoader = new THREE.TextureLoader()
    var flagGeometry = new THREE.PlaneGeometry(6.0, 2.8, 100, 30)
    var flagMaterial = new THREE.MeshBasicMaterial({
        opacity: 0,
        transparent: true,
        map: flagLoader.load("../../static/images/usa_flag.jpg", () => {
            flagMaterial.opacity = 1
        }),
        side: THREE.DoubleSide,
    });
    flag = new THREE.Mesh(flagGeometry, flagMaterial);
    flag.name = 'flag';
    flag.position.set(13.9, 8, 165.2);
    flag.rotation.set(0, 3.1, 0);
    let flag2 = flag.clone();
    flag2.position.set(-190.2, 7.8, -10.8);
    flag2.rotation.set(0, 2, 0);
    let flag3 = flag.clone();
    flag3.position.set(-234.1, 7.8, -259.6);
    flag3.rotation.set(0, 1.2, 0);
    let flag4 = flag.clone();
    flag4.position.set(-91.5, 7.8, -415.2);
    flag4.rotation.set(0, 0.3, 0);
    let flag5 = flag.clone();
    flag5.position.set(54.4, 7.8, -420.9);
    flag5.rotation.set(0, -0.3, 0);
    let flag6 = flag.clone();
    flag6.position.set(-233.8, 7.8, -259.5);
    flag6.rotation.set(0, 1.1, 0);
    let flag7 = flag.clone();
    flag7.position.set(171.3, 8.3, -199);
    flag7.rotation.set(0, -1.6, 0);
    let flag8 = flag.clone();
    flag8.position.set(171.3, 8.3, -199);
    flag8.rotation.set(0, -1.6, 0);
    // cityGroup.add(flag)
    // cityGroup.add(flag2)
    // cityGroup.add(flag4)
    // cityGroup.add(flag5)
    // cityGroup.add(flag6)
    // cityGroup.add(flag7)
    // cityGroup.add(flag8)

}
export { flagM }
/*-----------------import-------------------*/
import { flagM } from "./Different/Flag.js";
/*-----------------var-------------------*/
, flag,
    flagPos
/*-----------------flag-------------------*/
// flagM(cityGroup, flag, gui)
// flagPos = scene.getObjectByName('flag').geometry.attributes.position;
/*-----------------animate-------------------*/
if (flagPos) {
    for (let i = 0; i < flagPos.count; i++) {
        flagV.fromBufferAttribute(flagPos, i);
        const multipler = ((flagV.x + 2.5) / 10);
        const wave1 = 0.5 * Math.sin(1.5 * flagV.x + elapsedTime * 5);
        const wave2 = 0;
        flagPos.setZ(i, (wave1 + wave2) * multipler);
    }
    flagPos.needsUpdate = true;
}