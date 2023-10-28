import { IShape } from "@/types";
import { Block } from ".";

export const Shape = ({ blocks, pos, color }: IShape) => {
  return blocks.map((block, i) => {
    const x = pos.x + block.x;
    const z = pos.z + block.z;
    const y = pos.y + block.y;

    return (
      <Block key={`block-${i}`} position={[x, y, z]} color={block.color || color} />
    )
  })
}
