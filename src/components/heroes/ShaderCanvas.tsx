import { useEffect, useRef, useCallback } from "react";

// Vertex shader
const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// Fragment shader - Premium navy/gold atmospheric effect
const fragmentShaderSource = `
  precision highp float;
  
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  
  // Lumina palette
  #define DEEP_NAVY vec3(0.063, 0.106, 0.220)
  #define NAVY vec3(0.106, 0.176, 0.369)
  #define GOLD vec3(0.788, 0.659, 0.298)
  #define LIGHT_GOLD vec3(0.890, 0.776, 0.427)
  #define CREAM vec3(0.984, 0.973, 0.949)
  
  // Noise functions
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  float fbm(vec2 p) {
    float val = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 5; i++) {
      val += amp * noise(p * freq);
      freq *= 2.0;
      amp *= 0.5;
    }
    return val;
  }
  
  // Soft particle effect
  float particle(vec2 uv, vec2 pos, float size) {
    float d = length(uv - pos);
    return smoothstep(size, 0.0, d) * 0.5;
  }
  
  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 centeredUv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    
    float t = u_time * 0.15;
    
    // Mouse influence (subtle)
    vec2 mouseInfluence = (u_mouse - 0.5) * 0.05;
    
    // Base gradient - deep navy atmosphere
    vec3 col = mix(DEEP_NAVY * 0.8, NAVY, uv.y * 0.6 + 0.2);
    
    // Flowing aurora-like layers
    float n1 = fbm(vec2(uv.x * 3.0 + t * 0.3, uv.y * 2.0 + t * 0.2) + mouseInfluence);
    float n2 = fbm(vec2(uv.x * 2.0 - t * 0.2, uv.y * 3.0 + t * 0.15) + mouseInfluence * 0.5);
    float n3 = fbm(vec2(uv.x * 4.0 + t * 0.1, uv.y * 1.5 - t * 0.25));
    
    // Gold illumination bands
    float goldBand1 = smoothstep(0.35, 0.55, n1) * smoothstep(0.65, 0.45, n1);
    float goldBand2 = smoothstep(0.4, 0.6, n2) * smoothstep(0.7, 0.5, n2);
    
    // Apply gold light subtly
    col += GOLD * goldBand1 * 0.15;
    col += LIGHT_GOLD * goldBand2 * 0.08;
    
    // Soft cream highlights
    float creamHighlight = smoothstep(0.5, 0.7, n3) * smoothstep(0.8, 0.6, n3);
    col += CREAM * creamHighlight * 0.04;
    
    // Radial gradient - center brightness
    float centerGlow = 1.0 - length(centeredUv * 1.2);
    centerGlow = pow(max(centerGlow, 0.0), 2.0);
    col += GOLD * centerGlow * 0.06;
    
    // Subtle floating particles (gold)
    for (int i = 0; i < 8; i++) {
      float fi = float(i);
      vec2 particlePos = vec2(
        0.5 + sin(t * 0.5 + fi * 1.7) * 0.4,
        0.5 + cos(t * 0.4 + fi * 2.3) * 0.3
      );
      float p = particle(uv, particlePos, 0.02 + sin(t + fi) * 0.01);
      col += LIGHT_GOLD * p * 0.12;
    }
    
    // Vignette
    float vignette = 1.0 - length(centeredUv * 0.9);
    vignette = smoothstep(0.0, 0.7, vignette);
    col *= mix(0.6, 1.0, vignette);
    
    // Subtle film grain
    float grain = hash(uv * u_resolution.xy + u_time) * 0.03;
    col += grain;
    
    // Ensure colors don't blow out
    col = clamp(col, 0.0, 1.0);
    
    gl_FragColor = vec4(col, 1.0);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export default function ShaderCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const animationRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = {
      x: e.clientX / window.innerWidth,
      y: 1.0 - e.clientY / window.innerHeight,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
    });
    if (!gl) return;

    // Create shaders
    const vs = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vs || !fs) return;

    const program = createProgram(gl, vs, fs);
    if (!program) return;

    // Set up geometry (full-screen quad)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const mouseLocation = gl.getUniformLocation(program, "u_mouse");

    // Resize handler
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5); // Cap for performance
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const startTime = performance.now();

    const render = () => {
      const elapsed = (performance.now() - startTime) / 1000;

      gl.useProgram(program);

      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, elapsed);
      gl.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(positionBuffer);
    };
  }, [handleMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}
