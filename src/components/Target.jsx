import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

const Target = (props) => {
  const targetRef = useRef();

  useFrame((state, delta) => {
    targetRef.current.rotation.y += delta * 0.5;
  });

  return (
    <group {...props} ref={targetRef}>
      <mesh>
        <torusGeometry args={[2, 0.1, 16, 100]} />
        <meshStandardMaterial color="#00ff88" />
      </mesh>
      <mesh>
        <torusGeometry args={[1.5, 0.1, 16, 100]} />
        <meshStandardMaterial color="#0088ff" />
      </mesh>
      <mesh>
        <circleGeometry args={[1, 32]} />
        <meshStandardMaterial color="#ff0088" />
      </mesh>
    </group>
  );
};

export default Target;
