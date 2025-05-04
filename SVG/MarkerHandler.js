// MarkerHandler.js - Updated for MindAR integration with version fix

document.addEventListener("DOMContentLoaded", function () {
    if (typeof AFRAME === 'undefined') {
        console.error("AFRAME is not loaded");
        return;
    }

    console.log("Initializing MarkerHandler component...");
    
    // Status indicator function
    function updateStatus(message, isError = false) {
        const statusEl = document.getElementById('statusIndicator');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.style.backgroundColor = isError ? 
                "rgba(255, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.7)";
        }
    }

    // Register the markerhandler component
    AFRAME.registerComponent('markerhandler', {
        init: function () {
            console.log("MarkerHandler component initialized on", this.el.id);
            
            // Store a reference to this component
            const self = this;
            
            // Get the target index from the entity
            const targetIndex = this.el.getAttribute('mindar-image-target').targetIndex;
            console.log(`Setting up handler for target index: ${targetIndex}`);
            
            // Set up event listeners for MindAR target detection
            this.el.addEventListener('targetFound', function () {
                console.log(`Target ${targetIndex} found!`);
                updateStatus(`Marker ${targetIndex + 1} detected!`);
                
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
            
            this.el.addEventListener('targetLost', function () {
                console.log(`Target ${targetIndex} lost`);
                updateStatus("Marker lost. Scan again.");
            });
        }
    });

    // Wait until A-Frame is ready before attaching components
    const scene = document.querySelector('a-scene');
    if (scene.hasLoaded) {
        attachMarkerHandlers();
    } else {
        scene.addEventListener('loaded', attachMarkerHandlers);
    }

    function attachMarkerHandlers() {
        // Attach the markerhandler component to all mindar-image-target entities
        const targets = document.querySelectorAll('a-entity[mindar-image-target]');
        
        if (targets.length > 0) {
            console.log(`Attaching markerhandler to ${targets.length} targets`);
            targets.forEach(target => {
                if (!target.hasAttribute('markerhandler')) {
                    target.setAttribute('markerhandler', '');
                    console.log(`Attached markerhandler to ${target.id || 'unnamed target'}`);
                }
            });
            updateStatus("Ready to scan markers");
        } else {
            console.warn("No mindar-image-targets found");
            updateStatus("No markers configured", true);
        }
    }
});
