// Details
document.querySelectorAll('.clickable').forEach((art) => {
  art.addEventListener('mouseenter', () => {
    const detailsText = art.getAttribute('details'); // Get details attribute
    const detailEntity = art.querySelector('.art-info'); // Find child text entity

    // Update the detail text and make it visible
    detailEntity.setAttribute('text', `value: ${detailsText}; color: white; width: 4; align: center`);
    detailEntity.setAttribute('visible', true);
  });

  art.addEventListener('mouseleave', () => {
    const detailEntity = art.querySelector('.art-info');
    detailEntity.setAttribute('visible', false); // Hide the text
  });
});

// For Movement
AFRAME.registerComponent('controller-movement', {
  init: function () {
    const el = this.el; // The controller entity
    const rig = document.getElementById('cameraRig'); // The camera rig for movement

    // Listen for thumbstick movement
    el.addEventListener('thumbstickmoved', (evt) => {
      const { x, y } = evt.detail; // x for left/right, y for forward/backward

      // Move the camera rig based on the thumbstick input
      if (rig) {
        const currentPosition = rig.getAttribute('position');
        rig.setAttribute('position', {
          x: currentPosition.x - x * 0.03, // Adjust the speed multiplier as needed
          y: currentPosition.y,
          z: currentPosition.z - y * 0.03
        });
      }
    });
  }
});
