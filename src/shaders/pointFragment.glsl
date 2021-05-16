precision mediump float;

uniform vec3 uColor;
uniform float uTime;

varying vec2 vUv;

void main(){

    const int amount = 20;

    // vec2 coord = (gl_FragCoord.xy - uResolution) / min(uResolution.y, uResolution.x);
    vec2 coord = 20. * vUv - vec2(10.);

    float len;

    for(int i = 0; i < amount; i++){
        len = length(vec2(coord.x, coord.y));
        coord.x = coord.x - cos(coord.y + sin(len)) + cos(uTime / 9.0);
        coord.y = coord.y + sin(coord.x + cos(len)) + sin(uTime / 12.);
    }

    // gl_PointSize= 2;

    // gl_FragColor = vec4(cos(len) + .3 * sin(uTime), .7 * cos(uTime * 0.5) + cos(len), .67 * sin(uTime + cos(uTime)) - cos(len), 1.0);
    // gl_FragColor = vec4(0., cos(len * 4.), cos(len * 3.), 1.0);

    // gl_FragColor = vec4(uColor, 1.0);
    gl_FragColor = mix(vec4(cos(len), cos(len), cos(len), 1.0), vec4(uColor, 1.0), uTime);
}