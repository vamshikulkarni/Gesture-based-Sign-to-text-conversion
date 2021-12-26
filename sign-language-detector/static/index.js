const videoElement = document.getElementById('webCam');
const canvasElement = document.getElementById('canvas');
const canvasCtx = canvasElement.getContext('2d');

function takeAPicture() {
  let picture = canvasElement.toDataURL('image/jpeg');
  document.querySelector('#snap').src = picture;
}

function clearCanvas() {
  document.querySelector('#snap').src = '';
}

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
        color: '#00FF00',
        lineWidth: 5,
      });
      drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
    }
  }
  canvasCtx.restore();
}

const hands = new Hands({
  locateFile: file => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  },
});

hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});
hands.onResults(onResults);

var camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: 1280,
  height: 1280,
});
camera.start();
