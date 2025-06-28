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
  useTexture,
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
      <Suspense fallback={<meshBasicMaterial color="#4a90e2" />}>
        <AvatarTexture />
      </Suspense>
    </Box>
  );
}

function AvatarTexture() {
  const imagePath =
    process.env.GITHUB_PAGES
      ? "/next3js/assets/ayobami.png"
      : "/assets/ayobami.png";

  const texture = useTexture(imagePath);
  return <meshBasicMaterial map={texture} />;
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
      count={800}
      factor={4}
      saturation={0}
      fade
      speed={0.5}
    />
  );
}

interface GlowingTextProps {
  children: React.ReactNode;
  position: [number, number, number];
  fontSize: number;
  color?: string;
  glowColor?: string;
}

function GlowingText({
  children,
  position,
  fontSize,
  color = "#ffffff",
  glowColor = "#ffff00",
}: GlowingTextProps) {
  const textRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (textRef.current && textRef.current.material) {
      // Subtle pulsing effect like a bulb
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      if ("emissiveIntensity" in textRef.current.material) {
        (
          textRef.current.material as THREE.MeshStandardMaterial
        ).emissiveIntensity = pulse * 0.3;
      }
    }
  });

  return (
    <group>
      {/* Multiple point lights around the text to simulate bulb lighting */}
      <pointLight
        position={[position[0], position[1] + 1, position[2] + 2]}
        intensity={2}
        color={glowColor}
        distance={10}
        decay={2}
      />
      <pointLight
        position={[position[0] - 2, position[1], position[2] + 2]}
        intensity={1.5}
        color={glowColor}
        distance={8}
        decay={2}
      />
      <pointLight
        position={[position[0] + 2, position[1], position[2] + 2]}
        intensity={1.5}
        color={glowColor}
        distance={8}
        decay={2}
      />

      {/* The actual glowing text */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <Text
          ref={textRef}
          position={position}
          fontSize={fontSize}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          <meshStandardMaterial
            color={color}
            emissive={glowColor}
            emissiveIntensity={0.3}
            toneMapped={false}
          />
          {children}
        </Text>
      </Float>
    </group>
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

      <GlowingText
        position={[0, 8, -10]}
        fontSize={window.innerWidth > 768 ? 3 : 2}
        color="#ffffff"
        glowColor="#ffff88"
      >
        AYOBAMI ADEOYE
      </GlowingText>

      <GlowingText
        position={[-2, -2, 20]}
        fontSize={window.innerWidth > 768 ? 0.8 : 0.3}
        color="#ff6347"
        glowColor="#ff4444"
      >
        SOFTWARE ENGINEER ✌🏽
      </GlowingText>

      <Environment preset="night" />

      <fog attach="fog" args={["#1a1a2e", 10, 40]} />
    </>
  );
}

function Fallback() {
  return (
    <mesh>
      <boxGeometry args={[0, -4, 5]} />
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
        touchAction: "none",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          width: "100%",
          height: "100%",
          touchAction: "scroll",
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
