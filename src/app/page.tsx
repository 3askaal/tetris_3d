"use client";

import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { useIntervalWhen, useKey } from "rooks";
import { times } from "lodash";
import { Block, Shape } from "@/components";
import { PLAYGROUND_SIZE } from "@/constants";
import { getInitialShape, repositionShape, rotateShape } from "@/helpers/shape";
import { IBlock, IShape } from "@/types";



export default function Playground() {
  const [cameraAngle, setCameraAngle] = useState<number>(0);
  const [blocks, setBlocks] = useState<IBlock[]>([]);
  const [shape, setShape] = useState<IShape>(getInitialShape());

  useKey('ArrowUp', (params) => {
    if (params.shiftKey) onRotateShape('x', 'cw');
    else if (params.altKey) setCameraAngle(cameraAngle + 1);
    else onRepositionShape('z', -1);
  })

  useKey('ArrowDown', (params) => {
    if (params.shiftKey) onRotateShape('x', 'ccw');
    else if (params.altKey) setCameraAngle(cameraAngle + 1);
    else onRepositionShape('z', 1);
  })

  useKey('ArrowLeft', (params) => {
    if (params.shiftKey) onRotateShape('z', 'ccw');
    else if (params.altKey) setCameraAngle(cameraAngle + 1);
    else onRepositionShape('x', -1);
  })

  useKey('ArrowRight', (params) => {
    if (params.shiftKey) onRotateShape('z', 'cw');
    else if (params.altKey) setCameraAngle(cameraAngle + 1);
    else onRepositionShape('x', 1);
  })

  useKey('Space', () => {
    onRepositionShape('y', -1);
  })

  useIntervalWhen(() => {
    onRepositionShape('y', -1);
  }, 1000)

  const onRepositionShape = (axis: 'x' | 'z' | 'y', direction: -1 | 1) => {
    const positionData = repositionShape(shape, blocks, axis, direction);
    if (!positionData) return;

    setShape(positionData.shape);
    setBlocks(positionData.blocks);
  }

  const onRotateShape = (axis: 'z' | 'x', direction: 'cw' | 'ccw') => {
    const newShape = rotateShape(shape, axis, direction);

    setShape(newShape);
  }

  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <group
        rotation={[0, (Math.PI / 4) * cameraAngle, 0]}
        position={[-0.75, -1.5, 0]}
        scale={0.2}
      >
        <Shape {...shape} />

        { blocks?.map((block, i) => (
          <Block key={`block-${i}`} position={[block.x, block.y, block.z]} color={block.color} />
        )) }

        { times(PLAYGROUND_SIZE * PLAYGROUND_SIZE, (i) => {
          const x = i % PLAYGROUND_SIZE;
          const z = Math.floor(i / PLAYGROUND_SIZE);
          const y = 0;

          return (
            <Block key={`bottom-${i}`} position={[x, y, z]} color={'#ffffff'} />
          )
        }) }
      </group>
    </Canvas>
  )
}
