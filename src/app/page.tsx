"use client";

import { Canvas, useFrame } from "@react-three/fiber"
import { maxBy, sample, times } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react"
import { Edges } from "@react-three/drei";
import { SHAPES } from "./constants";
import { useKey } from "rooks";

const PLAYGROUND_SIZE = 12;
const PLAYGROUND_HEIGHT = 16;
const BLOCK_SIZE = 0.2;
const GRID_SIZE = PLAYGROUND_SIZE * BLOCK_SIZE;
const BORDERS = {
  x: [-((PLAYGROUND_SIZE / 2) - 1), PLAYGROUND_SIZE / 2],
  z: [0, (PLAYGROUND_SIZE - 1)]
}

interface Pos {
  x: number;
  y: number;
  z: number;
}

const Shape = ({ blocks, pos }: { blocks: Pos[], pos: Pos }) => {
  return blocks.map((block, i) => {
    const x = (pos.x * BLOCK_SIZE) + (block.x * BLOCK_SIZE);
    const z = (pos.z * BLOCK_SIZE) + (block.z * BLOCK_SIZE);
    const y = (pos.y * BLOCK_SIZE) + (block.y * BLOCK_SIZE);

    return (
      <Block key={`block-${i}`} position={[x, y, z]} color={'#8E8FFA'} />
    )
  })
}

const Block = ({ color, ...props }: any) => {
  const ref = useRef({ rotation: { x: 0, y: 0 } })
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)

  return (
    <mesh
      {...props}
      ref={ref}
      scale={0.95}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE]}  />
      <Edges />
      <meshStandardMaterial transparent={true} opacity={0.8} color={color} />
    </mesh>
  )
}

export default function Playground() {
  const [pos, setPos] = useState({ x: 0, z: 0, y: PLAYGROUND_HEIGHT / 2 });
  const shapeBlocks = useMemo(() => sample(SHAPES) || [], []);
  const shapeSize = useMemo(() => ({
    x: (maxBy(shapeBlocks, 'x')?.x || 0),
    z: (maxBy(shapeBlocks, 'z')?.z || 0),
    y: (maxBy(shapeBlocks, 'y')?.y || 0),
  }), [shapeBlocks]);

  useKey(['ArrowUp'], () => changePos('z', -1))
  useKey(['ArrowDown'], () => changePos('z', 1))
  useKey(['ArrowLeft'], () => changePos('x', -1))
  useKey(['ArrowRight'], () => changePos('x', 1))
  useKey(['Space'], () => changePos('y', -1))

  const changePos = (axis: 'x' | 'z' | 'y', direction: -1 | 1) => {
    const newPos = { ...pos, [axis]: pos[axis] + direction };

    if (axis === 'x' || axis === 'z') {
      if (newPos[axis] < BORDERS[axis][0]) {
        return;
      }

      if (newPos[axis] + shapeSize[axis] > BORDERS[axis][1]) {
        return;
      }
    }

    if (axis === 'y' && newPos[axis] < -((PLAYGROUND_HEIGHT / 2) - 1)) {
      return;
    }

    setPos(newPos);
  }

  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      <group rotation={[0, 0, 0]}>
        <Shape blocks={shapeBlocks} pos={pos} />

        { times(PLAYGROUND_SIZE * PLAYGROUND_SIZE, (i) => {
          const x = (((i % PLAYGROUND_SIZE) + 1) * BLOCK_SIZE) - (GRID_SIZE / 2);
          const z = Math.floor(i / PLAYGROUND_SIZE) * BLOCK_SIZE;
          const y = -(BLOCK_SIZE * (PLAYGROUND_HEIGHT / 2));

          return (
            <Block key={`block-${i}`} position={[x, y, z]} color={'#ffffff'} />
          )
        }) }
      </group>
    </Canvas>
  )
}
