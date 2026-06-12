"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="h-[60rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20"
      ref={containerRef}
    >
      <div
        className="py-10 md:py-40 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 rgba(201,168,76,0.1), 0 9px 20px rgba(201,168,76,0.08), 0 37px 37px rgba(16,27,56,0.15), 0 84px 50px rgba(16,27,56,0.1), 0 149px 60px rgba(16,27,56,0.05)",
      }}
      className="max-w-5xl -mt-12 mx-auto h-[35rem] md:h-[40rem] w-full border-[6px] border-[#101B38] p-2 md:p-6 bg-[#1B2D5E] rounded-[30px] shadow-2xl relative"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl bg-[#FBF8F2] md:rounded-2xl p-4 md:p-8 relative">
        {/* Subtle interior glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/5 to-transparent pointer-events-none" />
        {children}
      </div>
    </motion.div>
  );
};
