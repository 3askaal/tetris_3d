"use client";

import { useState } from "react"
import { Canvas, ThreeEvent, useThree } from "@react-three/fiber"
import { useDebouncedValue, useIntervalWhen, useKey } from "rooks";
import { Box, Container } from "3oilerplate";
import { times } from "lodash";
import { Block, Shape } from "@/components";
import { PLAYGROUND_SIZE } from "@/constants";
import { getInitialShape, repositionShape, rotateShape } from "@/helpers/shape";
import { IBlock, IShape } from "@/types";
import { OrbitControls } from "@react-three/drei";
import { Controls } from "@/components/Controls";

const Page = () => {
  const [rotation, setRotation] = useDebouncedValue<number>(0, 1000);
  const [bottomBlocks, setBottomBlocks] = useState<IBlock[]>([]);
  const [shape, setShape] = useState<IShape>(getInitialShape());

  const onRepositionShape = (axis: 'x' | 'z' | 'y', direction: -1 | 1) => {
    const { newShape, newBottomBlocks } = repositionShape(shape, bottomBlocks, axis, direction);

    if (newShape) {
      setShape(newShape);
    }

    if (newBottomBlocks) {
      setBottomBlocks(newBottomBlocks);
    }
  }

  const onRotateShape = (axis: 'x' | 'y', direction: 'cw' | 'ccw') => {
    const newShape = rotateShape(shape, bottomBlocks, axis, direction);
    if (!newShape) return;

    setShape(newShape);
  }

  const onRotatePlayground = (event: any): void => {
    const rotationRadians = event.target?.getAzimuthalAngle() || 0;
    const newRotation = rotationRadians * (180 / Math.PI);

    setRotation(newRotation);
  }

  useKey('ArrowUp', (params: KeyboardEvent) => {
    if (params.shiftKey) onRotateShape('x', 'cw');
    else onRepositionShape('z', -1);
  })

  useKey('ArrowDown', (params: KeyboardEvent) => {
    if (params.shiftKey) onRotateShape('x', 'ccw');
    else onRepositionShape('z', 1);
  })

  useKey('ArrowLeft', (params: KeyboardEvent) => {
    if (params.shiftKey) onRotateShape('y', 'ccw');
    else if (params.altKey) setRotation(rotation - 90);
    else onRepositionShape('x', -1);
  })

  useKey('ArrowRight', (params: KeyboardEvent) => {
    if (params.shiftKey) onRotateShape('y', 'cw');
    else if (params.altKey) setRotation(rotation + 90);
    else onRepositionShape('x', 1);
  })

  useKey('Space', () => {
    onRepositionShape('y', -1);
  })

  useIntervalWhen(() => {
    onRepositionShape('y', -1);
  }, 1000)

  return (
    <>
      <Canvas>
        <Playground shape={shape} bottomBlocks={bottomBlocks} onRotate={onRotatePlayground} />
      </Canvas>
      <Box posa w100p df jcc s={{ bottom: 0, overflow: 'hidden', pb: 'm' }}>
        <Container s={{ maxWidth: '400px' }}>
          <Controls onRotate={onRotateShape} onReposition={onRepositionShape} rotation={rotation} />
        </Container>
      </Box>
    </>
  )
}

const Playground = ({ shape, bottomBlocks = [], onRotate }: { shape: IShape, bottomBlocks: IBlock[], onRotate: (event: any) => void }) => {
  const { camera } = useThree();

  return (
    <>
      <ambientLight />
      <group scale={0.2}>
        <Shape {...shape} />

        { bottomBlocks?.map((bottomBlock, i) => (
          <Block key={`block-${i}`} {...bottomBlock} />
        )) }

        { times(PLAYGROUND_SIZE * PLAYGROUND_SIZE, (i) => {
          const x = i % PLAYGROUND_SIZE;
          const z = Math.floor(i / PLAYGROUND_SIZE);
          const y = 0;

          return (
            <Block key={`bottom-${i}`} x={x} y={y} z={z} color={'#ffffff'} />
          )
        }) }

        <OrbitControls
          camera={camera}
          minDistance={4.25}
          maxDistance={4.25}
          enableRotate={true}
          enableZoom={false}
          enablePan={false}
          onChange={onRotate}
          target={[0.7, 1.4, 0.7]}
          minPolarAngle={1.5}
          maxPolarAngle={1.5}
        />
      </group>
    </>
  )
}

export default Page
