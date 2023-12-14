import { findIndex, groupBy, includes, isEqual, max, maxBy, minBy, pull, sample, sum } from "lodash";
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

    // TODO: Calculate score, make this function return it

    const fullRows = Object.entries(groupBy(newBottomBlocks, 'y'))
      .filter(([index, row]) => row.length === PLAYGROUND_SIZE * PLAYGROUND_SIZE)
      .map(([index]) => Number(index));

    if (fullRows.length) {
      newBottomBlocks = newBottomBlocks
        .filter(({ y }) => !includes(fullRows, y))
        .map((block) => ({
          ...block,
          y: block.y - sum(
            fullRows.map((rowY) => block.y > rowY ? 1 : 0)
          )
        }))
    }

    newShape = getInitialShape()
  }

  return {
    newShape,
    newBottomBlocks,
  }
}

type TAxis = 'x' | 'y' | 'z';

export const rotateShape = (shape: IShape, blocks: IBlock[], axis: TAxis, direction: 'cw' | 'ccw') => {
  let newShape = { ...shape };

  const blockDirAxises = pull(['x', 'y', 'z'], axis) as [TAxis, TAxis];
  const maxSize = (max(blockDirAxises.map((key) => shape.size[key])) as number) - 1;

  const orders: { cw: [TAxis, number][], ccw: [TAxis, number][] } = {
    cw: [[blockDirAxises[0], 0], [blockDirAxises[1], maxSize], [blockDirAxises[0], maxSize], [blockDirAxises[1], 0]],
    ccw: [[blockDirAxises[1], 0], [blockDirAxises[0], maxSize], [blockDirAxises[1], maxSize], [blockDirAxises[0], 0]],
  };

  const axisChecks = blockDirAxises.map((blockDirAxis) => [[blockDirAxis, 0], [blockDirAxis, maxSize]]).flat() as [TAxis, number][];

  newShape.blocks = newShape.blocks.map((block) => {
    const axisCheckMatches = axisChecks.filter((axisCheck) => block[axisCheck[0]] === axisCheck[1]);

    if (!axisCheckMatches.length) {
      return block;
    }

    if (axis === 'x' && direction === 'ccw' || axis === 'z' && direction === 'ccw' || axis === 'y' && direction === 'ccw') {
      axisCheckMatches.reverse();
    }

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

  // TODO: trying to add negative space to pos to simulate more realistic rotation
  // newShape.pos = {
  //   ...newShape.pos,
  //   x: negativeSpace.x > 0 ? newShape.pos.x + newShape.size.x - 1 : newShape.pos.x,
  //   z: negativeSpace.z > 0 ? newShape.pos.z + newShape.size.z - 1 : newShape.pos.z,
  // }

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
      z: newShape.pos.z + shape.pos.z - newShape.pos.z,
      y: newShape.pos.y + shape.pos.y - newShape.pos.y,
    }
  }

  return newShape;
}
