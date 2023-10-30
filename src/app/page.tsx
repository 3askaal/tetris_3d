"use client";

import { useEffect, useMemo, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useIntervalWhen, useKey, useKeys } from "rooks";
import { maxBy, sample, times } from "lodash";
import randomColor from 'randomcolor';
import { Block, Plane, Shape } from "@/components";
import { PLAYGROUND_HEIGHT, PLAYGROUND_SIZE, SHAPES } from "@/constants";
import { checkPos } from "@/helpers/shape";
import { IBlock, IShape } from "@/types";

const initialShape = () => {
  const shapeType: { x: IBlock[][] } = sample(SHAPES)!;
  const shapeBlocks = shapeType.x[0]

  return {
    pos: { x: 0, z: 0, y: PLAYGROUND_HEIGHT },
    blocks: shapeBlocks,
    rotations: shapeType,
    size: {
      x: (maxBy(shapeBlocks, 'x')?.x || 0) + 1,
      z: (maxBy(shapeBlocks, 'z')?.z || 0) + 1,
      y: (maxBy(shapeBlocks, 'y')?.y || 0) + 1,
    },
    color: randomColor({ luminosity: 'light' }),
  }
}

export default function Playground() {
  // const [pos, setPos] = useState();
  const [cameraAngle, setCameraAngle] = useState<number>(0);
  const [blocks, setBlocks] = useState<IBlock[]>([]);
  const [shape, setShape] = useState<IShape>(initialShape());

  useKey('ArrowUp', () => changePos('z', -1))
  useKey('ArrowDown', () => changePos('z', 1))
  useKey('ArrowLeft', () => changePos('x', -1))
  useKey('ArrowRight', () => changePos('x', 1))
  useKey('Space', () => changePos('y', -1))

  // useKeys(['Shift', 'ArrowLeft'], () => setCameraAngle(cameraAngle - 1))
  // useKeys(['Shift', 'ArrowRight'], () => setCameraAngle(cameraAngle + 1))

  useKeys(['Shift', 'ArrowLeft'], () => rotateShape('x', -1))
  useKeys(['Shift', 'ArrowRight'], () => rotateShape('x', 1))
  useKeys(['Shift', 'ArrowUp'], () => rotateShape('y', 1))
  useKeys(['Shift', 'ArrowDown'], () => rotateShape('y', -1))

  useIntervalWhen(() => {
    changePos('y', -1);
  }, 1000)

  const changePos = (axis: 'x' | 'z' | 'y', direction: -1 | 1) => {
    const newShape = {
      ...shape,
      pos: {
        ...shape.pos,
        [axis]: shape.pos[axis] + direction
      }
    }

    const { hitsBlock, hitsSide, hitsBottom } = checkPos(newShape, blocks, { width: PLAYGROUND_SIZE, height: PLAYGROUND_HEIGHT });

    if (hitsSide) {
      return;
    }

    if (hitsBlock || hitsBottom) {
      const newBlocks = [
        ...blocks,
        ...shape.blocks.map((block) => ({
          x: block.x + shape.pos.x,
          y: block.y + shape.pos.y,
          z: block.z + shape.pos.z,
          color: shape.color
        }))
      ];

      setBlocks(newBlocks);
      setShape(initialShape());

      return;
    }

    setShape(newShape);
  }

  const rotateShape = (axis: 'x' | 'y', direction: -1 | 1) => {
    let newShape = { ...shape };

    // newShape.blocks =

    setShape(newShape)
  }

  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      <group
        // rotation={[0, -.33, 0]}
        rotation={[0, (Math.PI / 2) * cameraAngle, 0]}
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
