attribute vec2 position;
attribute vec4 color;

varying vec4 v_color;

uniform mat4 u_matrix;


void main() {
  gl_Position = u_matrix * vec4(position.x, position.y, 0.0, 1.0);
  v_color = color;
}