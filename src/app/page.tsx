"use client";

import { useMemo, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useKey } from "rooks";
import { maxBy, sample, times } from "lodash";
import { Block, Shape } from "@/components";
import { BLOCK_SIZE, BORDERS, GRID_SIZE, PLAYGROUND_HEIGHT, PLAYGROUND_SIZE, SHAPES } from "@/constants";

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
