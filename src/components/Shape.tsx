import { IShape } from "@/types";
import { Block } from ".";
import { ThreeEvent } from "@react-three/fiber";
import { useEffect } from "react";

export const Shape = ({ blocks, pos, size, color: shapeColor }: IShape) => {
  const onPointerMove = (event: ThreeEvent<PointerEvent>) => {
    // console.log('distance: ', event.distance);
  }

  return (
    <>
      <mesh onPointerMove={onPointerMove} position={[pos.x, pos.y, pos.z]}>
        {/* <Block {...pos} size={[size.x, size.y, size.z]} /> */}
        { blocks.map(({ x, y, z, color: blockColor }, i) => <Block key={`block-${i}`} x={x} y={y} z={z} color={blockColor || shapeColor} />) }
      </mesh>
    </>
  )
}
