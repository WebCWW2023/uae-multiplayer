const ChangeView = (cameraPosition, avtarViewCount) => {

    if (avtarViewCount === 2) {
        avtarViewCount = 0;
    }
    if (avtarViewCount === 0) {
        cameraPosition = {
            x: 0,
            y: 0.6,
            z: 5.0
        }
    }
    else if (avtarViewCount === 1) {
        cameraPosition = {
          x: 0,
          y: 5,
          z: 20
        }
        // cameraPosition = {
        //     x: 0,
        //     y: 50,
        //     z: 155
        // }
    }
    avtarViewCount++;
    return [cameraPosition, avtarViewCount]
}
export { ChangeView }