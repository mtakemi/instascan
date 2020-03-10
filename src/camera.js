function cameraName(label) {
  var clean = label.replace(/\s*\([0-9a-f]+(:[0-9a-f]+)?\)\s*$/, '');
  return clean || label || null;
}

class Camera {
  constructor(id, name, overwriteOpts = {}) {
    this.id = id;
    this.name = name;
    this._stream = null;
    this.overwriteOpts = overwriteOpts;
  }

  async start() {
    var constraints = {
      audio: false,
      video: {
        mandatory: {
          sourceId: this.id,
          minWidth: 600,
          maxWidth: 800,
          minAspectRatio: 1.6
        },
        optional: []
      }
    };
    _.merge(constraints, this.overwriteOpts);

    this._stream = await navigator.mediaDevices.getUserMedia(constraints);
    return this._stream;
  }

  stop() {
    if (!this._stream) {
      return;
    }

    for (let stream of this._stream.getVideoTracks()) {
      stream.stop();
    }

    this._stream = null;
  }

  static async getCameras(overwriteOpts = {}) {
    var devices = await navigator.mediaDevices.enumerateDevices();

    return devices
      .filter(d => d.kind === 'videoinput')
      .map(d => new Camera(d.deviceId, cameraName(d.label), overwriteOpts));
  }
}

module.exports = Camera;
