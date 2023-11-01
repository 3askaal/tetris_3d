import { findIndex, isEqual, max, maxBy, minBy, pull, sample } from "lodash";
import randomColor from "randomcolor";
import { PLAYGROUND_HEIGHT, PLAYGROUND_SIZE, SHAPES } from "@/constants";
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

export const checkPos = (nextShape: IShape, currentBlocks: IBlock[], dimensions: any) => {
  const hitsBlock = currentBlocks.some((block: IBlock) =>
    nextShape.blocks.some((nextBlock) =>
      (nextShape.pos.x + nextBlock.x) === block.x &&
      (nextShape.pos.y + nextBlock.y) === block.y &&
      (nextShape.pos.z + nextBlock.z) === block.z
    )
  );

  const hitsSideX = (nextShape.pos.x < 0) || (nextShape.pos.x + nextShape.size.x > dimensions.width);
  const hitsSideZ = (nextShape.pos.z < 0) || (nextShape.pos.z + nextShape.size.z > dimensions.width);
  const hitsBottom = nextShape.pos.y === 0;

  return {
    hitsBlock,
    hitsBottom,
    hitsSide: hitsSideX || hitsSideZ,
  }
}

export const repositionShape = (shape: IShape, blocks: IBlock[], axis: 'x' | 'z' | 'y', direction: -1 | 1) => {
  let newShape = {
    ...shape,
    pos: {
      ...shape.pos,
      [axis]: shape.pos[axis] + direction
    }
  };

  let newBlocks = [...blocks];

  const { hitsBlock, hitsSide, hitsBottom } = checkPos(newShape, blocks, { width: PLAYGROUND_SIZE, height: PLAYGROUND_HEIGHT });

  if (hitsSide) {
    return null;
  }

  if (hitsBlock || hitsBottom) {
    newBlocks = [
      ...blocks,
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
    shape: newShape,
    blocks: newBlocks,
  }
}

export const rotateShape = (shape: IShape, axis: 'z' | 'x', direction: 'cw' | 'ccw') => {
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

    return block;
  })

  const negativeSpace = {
    x: (minBy(newShape.blocks, 'x')?.x || 0),
    y: (minBy(newShape.blocks, 'y')?.y || 0),
    z: (minBy(newShape.blocks, 'z')?.z || 0),
  }

  newShape.blocks = newShape.blocks.map((block) => ({
    ...block,
    x: negativeSpace.x < 0 ? block.x + Math.abs(negativeSpace.x) : block.x - Math.abs(negativeSpace.x),
    y: negativeSpace.y < 0 ? block.y + Math.abs(negativeSpace.y) : block.y - Math.abs(negativeSpace.y),
    z: negativeSpace.z < 0 ? block.z + Math.abs(negativeSpace.z) : block.z - Math.abs(negativeSpace.z),
  }))

  newShape.size = {
    x: (maxBy(newShape.blocks, 'x')?.x || 0) + 1,
    y: (maxBy(newShape.blocks, 'y')?.y || 0) + 1,
    z: (maxBy(newShape.blocks, 'z')?.z || 0) + 1,
  }

  return newShape;
}
