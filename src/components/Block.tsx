import { useRef, useState } from "react"
import { Edges } from "@react-three/drei"
import { BLOCK_SIZE } from "@/constants"

export const Block = ({ color, ...props }: any) => {
  const ref = useRef({ rotation: { x: 0, y: 0 } })
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)

  return (
    <mesh
      {...props}
      ref={ref}
      scale={0.95}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE]}  />
      <Edges color="#222" />
      <meshStandardMaterial transparent={true} opacity={0.8} color={color} />
    </mesh>
  )
}
