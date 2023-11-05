"use client";

import { useState } from "react"
import { useDebouncedValue, useIntervalWhen, useKey } from "rooks";
import { Canvas } from "@react-three/fiber"
import { Box, Container } from "3oilerplate";
import { Playground, Controls } from "@/components";
import { getInitialShape, repositionShape, rotateShape } from "@/helpers/shape";
import { IBlock, IShape } from "@/types";

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

  const controls = {
    up: {
      position: () => onRepositionShape('z', -1),
      rotate: () => onRotateShape('x', 'cw'),
    },
    down: {
      position: () => onRepositionShape('z', 1),
      rotate: () => onRotateShape('x', 'ccw'),
    },
    left: {
      position: () => onRepositionShape('x', -1),
      rotate: () => onRotateShape('y', 'ccw'),
    },
    right: {
      position: () => onRepositionShape('x', 1),
      rotate: () => onRotateShape('y', 'cw'),
    },
  }

  const rotatedControls = () => {
    if (rotation < 45 && rotation > -45) {
      return controls;
    }

    if (rotation >= 45 && rotation < 135) {
      return {
        up: controls.left,
        down: controls.right,
        left: controls.down,
        right: controls.up
      }
    }

    if (rotation < -45 && rotation > -135) {
      return {
        up: controls.right,
        down: controls.left,
        left: controls.up,
        right: controls.down
      }
    }

    return {
      up: controls.down,
      down: controls.up,
      left: controls.right,
      right: controls.left
    }
  }

  useKey('ArrowUp', (params: KeyboardEvent) => {
    if (params.shiftKey) rotatedControls().up.rotate();
    else rotatedControls().up.position();
  })

  useKey('ArrowDown', (params: KeyboardEvent) => {
    if (params.shiftKey) rotatedControls().down.rotate();
    else rotatedControls().down.position();
  })

  useKey('ArrowLeft', (params: KeyboardEvent) => {
    if (params.shiftKey) rotatedControls().left.rotate();
    else rotatedControls().left.position();
  })

  useKey('ArrowRight', (params: KeyboardEvent) => {
    if (params.shiftKey) rotatedControls().right.rotate();
    else rotatedControls().right.position();
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
        <Playground
          shape={shape}
          bottomBlocks={bottomBlocks}
          onRotate={onRotatePlayground}
        />
      </Canvas>
      <Box posa w100p df jcc s={{ bottom: 0, overflow: 'hidden', pb: 'm' }}>
        <Container s={{ maxWidth: '400px' }}>
          <Controls
            rotation={rotation}
            onReposition={onRepositionShape}
            onRotate={onRotateShape}
          />
        </Container>
      </Box>
    </>
  )
}

export default Page
