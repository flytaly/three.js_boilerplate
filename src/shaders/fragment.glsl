uniform float u_time;
uniform vec4 u_resolution;
uniform float u_progress;

varying vec2 vUv;

void main() {
  // vec2 uv = (vUv - vec2(0.5)) * u_resolution.zw + vec2(0.5);
  // vec2 uv = vUv * u_resolution.zw;
  // vec3 color = vec3(uv, 0.0);
  vec3 color = vec3(vUv, 0.0);
  color = mix(color, vec3(0.0), u_progress);
  gl_FragColor = vec4(color, 1.0);
}
