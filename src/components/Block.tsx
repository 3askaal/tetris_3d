import { useRef, useState } from "react"
import { Edges } from "@react-three/drei"
import { IBlock } from "@/types";

export const Block = ({ x, y, z, color, size, ...props }: IBlock & { size?: [number, number, number] }) => {
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)

  return (
    <mesh
      {...props}
      position={[x, y, z]}
      scale={0.95}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={size || [1, 1, 1]}  />
      <Edges color="#222" />
      <meshStandardMaterial transparent={true} opacity={0.8} color={color} />
    </mesh>
  )
}
