"use client";

import { useEffect, useMemo, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useIntervalWhen, useKey } from "rooks";
import { maxBy, sample, times } from "lodash";
import { Block, Shape } from "@/components";
import { PLAYGROUND_HEIGHT, PLAYGROUND_SIZE, SHAPES } from "@/constants";
import { checkPos } from "@/helpers/shape";
import { IBlock } from "@/types";

const initialPos = { x: 0, z: 0, y: 0 };

export default function Playground() {
  const [pos, setPos] = useState(initialPos);
  const [blocks, setBlocks] = useState<IBlock[]>([]);
  const shapeBlocks = useMemo(() => sample(SHAPES) || [], [blocks.length]);
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

  useIntervalWhen(() => {
    changePos('y', -1);
  }, 1000)

  const changePos = (axis: 'x' | 'z' | 'y', direction: -1 | 1) => {
    const newPos = { ...pos, [axis]: pos[axis] + direction };

    const { hitsBlock, hitsSide, hitsBottom } = checkPos({ pos: newPos, size: shapeSize, blocks: shapeBlocks }, blocks, { width: PLAYGROUND_SIZE, height: PLAYGROUND_HEIGHT });

    if (hitsSide) {
      return;
    }

    if (hitsBlock || hitsBottom) {
      const newBlocks = [
        ...blocks,
        ...shapeBlocks.map((block) => ({
          x: block.x + pos.x,
          y: block.y + pos.y,
          z: block.z + pos.z,
        }))
      ];

      setBlocks(newBlocks);
      setPos(initialPos);

      return;
    }

    setPos(newPos);
  }

  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      <group rotation={[0, 0, 0]} position={[-0.75, 2, 0]} scale={0.2}>
        <Shape blocks={shapeBlocks} pos={pos} />

        { blocks?.map((block, i) => (
          <Block key={`block-${i}`} position={[block.x, block.y, block.z]} color={'#ffffff'} />
        )) }

        { times(PLAYGROUND_SIZE * PLAYGROUND_SIZE, (i) => {
          const x = i % PLAYGROUND_SIZE;
          const z = Math.floor(i / PLAYGROUND_SIZE);
          const y = -(PLAYGROUND_HEIGHT + 1);

          return (
            <Block key={`bottom-${i}`} position={[x, y, z]} color={'#ffffff'} />
          )
        }) }
      </group>
    </Canvas>
  )
}
