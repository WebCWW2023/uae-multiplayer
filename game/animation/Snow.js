import * as THREE from "three";
function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Create a function to create a snowflake object and add it to the scene
function createSnowflake(snowGroup,snowflakes) {
    const snowflakeGeometry = new THREE.SphereGeometry(0.03, 4, 4);
    const snowflakeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const snowflake = new THREE.Mesh(snowflakeGeometry, snowflakeMaterial);
    snowflake.position.x = randomRange(-50, 50);
    snowflake.position.y = randomRange(10, 50);
    snowflake.position.z = randomRange(-50, 50);
    snowflake.speed = randomRange(0.0005, 0.1);
    snowflakes.push(snowflake);
    snowGroup.add(snowflake);
}


export { createSnowflake,randomRange }