'use client'

import React, { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

// Types for component props
export interface HeroProps {
  trustBadge?: {
    text: string;
    icons?: React.ReactNode[];
  };
  headline: {
    line1: string;
    line2: string;
  };
  subtitle: string;
  buttons?: {
    primary?: {
      text: string;
      onClick?: () => void;
    };
    secondary?: {
      text: string;
      onClick?: () => void;
    };
  };
  className?: string;
}

// Reusable Shader Background Hook
const useShaderBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const pointersRef = useRef<PointerHandler | null>(null);

  const isInView = useInView(canvasRef, { margin: "200px" });
  const isInViewRef = useRef(isInView);

  useEffect(() => {
    isInViewRef.current = isInView;
  }, [isInView]);

  // WebGL Renderer class
  class WebGLRenderer {
    private canvas: HTMLCanvasElement;
    private gl: WebGL2RenderingContext;
    private program: WebGLProgram | null = null;
    private vs: WebGLShader | null = null;
    private fs: WebGLShader | null = null;
    private buffer: WebGLBuffer | null = null;
    private scale: number;
    private shaderSource: string;
    private mouseMove: [number, number] = [0, 0];
    private mouseCoords: [number, number] = [0, 0];
    private pointerCoords: number[] = [0, 0];
    private nbrOfPointers = 0;

    private vertexSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

    private vertices = [-1, 1, -1, -1, 1, 1, 1, -1];

    constructor(canvas: HTMLCanvasElement, scale: number) {
      this.canvas = canvas;
      this.scale = scale;
      this.gl = canvas.getContext('webgl2')!;
      this.gl.viewport(0, 0, canvas.width * scale, canvas.height * scale);
      this.shaderSource = defaultShaderSource;
    }

    updateShader(source: string) {
      this.reset();
      this.shaderSource = source;
      this.setup();
      this.init();
    }

    updateMove(deltas: [number, number]) {
      this.mouseMove = deltas;
    }

    updateMouse(coords: [number, number]) {
      this.mouseCoords = coords;
    }

    updatePointerCoords(coords: number[]) {
      this.pointerCoords = coords;
    }

    updatePointerCount(nbr: number) {
      this.nbrOfPointers = nbr;
    }

    updateScale(scale: number) {
      this.scale = scale;
      this.gl.viewport(0, 0, this.canvas.width * scale, this.canvas.height * scale);
    }

    compile(shader: WebGLShader, source: string) {
      const gl = this.gl;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(shader);
        console.error('Shader compilation error:', error);
      }
    }

    test(source: string) {
      let result = null;
      const gl = this.gl;
      const shader = gl.createShader(gl.FRAGMENT_SHADER)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        result = gl.getShaderInfoLog(shader);
      }
      gl.deleteShader(shader);
      return result;
    }

    reset() {
      const gl = this.gl;
      if (this.program && !gl.getProgramParameter(this.program, gl.DELETE_STATUS)) {
        if (this.vs) {
          gl.detachShader(this.program, this.vs);
          gl.deleteShader(this.vs);
        }
        if (this.fs) {
          gl.detachShader(this.program, this.fs);
          gl.deleteShader(this.fs);
        }
        gl.deleteProgram(this.program);
      }
    }

    setup() {
      const gl = this.gl;
      this.vs = gl.createShader(gl.VERTEX_SHADER)!;
      this.fs = gl.createShader(gl.FRAGMENT_SHADER)!;
      this.compile(this.vs, this.vertexSrc);
      this.compile(this.fs, this.shaderSource);
      this.program = gl.createProgram()!;
      gl.attachShader(this.program, this.vs);
      gl.attachShader(this.program, this.fs);
      gl.linkProgram(this.program);

      if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(this.program));
      }
    }

    init() {
      const gl = this.gl;
      const program = this.program!;
      
      this.buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

      const position = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      (program as any).resolution = gl.getUniformLocation(program, 'resolution');
      (program as any).time = gl.getUniformLocation(program, 'time');
      (program as any).move = gl.getUniformLocation(program, 'move');
      (program as any).touch = gl.getUniformLocation(program, 'touch');
      (program as any).pointerCount = gl.getUniformLocation(program, 'pointerCount');
      (program as any).pointers = gl.getUniformLocation(program, 'pointers');
    }

    render(now = 0) {
      const gl = this.gl;
      const program = this.program;
      
      if (!program || gl.getProgramParameter(program, gl.DELETE_STATUS)) return;

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      
      gl.uniform2f((program as any).resolution, this.canvas.width, this.canvas.height);
      gl.uniform1f((program as any).time, now * 1e-3);
      gl.uniform2f((program as any).move, ...this.mouseMove);
      gl.uniform2f((program as any).touch, ...this.mouseCoords);
      gl.uniform1i((program as any).pointerCount, this.nbrOfPointers);
      gl.uniform2fv((program as any).pointers, this.pointerCoords);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }

  // Pointer Handler class
  class PointerHandler {
    private scale: number;
    private active = false;
    private pointers = new Map<number, number[]>();
    private lastCoords: [number, number] = [0, 0];
    private moves: [number, number] = [0, 0];

    constructor(element: HTMLCanvasElement, scale: number) {
      this.scale = scale;
      
      const map = (element: HTMLCanvasElement, scale: number, x: number, y: number): [number, number] => 
        [x * scale, element.height - y * scale];

      element.addEventListener('pointerdown', (e) => {
        this.active = true;
        this.pointers.set(e.pointerId, map(element, this.getScale(), e.clientX, e.clientY));
      });

      element.addEventListener('pointerup', (e) => {
        if (this.count === 1) {
          this.lastCoords = this.first;
        }
        this.pointers.delete(e.pointerId);
        this.active = this.pointers.size > 0;
      });

      element.addEventListener('pointerleave', (e) => {
        if (this.count === 1) {
          this.lastCoords = this.first;
        }
        this.pointers.delete(e.pointerId);
        this.active = this.pointers.size > 0;
      });

      element.addEventListener('pointermove', (e) => {
        if (!this.active) return;
        this.lastCoords = [e.clientX, e.clientY];
        this.pointers.set(e.pointerId, map(element, this.getScale(), e.clientX, e.clientY));
        this.moves = [this.moves[0] + e.movementX, this.moves[1] + e.movementY];
      });
    }

    getScale() {
      return this.scale;
    }

    updateScale(scale: number) {
      this.scale = scale;
    }

    get count() {
      return this.pointers.size;
    }

    get move() {
      return this.moves;
    }

    get coords() {
      return this.pointers.size > 0 
        ? Array.from(this.pointers.values()).flat() 
        : [0, 0];
    }

    get first(): [number, number] {
      return (this.pointers.values().next().value as [number, number]) || this.lastCoords;
    }
  }

  const resize = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
    
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    
    if (rendererRef.current) {
      rendererRef.current.updateScale(dpr);
    }
  };

  const loop = (now: number) => {
    animationFrameRef.current = requestAnimationFrame(loop);
    if (!rendererRef.current || !pointersRef.current || !isInViewRef.current) return;
    
    rendererRef.current.updateMouse(pointersRef.current.first);
    rendererRef.current.updatePointerCount(pointersRef.current.count);
    rendererRef.current.updatePointerCoords(pointersRef.current.coords);
    rendererRef.current.updateMove(pointersRef.current.move);
    rendererRef.current.render(now);
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
    
    rendererRef.current = new WebGLRenderer(canvas, dpr);
    pointersRef.current = new PointerHandler(canvas, dpr);
    
    rendererRef.current.setup();
    rendererRef.current.init();
    
    resize();
    
    if (rendererRef.current.test(defaultShaderSource) === null) {
      rendererRef.current.updateShader(defaultShaderSource);
    }
    
    loop(0);
    
    window.addEventListener('resize', resize);
    
    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.reset();
      }
    };
  }, []);

  return { canvasRef };
};

