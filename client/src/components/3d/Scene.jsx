import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import * as THREE from 'three';

const toRadians = (degrees) => degrees * (Math.PI / 180);

function Relationship({ data, objects }) {
  const fromObj = objects.find(obj => obj.id === data.from);
  const toObj = objects.find(obj => obj.id === data.to);
  if (!fromObj || !toObj) return null;
  const start = new THREE.Vector3(...fromObj.position);
  const end = new THREE.Vector3(...toObj.position);
  const midPoint = new THREE.Vector3().lerpVectors(start, end, 0.5).add(new THREE.Vector3(0, 0.5, 0));
  return (
    <>
      <Line points={[start, end]} color="black" lineWidth={2} />
      <Text position={midPoint} fontSize={0.4} color="black" anchorX="center" anchorY="middle">
        {data.label}
      </Text>
    </>
  );
}

function SceneObject({ data, allObjects, sequence, currentStep }) {
  const groupRef = useRef();
  const materialRef = useRef();

  const initialState = useMemo(() => ({
    position: new THREE.Vector3(...(data.position || [0, 0, 0])),
    scale: new THREE.Vector3(1, 1, 1),
    rotation: new THREE.Euler(...(data.rotation ? data.rotation.map(toRadians) : [0, 0, 0])),
    color: new THREE.Color(data.color || 'grey'),
    visible: data.visible !== false,
  }), [data]);

  const [targetState, setTargetState] = useState(initialState);

  useEffect(() => {
    let finalState = { ...initialState };
    if (sequence && sequence.length > 0) {
      for (let i = 1; i <= currentStep; i++) {
        const stepData = sequence.find(s => s.step === i && s.targetId === data.id);
        if (stepData) {
          const { action, params } = stepData;
          // --- BULLETPROOF CHECKS ---
          if (action === 'move' && params?.position && Array.isArray(params.position)) {
            finalState.position = new THREE.Vector3(...params.position);
          }
          if (action === 'scale' && params?.scale && Array.isArray(params.scale)) {
            finalState.scale = new THREE.Vector3(...params.scale);
          }
          if (action === 'rotate' && params?.rotation && Array.isArray(params.rotation)) {
            finalState.rotation = new THREE.Euler(...params.rotation.map(toRadians));
          }
          if (action === 'changeColor' && params?.color) {
            finalState.color = new THREE.Color(params.color);
          }
          if (action === 'appear') finalState.visible = true;
          if (action === 'disappear') finalState.visible = false;
        }
      }
    }
    setTargetState(finalState);
  }, [currentStep, sequence, data.id, initialState]);
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const speed = delta * 3;

    if (sequence && sequence.length > 0) {
      groupRef.current.position.lerp(targetState.position, speed);
      groupRef.current.scale.lerp(targetState.scale, speed);
      groupRef.current.quaternion.slerp(new THREE.Quaternion().setFromEuler(targetState.rotation), speed);
      if (materialRef.current) {
        materialRef.current.color.lerp(targetState.color, speed);
      }
      groupRef.current.visible = targetState.visible;
    } else {
      if (data.orbitRadius) {
        const angle = state.clock.getElapsedTime() * (data.orbitSpeed || 0.1);
        groupRef.current.position.x = Math.sin(angle) * data.orbitRadius;
        groupRef.current.position.z = Math.cos(angle) * data.orbitRadius;
      }
      if (data.rotationSpeed && groupRef.current.children[0]) {
        groupRef.current.children[0].rotation.y += delta * data.rotationSpeed;
      }
    }
  });

  const children = allObjects.filter(obj => obj.parent === data.id);
  const s = data.size || [1];
  const safeSize = [s[0] || 1, s[1] || s[0] || 1, s[2] || s[0] || 1];
  let geometry;
  switch (data.shape) {
    case 'cube': case 'box': geometry = <boxGeometry args={safeSize} />; break;
    case 'sphere': geometry = <sphereGeometry args={[(safeSize[0] + safeSize[1] + safeSize[2]) / 6, 32, 32]} />; break;
    case 'cone': case 'pyramid': geometry = <coneGeometry args={[safeSize[0] / 2, safeSize[1], 32]} />; break;
    case 'cylinder': geometry = <cylinderGeometry args={[safeSize[0] / 2, safeSize[0] / 2, safeSize[1], 32]} />; break;
    case 'torus': case 'donut': geometry = <torusGeometry args={[safeSize[0] / 2, safeSize[2] / 2 || safeSize[0] / 4, 16, 100]} />; break;
    case 'plane': geometry = <planeGeometry args={[safeSize[0], safeSize[1]]} />; break;
    case 'ring': const outerRadius = safeSize[0] / 2; const innerRadius = outerRadius * 0.7; geometry = <ringGeometry args={[innerRadius, outerRadius, 32]} />; break;
    case 'octahedron': geometry = <octahedronGeometry args={[safeSize[0] / 2, 0]} />; break;
    case 'icosahedron': geometry = <icosahedronGeometry args={[safeSize[0] / 2, 0]} />; break;
    default: geometry = <boxGeometry args={safeSize} />; break;
  }

  return (
    <group ref={groupRef} position={initialState.position}>
      <mesh>
        {geometry}
        <meshStandardMaterial ref={materialRef} color={initialState.color} emissive={data.emissive ? data.color : 'black'} emissiveIntensity={data.emissive ? 1.5 : 0} />
      </mesh>
      {data.label && data.showLabel && (<Text position={[0, (safeSize[1] / 2) + 0.5, 0]} fontSize={0.5} color="black" anchorX="center" anchorY="middle">{data.label}</Text>)}
      {children.map(child => <SceneObject key={child.id} data={child} allObjects={allObjects} sequence={sequence} currentStep={currentStep} />)}
    </group>
  );
}

function Scene({ data, currentStep }) {
  const objects = data.objects || [];
  const relationships = data.relationships || [];
  const sequence = data.sequence || [];
  const rootObjects = objects.filter(obj => !obj.parent);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <OrbitControls />
      {rootObjects.map(obj => (
        <SceneObject key={obj.id} data={obj} allObjects={objects} sequence={sequence} currentStep={currentStep} />
      ))}
      {relationships.map((rel, index) => (
        <Relationship key={index} data={rel} objects={objects} />
      ))}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#ADD8E6" />
      </mesh>
    </>
  );
}

export default Scene;