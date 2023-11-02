"use client";

import { useState } from "react"
import { Canvas, useThree } from "@react-three/fiber"
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

  useIntervalWhen(() => {
    onRepositionShape('y', -1);
  }, 1000)

  const onRepositionShape = (axis: 'x' | 'z' | 'y', direction: -1 | 1) => {
    const { newShape, newBottomBlocks } = repositionShape(shape, bottomBlocks, axis, direction);

    if (newShape) {
      setShape(newShape);
    }

    if (newBottomBlocks) {
      setBottomBlocks(newBottomBlocks);
    }
  }

  const onRotateShape = (axis: 'z' | 'x', direction: 'cw' | 'ccw') => {
    const newShape = rotateShape(shape, bottomBlocks, axis, direction);
    if (!newShape) return;

    setShape(newShape);
  }

  useKey('ArrowUp', (params) => {
    if (params.shiftKey) onRotateShape('x', 'cw');
    else if (params.altKey) setRotation(0);
    else onRepositionShape('z', -1);
  })

  useKey('ArrowDown', (params) => {
    if (params.shiftKey) onRotateShape('x', 'ccw');
    else if (params.altKey) setRotation(0);
    else onRepositionShape('z', 1);
  })

  useKey('ArrowLeft', (params) => {
    if (params.shiftKey) onRotateShape('z', 'ccw');
    else if (params.altKey) setRotation(0);
    else onRepositionShape('x', -1);
  })

  useKey('ArrowRight', (params) => {
    if (params.shiftKey) onRotateShape('z', 'cw');
    else if (params.altKey) setRotation(0);
    else onRepositionShape('x', 1);
  })

  useKey('Space', () => {
    onRepositionShape('y', -1);
  })

  const onRotate = (e: any) => {
    const radians = e.target.getAzimuthalAngle();
    const newRotation = radians * (180 / Math.PI);

    setRotation(newRotation);
  }

  return (
    <>
      <Canvas>
        <Playground shape={shape} bottomBlocks={bottomBlocks} onRotate={onRotate} />
      </Canvas>
      <Box posa w100p df jcc s={{ bottom: 0, overflow: 'hidden', pb: 'm' }}>
        <Container s={{ maxWidth: '400px' }}>
          <Controls onRotate={onRotateShape} onReposition={onRepositionShape} rotation={rotation} />
        </Container>
      </Box>
    </>
  )
}

const Playground = ({ shape, bottomBlocks = [], onRotate }: { shape: IShape, bottomBlocks: IBlock[], onRotate: any }) => {
  const { camera } = useThree();

  return (
    <>
      <ambientLight />
      {/* <pointLight position={[10, 10, 10]} /> */}
      <group
        // rotation={[0, (Math.PI / 4) * cameraAngle, 0]}
        position={[-0.7, -1.5, 0]}
        scale={0.2}
      >
        <Shape {...shape} />

        { bottomBlocks?.map((bottomBlock, i) => (
          <Block
            key={`block-${i}`}
            position={[bottomBlock.x, bottomBlock.y, bottomBlock.z]}
            color={bottomBlock.color}
          />
        )) }

        { times(PLAYGROUND_SIZE * PLAYGROUND_SIZE, (i) => {
          const x = i % PLAYGROUND_SIZE;
          const z = Math.floor(i / PLAYGROUND_SIZE);
          const y = 0;

          return (
            <Block key={`bottom-${i}`} position={[x, y, z]} color={'#ffffff'} />
          )
        }) }

        <OrbitControls
          camera={camera}
          minDistance={4.5}
          maxDistance={4.5}
          enableRotate={true}
          rotation={[Math.PI / 5, Math.PI / 5, Math.PI / 5]}
          onChange={onRotate}
          target={[0, 0, 0.7]}
          minPolarAngle={1.5}
          maxPolarAngle={1.5}
        />
      </group>
    </>
  )
}

export default Page
