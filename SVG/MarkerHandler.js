// MarkerHandler.js - Updated for MindAR integration

document.addEventListener("DOMContentLoaded", function () {
    if (typeof AFRAME === 'undefined') {
        console.error("AFRAME is not loaded");
        return;
    }

    console.log("Initializing MarkerHandler component...");

    // Register the markerhandler component
    AFRAME.registerComponent('markerhandler', {
        init: function () {
            console.log("MarkerHandler component initialized");
            
            // Store a reference to this component
            const self = this;
            
            // Set up event listeners for MindAR target detection
            this.el.addEventListener('targetFound', function (event) {
                const targetIndex = event.detail.targetIndex;
                console.log("MindAR target found:", targetIndex);
                
                // Update debug info
                document.getElementById('detectedIndex').textContent = targetIndex;
                
                // Get SVG nodes if available
                const svgNodes = window.extractedNodes || [];
                
                if (svgNodes.length > 0) {
                    // Use the targetIndex to map to the corresponding SVG node
                    const markerId = svgNodes[targetIndex]?.id;
                    
                    console.log("Detected marker index:", targetIndex, "-> Node ID:", markerId);
                    document.getElementById('lastMarker').textContent = markerId || 'Unknown';
                    
                    // If we have a valid marker ID and the setUserLocation function exists, call it
                    if (markerId && typeof window.setUserLocation === 'function') {
                        window.setUserLocation(markerId);
                    }
                } else {
                    console.warn("No SVG nodes available for mapping");
                    document.getElementById('lastMarker').textContent = 'No SVG nodes';
                }
            });
            
            this.el.addEventListener('targetLost', function (event) {
                console.log("Target lost:", event.detail.targetIndex);
            });
        }
    });

    // Wait until A-Frame is ready before attaching the component
    const scene = document.querySelector('a-scene');
    if (scene.hasLoaded) {
        attachMarkerHandler();
    } else {
        scene.addEventListener('loaded', attachMarkerHandler);
    }

    function attachMarkerHandler() {
        // Attach the markerhandler component to all mindar-image-target entities
        const targets = document.querySelectorAll('a-entity[mindar-image-target]');
        
        if (targets.length > 0) {
            console.log(`Attaching markerhandler to ${targets.length} targets`);
            targets.forEach(target => {
                if (!target.hasAttribute('markerhandler')) {
                    target.setAttribute('markerhandler', '');
                }
            });
        } else {
            // If no targets are found, attach to the scene as fallback
            console.log("No mindar-image-targets found, attaching to scene");
            scene.setAttribute('markerhandler', '');
        }
    }
});
