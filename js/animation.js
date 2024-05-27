function animate(scene, camera, renderer, cube) {
    function loop() {
        requestAnimationFrame(loop);

        // Apply some rotation to the cube for each frame
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        // Update camera position based on keys pressed
        window.updateCameraPosition();

        // Render the scene from the perspective of the camera
        renderer.render(scene, camera);
    }

    console.log('Starting Animation Loop');
    loop();
}
