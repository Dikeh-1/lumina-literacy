import React, { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';
import { RippleButton } from "./multi-type-ripple-buttons";

// --- Internal Helper Components (Not exported) --- //

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="3"
    strokeLinecap="round" strokeLinejoin="round"
    className={className}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const ShaderCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glProgramRef = useRef<WebGLProgram | null>(null);
  const glBgColorLocationRef = useRef<WebGLUniformLocation | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const [backgroundColor, setBackgroundColor] = useState([0.984, 0.973, 0.949]); // #FBF8F2 Cream
  const isInView = useInView(canvasRef, { margin: "200px" });
  const isInViewRef = useRef(isInView);

  useEffect(() => {
    isInViewRef.current = isInView;
  }, [isInView]);

  useEffect(() => {
    const gl = glRef.current;
    const program = glProgramRef.current;
    const location = glBgColorLocationRef.current;
    if (gl && program && location) {
      gl.useProgram(program);
      gl.uniform3fv(location, new Float32Array(backgroundColor));
    }
  }, [backgroundColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) { console.error("WebGL not supported"); return; }
    glRef.current = gl;

    const vertexShaderSource = `attribute vec2 aPosition; void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }`;
    const fragmentShaderSource = `
      precision highp float;
      uniform float iTime;
      uniform vec2 iResolution;
      uniform vec3 uBackgroundColor;
      mat2 rotate2d(float angle){ float c=cos(angle),s=sin(angle); return mat2(c,-s,s,c); }
      float variation(vec2 v1,vec2 v2,float strength,float speed){ return sin(dot(normalize(v1),normalize(v2))*strength+iTime*speed)/100.0; }
      vec3 paintCircle(vec2 uv,vec2 center,float rad,float width){
        vec2 diff = center-uv;
        float len = length(diff);
        len += variation(diff,vec2(0.,1.),5.,2.);
        len -= variation(diff,vec2(1.,0.),5.,2.);
        float circle = smoothstep(rad-width,rad,len)-smoothstep(rad,rad+width,len);
        return vec3(circle);
      }
      void main(){
        vec2 uv = gl_FragCoord.xy/iResolution.xy;
        uv.x *= 1.5; uv.x -= 0.25;
        float mask = 0.0;
        float radius = .35;
        vec2 center = vec2(.5);
        mask += paintCircle(uv,center,radius,.035).r;
        mask += paintCircle(uv,center,radius-.018,.01).r;
        mask += paintCircle(uv,center,radius+.018,.005).r;
        vec2 v=rotate2d(iTime)*uv;
        vec3 foregroundColor=vec3(v.x,v.y,.7-v.y*v.x);
        vec3 color=mix(uBackgroundColor,foregroundColor,mask);
        color=mix(color,vec3(1.),paintCircle(uv,center,radius,.003).r);
        gl_FragColor=vec4(color,1.);
      }`;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Could not create shader");
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader) || "Shader compilation error");
      }
      return shader;
    };

    const program = gl.createProgram();
    if (!program) throw new Error("Could not create program");
    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    glProgramRef.current = program;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const iTimeLoc = gl.getUniformLocation(program, 'iTime');
    const iResLoc = gl.getUniformLocation(program, 'iResolution');
    glBgColorLocationRef.current = gl.getUniformLocation(program, 'uBackgroundColor');
    gl.uniform3fv(glBgColorLocationRef.current, new Float32Array(backgroundColor));

    let animationFrameId: number;
    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);
      if (!isInViewRef.current) return;
      gl.uniform1f(iTimeLoc, time * 0.001);
      gl.uniform2f(iResLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    animationFrameId = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full block z-0 pointer-events-none opacity-20" />;
};


// --- EXPORTED Building Blocks --- //

export interface PricingCardProps {
  planName: string;
  description: string;
  price: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  buttonVariant?: 'primary' | 'secondary';
}

