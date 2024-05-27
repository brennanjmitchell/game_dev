function initControls(camera) {
    console.log('Initializing Camera Controls');
    const keys = {
        w: false,
        a: false,
        s: false,
        d: false
    };

    window.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'w':
                keys.w = true;
                break;
            case 'a':
                keys.a = true;
                break;
            case 's':
                keys.s = true;
                break;
            case 'd':
                keys.d = true;
                break;
        }
    });

    window.addEventListener('keyup', (event) => {
        switch (event.key) {
            case 'w':
                keys.w = false;
                break;
            case 'a':
                keys.a = false;
                break;
            case 's':
                keys.s = false;
                break;
            case 'd':
                keys.d = false;
                break;
        }
    });

    function updateCameraPosition() {
        const moveSpeed = 0.1; // Adjust the speed as needed
        if (keys.w) camera.position.z -= moveSpeed;
        if (keys.s) camera.position.z += moveSpeed;
        if (keys.a) camera.position.x -= moveSpeed;
        if (keys.d) camera.position.x += moveSpeed;
    }

    // Export the update function
    window.updateCameraPosition = updateCameraPosition;
}
