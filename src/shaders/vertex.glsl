uniform vec3 uColor;

varying vec3 vColor;

void main() {

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

    vColor = uColor;
}