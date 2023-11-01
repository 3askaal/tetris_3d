import { IShape } from "@/types";
import { Block } from ".";

export const Shape = ({ blocks, pos, color, size }: IShape) => {
  const Blocks = () => blocks.map((block, i) => {
    const x = pos.x + block.x;
    const z = pos.z + block.z;
    const y = pos.y + block.y;

    return (
      <Block key={`block-${i}`} position={[x, y, z]} color={block.color || color} />
    )
  })

  const onPointerMove = (event: any) => {
    console.log('distance: ', event.distance);
  }

  return (
    <>
      <mesh onPointerMove={onPointerMove}>
        <Blocks />
      </mesh>
      {/* <Block position={[pos.x, pos.y, pos.z]} size={[size.x, size.x, size.x]} color={'white'} /> */}
    </>
  )
}
