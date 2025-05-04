document.addEventListener("DOMContentLoaded", function () {
    if (typeof AFRAME !== 'undefined') {
      AFRAME.registerComponent('markerhandler', {
          init: function () {
              this.el.sceneEl.addEventListener('targetFound', (e) => {
                  const targetIndex = e.detail.targetIndex;
  
                  // Dynamically map using SVG-extracted nodes
                  const svgNodes = window.extractedNodes || [];
                  const markerId = svgNodes[targetIndex]?.id;  // Match index with node
  
                  console.log("Detected marker index:", targetIndex, "-> Node ID:", markerId);
  
                  if (markerId && typeof window.setUserLocation === 'function') {
                      window.setUserLocation(markerId);
                  }
              });
          }
      });
  
      // Attach the markerhandler component to the scene
      document.querySelector('a-scene').setAttribute('markerhandler', '');
    } else {
      console.error("AFRAME is not loaded");
    }
  });