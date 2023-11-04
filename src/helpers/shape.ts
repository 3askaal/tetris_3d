import { findIndex, isEqual, max, maxBy, minBy, pull, sample } from "lodash";
import randomColor from "randomcolor";
import { PLAYGROUND_SIZE, PLAYGROUND_HEIGHT, SHAPES } from "@/constants";
import { IBlock, IShape } from "@/types";

export const getInitialShape = () => {
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

export const checkPos = (nextShape: IShape, bottomBlocks: IBlock[]) => {
  const { pos, size, blocks } = nextShape;

  const hitsBlock = bottomBlocks.some((bottomBlock: IBlock) =>
    blocks.some((shapeBlock) =>
      (pos.x + shapeBlock.x) === bottomBlock.x &&
      (pos.y + shapeBlock.y) === bottomBlock.y &&
      (pos.z + shapeBlock.z) === bottomBlock.z
    )
  );

  const hitsBottom = pos.y === 0;
  const hitsSideX = (pos.x < 0) || (pos.x + size.x > PLAYGROUND_SIZE);
  const hitsSideZ = (pos.z < 0) || (pos.z + size.z > PLAYGROUND_SIZE);
  const hitsSide = hitsSideX || hitsSideZ;

  return {
    hitsBlock,
    hitsBottom,
    hitsSide,
    fix: {
      ...(hitsSide && {
        side: {
          ...(hitsSideX && { x: (pos.x < 0) ? Math.abs(pos.x) : pos.x + size.x - PLAYGROUND_SIZE }),
          ...(hitsSideZ && { z: (pos.z < 0) ? Math.abs(pos.z) : pos.z + size.z - PLAYGROUND_SIZE }),
        }
      })
    }
  }
}

export const repositionShape = (shape: IShape, bottomBlocks: IBlock[], axis: 'x' | 'z' | 'y', direction: -1 | 1) => {
  let newShape = {
    ...shape,
    pos: {
      ...shape.pos,
      [axis]: shape.pos[axis] + direction
    }
  };

  let newBottomBlocks = [...bottomBlocks];

  const { hitsBlock, hitsSide, hitsBottom } = checkPos(newShape, bottomBlocks);

  if (hitsSide) {
    return {};
  }

  if (hitsBlock || hitsBottom) {
    newBottomBlocks = [
      ...bottomBlocks,
      ...shape.blocks.map((block) => ({
        x: block.x + shape.pos.x,
        y: block.y + shape.pos.y,
        z: block.z + shape.pos.z,
        color: shape.color
      }))
    ];

    newShape = getInitialShape()
  }

  return {
    newShape,
    newBottomBlocks,
  }
}

type TAxis = 'x' | 'y' | 'z';

export const rotateShape = (shape: IShape, blocks: IBlock[], axis: 'x' | 'y', direction: 'cw' | 'ccw') => {
  let newShape = { ...shape };

  const dirAxises = pull(['x', 'y', 'z'], axis) as ['x' | 'y'] | ['z' | 'y'];
  const maxSize = (max(dirAxises.map((key) => shape.size[key])) as number) - 1;
  const oppositeAxis = axis === 'x' ? 'y' : 'x';

  const orders: { cw: [TAxis, number][], ccw: [TAxis, number][] } = {
    cw: [[oppositeAxis, 0], ['z', maxSize], [oppositeAxis, maxSize], ['z', 0]],
    ccw: [['z', 0], [oppositeAxis, maxSize], ['z', maxSize], [oppositeAxis, 0]],
  };

  const axisChecks = dirAxises.map((dirAxis) => [[dirAxis, 0], [dirAxis, maxSize]]).flat() as [TAxis, number][];

  newShape.blocks = newShape.blocks.map((block) => {
    const axisCheckMatches = axisChecks
      .filter((axisCheck) => {
        return block[axisCheck[0]] === axisCheck[1]
      });

    // TODO: figure out why this works
    // // if (axis === 'y' && direction === 'cw') {
    //   axisCheckMatches.reverse();
    // }

    const currentSideIndex = findIndex(orders[direction], (value) => isEqual(value, axisCheckMatches[0]));
    const currentSide = orders[direction][currentSideIndex];
    const nextSide = orders[direction][currentSideIndex + 1] || orders[direction][0];

    block = {
      ...block,
      [nextSide[0]]: nextSide[1],
      [currentSide[0]]: block[nextSide[0]]
    }

    return block;
  });

  const negativeSpace = {
    x: (minBy(newShape.blocks, 'x')?.x || 0),
    y: (minBy(newShape.blocks, 'y')?.y || 0),
    z: (minBy(newShape.blocks, 'z')?.z || 0),
  };

  newShape.blocks = newShape.blocks.map((block) => ({
    ...block,
    x: negativeSpace.x < 0 ? block.x + Math.abs(negativeSpace.x) : block.x - Math.abs(negativeSpace.x),
    y: negativeSpace.y < 0 ? block.y + Math.abs(negativeSpace.y) : block.y - Math.abs(negativeSpace.y),
    z: negativeSpace.z < 0 ? block.z + Math.abs(negativeSpace.z) : block.z - Math.abs(negativeSpace.z),
  }));

  newShape.size = {
    x: (maxBy(newShape.blocks, 'x')?.x || 0) + 1,
    y: (maxBy(newShape.blocks, 'y')?.y || 0) + 1,
    z: (maxBy(newShape.blocks, 'z')?.z || 0) + 1,
  };

  const { hitsBlock, hitsBottom, hitsSide, fix } = checkPos(newShape, blocks)

  if (hitsBlock || hitsBottom) {
    return null
  }

  if (hitsSide) {
    newShape.pos = {
      x: newShape.pos.x - (fix?.side?.x || 0),
      z: newShape.pos.z - (fix?.side?.z || 0),
      y: newShape.pos.y
    }
  }

  if (shape.pos.x !== newShape.pos.x) {
    newShape.pos = {
      ...newShape.pos,
      x: newShape.pos.x + shape.pos.x - newShape.pos.x,
    }
  }

  return newShape;
}