export const AnimatedShaderHero: React.FC<HeroProps> = ({
  trustBadge,
  headline,
  subtitle,
  buttons,
  className = ""
}) => {
  const { canvasRef } = useShaderBackground();

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-[#101B38] ${className}`}>
      <style>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; opacity: 0; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-800 { animation-delay: 0.8s; }
      `}</style>
      
      {/* WebGL Shader canvas — shown on ALL devices */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover touch-none opacity-80"
        style={{ background: '#101B38' }}
      />
      
      {/* Film grain overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-[5]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />
      
      {/* Hero Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white mt-12">
        {/* Trust Badge */}
        {trustBadge && (
          <div className="mb-8 animate-fade-in-down">
            <div className="flex items-center gap-2 px-6 py-2.5 bg-white/5 backdrop-blur-md border border-[#C9A84C]/30 rounded-full text-sm">
              {trustBadge.icons && (
                <div className="flex -space-x-1">
                  {trustBadge.icons.map((icon, index) => (
                    <span key={index} className="text-[#C9A84C]">
                      {icon}
                    </span>
                  ))}
                </div>
              )}
              <span className="text-white/90 tracking-wide uppercase text-xs font-semibold">{trustBadge.text}</span>
            </div>
          </div>
        )}

        <div className="text-center space-y-6 max-w-5xl mx-auto px-4">
          {/* Main Heading with Animation */}
          <div className="space-y-3">
            <h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold bg-clip-text text-transparent animate-fade-in-up animation-delay-200"
              style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                backgroundImage: "linear-gradient(135deg, #FFFCF7 0%, #FBF8F2 50%, #C9A84C 100%)"
              }}
            >
              {headline.line1}
            </h1>
            <h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold bg-clip-text text-transparent animate-fade-in-up animation-delay-400"
              style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                backgroundImage: "linear-gradient(135deg, #E3C66D 0%, #C9A84C 40%, #A88426 100%)"
              }}
            >
              {headline.line2}
            </h1>
          </div>
          
          {/* Subtitle with Animation */}
          <div className="max-w-3xl mx-auto animate-fade-in-up animation-delay-600 mt-6">
            <p className="text-lg md:text-xl text-[#FFFCF7]/80 font-light leading-relaxed max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
          
          {/* CTA Buttons with Animation */}
          {buttons && (
            <div className="flex flex-col sm:flex-row gap-5 justify-center mt-12 animate-fade-in-up animation-delay-800">
              {buttons.primary && (
                <button 
                  onClick={buttons.primary.onClick}
                  className="px-8 py-4 text-[#101B38] rounded-full font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:shadow-[0_0_30px_rgba(201,168,76,0.5)]"
                  style={{ background: "linear-gradient(135deg, #E3C66D, #C9A84C)" }}
                >
                  {buttons.primary.text}
                </button>
              )}
              {buttons.secondary && (
                <button 
                  onClick={buttons.secondary.onClick}
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-[#C9A84C]/30 hover:border-[#C9A84C]/60 text-[#FFFCF7] rounded-full font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                >
                  {buttons.secondary.text}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

const defaultShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)

float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}

float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float a=rnd(i), b=rnd(i+vec2(1,0)), c=rnd(i+vec2(0,1)), d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}

float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}

float clouds(vec2 p) {
	float d=1., t=.0;
	for (float i=.0; i<3.; i++) {
		float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
		t=mix(t,d,a);
		d=a;
		p*=2./(i+1.);
	}
	return t;
}

void main(void) {
	vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
	vec3 col=vec3(0);
	float bg=clouds(vec2(st.x+T*.3,-st.y));
	uv*=1.-.3*(sin(T*.1)*.5+.5);
	
	for (float i=1.; i<10.; i++) {
		uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.2+.1*uv.x);
		vec2 p=uv;
		float d=length(p);
		
		// Golden glow particles instead of RGB
		vec3 goldGlow = vec3(0.79, 0.66, 0.30);
		col+=.001/d*goldGlow*(cos(sin(i)*vec3(0.1,0.2,0.3))+1.);
		
		float b=noise(i+p+bg*1.731);
		col+=.0015*b/length(max(p,vec2(b*p.x*.02,p.y)));
		
		// Lumina Navy Background Mix
		vec3 luminaNavy = vec3(bg*0.06, bg*0.10, bg*0.22);
		col=mix(col,luminaNavy,d);
	}
	
	// Add subtle deep blue tint
	col += vec3(0.02, 0.04, 0.12);
	
	O=vec4(col,1);
}`;

export default AnimatedShaderHero;
