"use client";

import { Canvas, useFrame } from "@react-three/fiber"
import { times } from "lodash";
import { useRef, useState } from "react"

const Block = (props: any) => {
  const ref = useRef({ rotation: { x: 0, y: 0 } })
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)

  useFrame((state, delta) => (ref.current.rotation.x += delta))

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

const PLAYGROUND_SIZE = 3;

export default function Playground() {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      { times(PLAYGROUND_SIZE * PLAYGROUND_SIZE, (i) => {
        const x = -1.5 + ((i % 3) + 1);
        const y = Math.floor(i / PLAYGROUND_SIZE);

        return (
          <Block key={`block-${i}`} position={[x, 0, y]} />
        )
      }) }
    </Canvas>
  )
}
