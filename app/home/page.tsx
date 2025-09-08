"use client";
import React, { Suspense, use, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";


const Page = () => {
  const bgVidPath = ["red-bg.mp4", "blue-bg.mp4"];
  const canModels=["red-can.glb","blue-can.glb"];
  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [rotatespeed,setRotateSpeed]=useState(0.009);
  const [currModel,setCurrModel]=useState(0);
  function CanModel() {
    const { scene } = useGLTF(`/models/${canModels[current]}`);

    return (
      <group scale={1.5} position={[0, -1, 0]}>
        <primitive object={scene} />
      </group>
    );
  }


  function FloatingCan() {
    const ref = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
      if (ref.current) {
        // Rotate
        ref.current.rotation.y += rotatespeed;

        ref.current.position.y = Math.sin(clock.getElapsedTime()) * 0.21;
      }
    });

    return (
      <group ref={ref}>
        <CanModel />
      </group>
    );
  }

  const handleNext = () => {
    const nextIndex = (current + 1) % bgVidPath.length;
    setRotateSpeed(0.09);
    setPrevious(current);
    setCurrent(nextIndex);


    
    setTimeout(() => {setPrevious(null);setRotateSpeed(0.009);setCurrModel(nextIndex);}, 800);
  };

  const handlePrev = () => {
    const prevIndex = (current - 1 + bgVidPath.length) % bgVidPath.length;
    setPrevious(current);
    setCurrent(prevIndex);

    // cleanup previous after transition
    setTimeout(() => setPrevious(null), 800);
  };

  // const {scene}=useGLTF("/models/can.glb");

  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      <video
        key={current}
        src={`/bg-videos/${bgVidPath[current]}`}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 opacity-100"
      ></video>

      {/* Previous Video fading out */}
      {previous !== null && (
        <video
          key={previous}
          src={`/bg-videos/${bgVidPath[previous]}`}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 opacity-0"
        ></video>
      )}

      <div className="relative z-10 min-h-screen w-screen flex justify-center items-center">
        <div className="relative min-h-[80vh] w-[55vw] rounded-lg bg-[rgba(255,255,255,0.2)] shadow-sm shadow-white flex justify-center items-center">
          <div
            className="absolute -left-6 top-1/2 -translate-y-1/2 text-3xl cursor-pointer text-white bg-white/60 px-3 py-1 rounded-full hover:bg-white/50 transition"
            onClick={handlePrev}
          >
            {"<"}
          </div>


          <div
            className="absolute -right-6 top-1/2 -translate-y-1/2 text-3xl cursor-pointer bg-white/60 text-white px-3 py-1 rounded-full hover:bg-white/50 transition"
            onClick={handleNext}
          >
            {">"}
          </div>

          <div className="relative min-h-[80vh] w-[55vw]">
            <Canvas camera={{ fov: 110, position: [0, 1, 8] }} shadows style={{ height: "500px" }}>
              <directionalLight
                position={[10, 10, 25]}
                intensity={8}
                color="white"
                castShadow
              />
              <directionalLight
                position={[-10, -10, -25]}
                intensity={8}
                color="white"
                castShadow
              />
              <ambientLight intensity={2} />
              <pointLight position={[10, 10, 10]} />
              <FloatingCan />
              {/* <OrbitControls /> */}
            </Canvas>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Page;
