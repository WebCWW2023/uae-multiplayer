const resizeM = (camera, renderer, labelRenderer, socket_id) => {
    let isPortrait = window.matchMedia("(orientation: portrait)").matches;
    var sizes = {};
    if (isPortrait) {
        sizes.width = window.outerWidth
        sizes.height = window.outerHeight
    }
    else {
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight
    }
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    labelRenderer.setSize(sizes.width, sizes.height)

}
export { resizeM }