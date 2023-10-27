import { BLOCK_SIZE } from "@/constants";
import { Block } from ".";

export const Shape = ({ blocks, pos }: { blocks: Pos[], pos: Pos }) => {
  return blocks.map((block, i) => {
    const x = (pos.x * BLOCK_SIZE) + (block.x * BLOCK_SIZE);
    const z = (pos.z * BLOCK_SIZE) + (block.z * BLOCK_SIZE);
    const y = (pos.y * BLOCK_SIZE) + (block.y * BLOCK_SIZE);

    return (
      <Block key={`block-${i}`} position={[x, y, z]} color={'#8E8FFA'} />
    )
  })
}
