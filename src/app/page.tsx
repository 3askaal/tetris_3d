"use client";

import { useEffect, useMemo, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useIntervalWhen, useKey, useKeys } from "rooks";
import { findIndex, isEqual, last, max, maxBy, pull, sample, sortBy, times } from "lodash";
import randomColor from 'randomcolor';
import { Block, Plane, Shape } from "@/components";
import { PLAYGROUND_HEIGHT, PLAYGROUND_SIZE, SHAPES } from "@/constants";
import { checkPos } from "@/helpers/shape";
import { IBlock, IShape } from "@/types";

const initialShape = () => {
  const shapeBlocks = sample(SHAPES) || [];

  return {
    pos: { x: 0, z: 0, y: PLAYGROUND_HEIGHT },
    blocks: shapeBlocks,
    size: {
      x: (maxBy(shapeBlocks, 'x')?.x || 0) + 1,
      z: (maxBy(shapeBlocks, 'z')?.z || 0) + 1,
      y: (maxBy(shapeBlocks, 'y')?.y || 0) + 1,
    },
    color: randomColor({ luminosity: 'light' }),
  }
}

export default function Playground() {
  const [cameraAngle, setCameraAngle] = useState<number>(0);
  const [blocks, setBlocks] = useState<IBlock[]>([]);
  const [shape, setShape] = useState<IShape>(initialShape());

  useKey('ArrowUp', (params) => {
    if (params.shiftKey) rotateShape('x', 'cw');
    else if (params.altKey) setCameraAngle(cameraAngle + 1);
    else changePos('z', -1);
  })

  useKey('ArrowDown', (params) => {
    if (params.shiftKey) rotateShape('x', 'ccw');
    else if (params.altKey) setCameraAngle(cameraAngle + 1);
    else changePos('z', 1);
  })

  useKey('ArrowLeft', (params) => {
    if (params.shiftKey) rotateShape('z', 'ccw');
    else if (params.altKey) setCameraAngle(cameraAngle + 1);
    else changePos('x', -1);
  })

  useKey('ArrowRight', (params) => {
    if (params.shiftKey) rotateShape('z', 'cw');
    else if (params.altKey) setCameraAngle(cameraAngle + 1);
    else changePos('x', 1);
  })

  useKey('Space', (params) => {
    if (params.shiftKey) return;
    changePos('y', -1);
  })

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

  const rotateShape = (axis: 'z' | 'x', direction: 'cw' | 'ccw') => {
    let newShape = { ...shape };

    const dirAxises = pull(['x', 'y', 'z'], axis) as ['x' | 'y'] | ['z' | 'y'];

    const maxSize = (max(dirAxises.map((key) => shape.size[key])) as number) - 1;

    const oppositeAxis = axis === 'z' ? 'x' : 'z';

    const orders = {
      cw: [[oppositeAxis, 0], ['y', maxSize], [oppositeAxis, maxSize], ['y', 0]],
      ccw: [['y', 0], [oppositeAxis, maxSize], ['y', maxSize], [oppositeAxis, 0]],
    };

    const axisChecks = dirAxises.map((dirAxis) => {
      return [[dirAxis, 0], [dirAxis, maxSize]];
    }).flat() as ['x' | 'y' | 'z', number][];

    newShape.blocks = newShape.blocks.map((block) => {
      const axisCheckMatches = axisChecks
        .filter((axisCheck) => {
          return block[axisCheck[0]] === axisCheck[1]
        });

      // TODO: figure out why this works
      if (axis === 'z' && direction === 'ccw' || axis === 'x' && direction === 'cw') {
        axisCheckMatches.reverse();
      }

      block = [axisCheckMatches[0]].reduce((acc, axisCheckMatch) => {
        const currentSideIndex = findIndex(orders[direction], (value) => isEqual(value, axisCheckMatch));
        const currentSide = orders[direction][currentSideIndex];
        const nextSide = orders[direction][currentSideIndex + 1] || orders[direction][0];

        return {
          ...acc,
          [nextSide[0]]: nextSide[1],
          [currentSide[0]]: acc[nextSide[0]]
        }
      }, { ...block } as any)

      // TODO: fix empty space in shape after repositioning of blocks

      return {
        ...block,
      }
    })

    shape.size = {
      x: (maxBy(shape.blocks, 'x')?.x || 0) + 1,
      z: (maxBy(shape.blocks, 'z')?.z || 0) + 1,
      y: (maxBy(shape.blocks, 'y')?.y || 0) + 1,
    }

    setShape(newShape)
  }

  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      <group
        // rotation={[0, -.33, 0]}
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
