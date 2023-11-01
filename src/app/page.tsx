"use client";

import { useState } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { useIntervalWhen, useKey } from "rooks";
import { Box, Row, Col, Button } from "3oilerplate";
import { RotateCcw, RotateCw, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "react-feather";
import { times } from "lodash";
import { Block, Shape } from "@/components";
import { PLAYGROUND_SIZE } from "@/constants";
import { getInitialShape, repositionShape, rotateShape } from "@/helpers/shape";
import { IBlock, IShape } from "@/types";
import { OrbitControls } from "@react-three/drei";

const Page = () => {
  const [cameraAngle, setCameraAngle] = useState<number>(0);
  const [blocks, setBlocks] = useState<IBlock[]>([]);
  const [shape, setShape] = useState<IShape>(getInitialShape());

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

  return (
    <>
      <Canvas>
        <Playground shape={shape} blocks={blocks} />
      </Canvas>
      <Box posa w100p s={{ bottom: 0 }}>
        <Row>
          <Col s={{ justifyContent: 'flex-start' }}>
            <Box df w100p jcc s={{ flexGrow: 1 }}>
              <Button s={{ px: 'xs', py: 'xxs' }} isOutline onClick={() => onRotateShape('x', 'ccw')}><RotateCcw /></Button>
            </Box>
            <Box df w100p jcc s={{ flexGrow: 1 }}>
              <Button s={{ px: 'xs', py: 'xxs' }} isOutline onClick={() => onRotateShape('z', 'ccw')}><RotateCcw /></Button>
              <Button s={{ px: 'xs', py: 'xxs' }} isOutline onClick={() => onRotateShape('z', 'cw')}><RotateCw /></Button>
            </Box>
            <Box df w100p jcc s={{ flexGrow: 1 }}>
              <Button s={{ px: 'xs', py: 'xxs' }} isOutline onClick={() => onRotateShape('x', 'cw')}><RotateCw /></Button>
            </Box>
          </Col>
          <Col>
            <Box df w100p jcc s={{ flexGrow: 1 }}>
              <Button s={{ px: 'xs', py: 'xxs' }} isOutline onClick={() => onRepositionShape('z', -1)}><ChevronUp /></Button>
            </Box>
            <Box df w100p jcc s={{ flexGrow: 1 }}>
              <Button s={{ px: 'xs', py: 'xxs' }} isOutline onClick={() => onRepositionShape('x', -1)}><ChevronLeft /></Button>
              <Button s={{ px: 'xs', py: 'xxs' }} isOutline onClick={() => onRepositionShape('x', 1)}><ChevronRight /></Button>
            </Box>
            <Box df w100p jcc s={{ flexGrow: 1 }}>
              <Button s={{ px: 'xs', py: 'xxs' }} isOutline onClick={() => onRepositionShape('z', 1)}><ChevronDown /></Button>
            </Box>
          </Col>
        </Row>
      </Box>
    </>
  )
}

const Playground = ({ shape, blocks = [] }: { shape: IShape, blocks: IBlock[] }) => {
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

        <OrbitControls
          camera={camera}
          minDistance={3}
          maxDistance={20}
          enableRotate={true}
          rotation={[Math.PI / 5, Math.PI / 5, Math.PI / 5]}
          target={[0, 0, 0.7]}
          minPolarAngle={1.5}
          maxPolarAngle={1.5}
        />
      </group>
    </>
  )
}

export default Page
