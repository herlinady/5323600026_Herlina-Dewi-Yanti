var VRButton = {
    createButton: function(gl, options) {
        if (options && options.referenceSpaceType) {
            gl.xr.setReferenceSpaceType(options.referenceSpaceType);
        }

        var button = document.createElement('button');
        button.innerHTML = 'Enter XR';
        button.style.position = 'absolute';
        button.style.bottom = '20px';
        button.style.left = '20px';
        button.style.padding = '12px 24px';
        button.style.fontSize = '16px';
        document.body.appendChild(button);

        var currentSession = null;

        function onSessionStarted(session) {
            session.addEventListener('end', onSessionEnded);
            gl.xr.setSession(session);
            button.textContent = 'Exit XR';
            currentSession = session;
        }

        function onSessionEnded() {
            currentSession.removeEventListener('end', onSessionEnded);
            button.textContent = 'Enter XR';
            currentSession = null;
        }

        button.onclick = function() {
            if (currentSession === null) {
                let sessionInit = { optionalFeatures: ["local-floor", "bounded-floor"] };
                navigator.xr.requestSession('immersive-vr', sessionInit).then(onSessionStarted);
            } else {
                currentSession.end();
            }
        };

        function NotFound() {
            console.log("XR session not supported.");
        }

        if (navigator.xr) {
            navigator.xr.isSessionSupported('immersive-vr')
                .then(function(supported) {
                    if (supported) {
                        // VR Supported
                    } else {
                        NotFound();
                    }
                })
                .catch(function(error) {
                    console.error("Error checking XR support:", error);
                });
        } else {
            console.warn("WebXR not supported in this browser.");
        }

        return button;
    }
};

export { VRButton };