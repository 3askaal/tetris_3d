import { IShape } from "@/types";
import { Block } from ".";
import { ThreeEvent } from "@react-three/fiber";

export const Shape = ({ blocks, pos, size, color }: IShape) => {
  const Blocks = () => blocks.map((block, i) => {
    const x = pos.x + block.x;
    const z = pos.z + block.z;
    const y = pos.y + block.y;

    return (
      <Block key={`block-${i}`} x={x} y={y} z={z} color={color} />
    )
  })

  const onPointerMove = (event: ThreeEvent<PointerEvent>) => {
    // console.log('distance: ', event.distance);
  }

  return (
    <>
      <mesh onPointerMove={onPointerMove}>
        <Blocks />
      </mesh>
      {/* <Block {...pos} size={[size.x, size.x, size.x]} color={'white'} /> */}
    </>
  )
}
