uniform float u_time;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = 500.0 * (1.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
