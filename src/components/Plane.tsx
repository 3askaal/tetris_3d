import { useRef, useState } from "react"
import { Edges } from "@react-three/drei"
import { IBlock } from "@/types"

export const Plane = ({ x, y, z, color, ...props }: IBlock) => {
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)

  return (
    <mesh
      {...props}
      position={[x, y, z]}
      scale={0.9}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
      rotation-x={Math.PI * -0.5}
    >
      <planeGeometry args={[1, 1, 1]} />
      <Edges color="#222" />
      <meshStandardMaterial transparent={true} opacity={0.8} color={color} />
    </mesh>
  )
}
