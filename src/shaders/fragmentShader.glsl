precision mediump float;

varying vec4 v_color;

uniform vec2 resolution;
uniform float time;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;

  gl_FragColor = v_color;
}
