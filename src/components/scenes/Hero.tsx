"use client";
import React, { useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Stars,
  ScrollControls,
  useScroll,
  Text,
  Box,
  Sphere,
  MeshWobbleMaterial,
  Environment,
  Float,
  OrbitControls,
} from "@react-three/drei";
import * as THREE from "three";

function EnhancedTorus() {
  const torusRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (torusRef.current) {
      torusRef.current.rotation.x += delta * 0.5;
      torusRef.current.rotation.y += delta * 0.3;
      torusRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <mesh ref={torusRef}>
      <torusGeometry args={[3, 1, 16, 32]} />
      <meshStandardMaterial
        color="#ff6347"
        metalness={0.6}
        roughness={0.3}
        emissive="#ff1744"
        emissiveIntensity={0.05}
      />
    </mesh>
  );
}

function AvatarCube() {
  const cubeRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!cubeRef.current) return;

    cubeRef.current.rotation.y += 0.01;
    cubeRef.current.rotation.z += 0.01;
  });

  return (
    <Box ref={cubeRef} position={[2, 0, -5]} args={[3, 3, 3]}>
      <meshBasicMaterial color="#4a90e2" />
    </Box>
  );
}

function Moon() {
  const moonRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!moonRef.current) return;

    moonRef.current.rotation.x += 0.005;
    moonRef.current.rotation.y += 0.075;
    moonRef.current.rotation.z += 0.05;
  });

  return (
    <Sphere ref={moonRef} position={[-10, 0, 30]} args={[3, 32, 32]}>
      <MeshWobbleMaterial
        color="#ffffff"
        factor={0.1}
        speed={0.5}
        roughness={0.8}
        metalness={0.1}
      />
    </Sphere>
  );
}

function OptimizedFloatingObjects() {
  const objects = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        position: [
          THREE.MathUtils.randFloatSpread(20),
          THREE.MathUtils.randFloatSpread(20),
          THREE.MathUtils.randFloatSpread(20),
        ] as [number, number, number],
        scale: 0.3 + Math.random() * 0.3,
        color: `hsl(${i * 45}, 70%, 60%)`,
      })),
    []
  );

  return (
    <group>
      {objects.map((obj) => (
        <Float
          key={obj.id}
          speed={1 + Math.random()}
          rotationIntensity={0.3}
          floatIntensity={0.3}
          position={obj.position}
        >
          <mesh>
            <boxGeometry args={[obj.scale, obj.scale, obj.scale]} />
            <meshStandardMaterial
              color={obj.color}
              metalness={0.5}
              roughness={0.4}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function ScrollCamera() {
  const scroll = useScroll();

  useFrame((state) => {
    if (scroll) {
      const offset = scroll.offset;

      // state.camera.position.z = 8 - offset * 5;
      // state.camera.position.x = offset * 3;
      // state.camera.position.y = offset * 2;

      state.camera.position.z = 30 - offset * 20;
      state.camera.position.x = -3 + offset * 10;
      state.camera.position.y = offset * 5;

      state.camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

function OptimizedStars() {
  return (
    <Stars
      radius={50}
      depth={30}
      count={10000}
      factor={4}
      saturation={0}
      fade
      speed={0.5}
    />
  );
}

function SceneContent() {
  return (
    <>
      <ScrollCamera />

      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, 2, 5]} intensity={0.5} color="#4a90e2" />

      <EnhancedTorus />
      <AvatarCube />
      <Moon />
      <OptimizedFloatingObjects />
      <OptimizedStars />

      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <Text
          position={[0, 8, -10]}
          fontSize={window.innerWidth > 768 ? 3 : 2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          AYOBAMI ADEOYE
        </Text>
      </Float>

      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.1}>
        <Text
          position={[-2, -2, 20]}
          fontSize={window.innerWidth > 768 ? 0.8 : 0.3}
          color="#ff6347"
          anchorX="center"
          anchorY="middle"
        >
          SOFTWARE ENGINEER ✌🏽
        </Text>
      </Float>

      <Environment preset="night" />

      <fog attach="fog" args={["#1a1a2e", 10, 40]} />
    </>
  );
}

function Fallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="orange" />
    </mesh>
  );
}

export default function Hero() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          width: "100%",
          height: "100%",
        }}
        gl={{
          antialias: false,
          powerPreference: "default",
          alpha: false,
          stencil: false,
          depth: true,
          premultipliedAlpha: false,
          preserveDrawingBuffer: false,
        }}
        dpr={Math.min(window.devicePixelRatio, 1.5)}
        performance={{ min: 0.8 }}
      >
        <Suspense fallback={<Fallback />}>
          <ScrollControls pages={2} damping={0.1}>
            <SceneContent />
          </ScrollControls>
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
