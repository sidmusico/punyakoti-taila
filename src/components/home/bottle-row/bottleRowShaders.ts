/** Fullscreen ambient flow — slow “pressed oil” light on deep forest green. */
export const bottleRowAmbientVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

export const bottleRowAmbientFragment = /* glsl */ `
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  float wave(vec2 p, float t) {
    return sin(p.x * 3.2 + t * 0.35) * cos(p.y * 2.4 - t * 0.28) * 0.5 + 0.5;
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 p = (uv - 0.5) * aspect;

    float t = uTime * 0.22;
    float flow = wave(p * 1.8, t);
    flow += wave(p * 3.5 + 1.7, t * 1.3) * 0.45;
    flow += wave(p * 0.9 - 2.1, t * 0.7) * 0.3;

    vec3 deepGreen = vec3(0.04, 0.11, 0.07);
    vec3 mustard = vec3(0.87, 0.69, 0.30);
    vec3 cream = vec3(0.96, 0.94, 0.86);

    float glow = smoothstep(0.35, 0.92, flow);
    float vignette = 1.0 - smoothstep(0.2, 1.15, length(p * vec2(0.9, 1.1)));

    vec3 col = deepGreen;
    col = mix(col, mustard, glow * 0.14 * vignette);
    col = mix(col, cream, glow * 0.05 * vignette);

    float topFade = smoothstep(0.0, 0.25, uv.y);
    float bottomFade = 1.0 - smoothstep(0.75, 1.0, uv.y);
    col *= topFade * bottomFade;

    gl_FragColor = vec4(col, 0.55);
  }
`
