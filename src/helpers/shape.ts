import { IBlock, IShape } from "@/types";

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
  const hitsBottom = (nextShape.pos.y + nextShape.size.y) <= -dimensions.height;

  return {
    hitsBlock,
    hitsBottom,
    hitsSide: hitsSideX || hitsSideZ,
  }
}
