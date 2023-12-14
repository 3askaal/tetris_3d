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

  const onRotateShape = (axis: 'x' | 'y' | 'z', direction: 'cw' | 'ccw') => {
    const newShape = rotateShape(shape, bottomBlocks, axis, direction);
    if (!newShape) return;

    setShape(newShape);
  }

  const onRotatePlayground = (event: any): void => {
    const rotationRadians = event.target?.getAzimuthalAngle() || 0;
    const newRotation = rotationRadians * (180 / Math.PI);

    setRotation(newRotation);
  }

  const rotatedControls = () => {
    if (rotation < 45 && rotation > -45) {
      return {
        up: {
          pos: () => onRepositionShape('z', -1),
          rot: () => onRotateShape('x', 'cw'),
        },
        down: {
          pos: () => onRepositionShape('z', 1),
          rot: () => onRotateShape('x', 'ccw'),
        },
        left: {
          pos: () => onRepositionShape('x', -1),
          rot: () => onRotateShape('y', 'ccw'),
        },
        right: {
          pos: () => onRepositionShape('x', 1),
          rot: () => onRotateShape('y', 'cw'),
        },
      };
    }

    if (rotation >= 45 && rotation < 135) {
      return {
        up: {
          pos: () => onRepositionShape('x', -1),
          rot: () => onRotateShape('y', 'cw'),
        },
        down: {
          pos: () => onRepositionShape('x', 1),
          rot: () => onRotateShape('y', 'ccw'),
        },
        left: {
          pos: () => onRepositionShape('z', 1),
          rot: () => onRotateShape('z', 'ccw'),
        },
        right: {
          pos: () => onRepositionShape('z', -1),
          rot: () => onRotateShape('z', 'cw'),
        },
      }
    }

    if (rotation < -45 && rotation > -135) {
      return {
        up: {
          pos: () => onRepositionShape('x', 1),
          rot: () => onRotateShape('y', 'ccw'),
        },
        down: {
          pos: () => onRepositionShape('x', -1),
          rot: () => onRotateShape('y', 'cw'),
        },
        left: {
          pos: () => onRepositionShape('z', -1),
          rot: () => onRotateShape('z', 'ccw'),
        },
        right: {
          pos: () => onRepositionShape('z', 1),
          rot: () => onRotateShape('z', 'cw'),
        },
      }
    }

    return {
      up: {
        pos: () => onRepositionShape('x', -1),
        rot: () => onRotateShape('y', 'ccw'),
      },
      down: {
        pos: () => onRepositionShape('x', 1),
        rot: () => onRotateShape('y', 'cw'),
      },
      left: {
        pos: () => onRepositionShape('z', 1),
        rot: () => onRotateShape('x', 'ccw'),
      },
      right: {
        pos: () => onRepositionShape('z', -1),
        rot: () => onRotateShape('x', 'cw'),
      },
    }
  }

  useKey('ArrowUp', (params: KeyboardEvent) => {
    if (params.shiftKey) rotatedControls().up.rot();
    else rotatedControls().up.pos();
  })

  useKey('ArrowDown', (params: KeyboardEvent) => {
    if (params.shiftKey) rotatedControls().down.rot();
    else rotatedControls().down.pos();
  })

  useKey('ArrowLeft', (params: KeyboardEvent) => {
    if (params.shiftKey) rotatedControls().left.rot();
    else rotatedControls().left.pos();
  })

  useKey('ArrowRight', (params: KeyboardEvent) => {
    if (params.shiftKey) rotatedControls().right.rot();
    else rotatedControls().right.pos();
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
            rotatedControls={rotatedControls}
            onReposition={onRepositionShape}
          />
        </Container>
      </Box>
    </>
  )
}

export default Page