export const PricingCard = ({
  planName, description, price, features, buttonText, isPopular = false, buttonVariant = 'primary'
}: PricingCardProps) => {
  const cardClasses = `
    backdrop-blur-[14px] rounded-2xl shadow-xl flex-1 w-full max-w-[340px] md:max-w-xs mx-auto md:mx-0 px-7 py-8 flex flex-col transition-all duration-300
    border
    ${isPopular 
      ? 'scale-105 relative ring-2 ring-[#C9A84C]/50 bg-white/60 border-[#C9A84C]/30 shadow-2xl z-10' 
      : 'bg-white/40 border-[#101B38]/5 hover:bg-white/50'
    }
  `;
  const buttonClasses = `
    mt-auto w-full py-3 rounded-xl font-semibold text-[14px] transition font-sans
    ${buttonVariant === 'primary' 
      ? 'bg-gradient-to-r from-[#E3C66D] to-[#C9A84C] hover:opacity-90 text-[#101B38] shadow-[0_0_15px_rgba(201,168,76,0.3)]' 
      : 'bg-[#101B38]/5 hover:bg-[#101B38]/10 text-[#101B38] border border-[#101B38]/10'
    }
  `;

  return (
    <div className={cardClasses.trim()}>
      {isPopular && (
        <div className="absolute -top-4 right-4 px-4 py-1.5 text-[12px] tracking-wide font-bold rounded-full bg-[#101B38] text-[#C9A84C]">
          Most Popular
        </div>
      )}
      <div className="mb-3">
        <h2 
          className="text-[42px] font-extralight tracking-[-0.03em] text-[#101B38]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {planName}
        </h2>
        <p className="text-[15px] text-[#101B38]/70 mt-1 font-sans leading-relaxed">{description}</p>
      </div>
      <div className="my-6 flex items-baseline gap-1">
        <span 
          className="text-[42px] font-extralight text-[#101B38]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {price}
        </span>
      </div>
      <div className="card-divider w-full mb-6 h-px bg-[linear-gradient(90deg,transparent,rgba(16,27,56,0.1)_50%,transparent)]" />
      <ul className="flex flex-col gap-3 text-[14px] text-[#101B38]/80 mb-8 font-sans">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <CheckIcon className="text-[#C9A84C] w-5 h-5 shrink-0 mt-0.5" /> 
            <span className="leading-tight">{feature}</span>
          </li>
        ))}
      </ul>
      <RippleButton 
        className={buttonClasses.trim()}
        onClick={() => window.dispatchEvent(new CustomEvent('show-maintenance'))}
      >
        {buttonText}
      </RippleButton>
    </div>
  );
};

// --- EXPORTED Customizable Page Component --- //

interface ModernPricingPageProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  plans: PricingCardProps[];
  showAnimatedBackground?: boolean;
}

export const ModernPricingPage = ({
  title,
  subtitle,
  plans,
  showAnimatedBackground = true,
}: ModernPricingPageProps) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <section id="programs" className="relative bg-[#FBF8F2] text-[#101B38] py-32 w-full overflow-hidden">
      {showAnimatedBackground && <ShaderCanvas />}
      <div className="relative z-10 w-full flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-5xl mx-auto text-center mb-16">
          <p className="uppercase tracking-[0.2em] text-sm font-semibold text-[#C9A84C] mb-4">
            Our Programs
          </p>
          <h2 
            className="text-[48px] md:text-[56px] font-bold leading-tight tracking-[-0.02em] text-[#101B38] mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {title}
          </h2>
          <p className="text-[16px] md:text-[18px] text-[#101B38]/70 max-w-2xl mx-auto font-sans leading-relaxed">
            {subtitle}
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-8 md:gap-6 justify-center items-stretch w-full max-w-6xl">
          {plans.map((plan) => <PricingCard key={plan.planName} {...plan} />)}
        </div>
      </div>
    </section>
  );
};
