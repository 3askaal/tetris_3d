import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { times } from "lodash";
import { Block, Shape } from "@/components";
import { PLAYGROUND_SIZE } from "@/constants";
import { IBlock, IShape } from "@/types";

export const Playground = ({ shape, bottomBlocks = [], onRotate }: { shape: IShape, bottomBlocks: IBlock[], onRotate: (event: any) => void }) => {
  const { camera } = useThree();

  return (
    <>
      <ambientLight />
      <group scale={0.22}>
        <Shape {...shape} />

        { bottomBlocks?.map((bottomBlock, i) => (
          <Block key={`block-${i}`} {...bottomBlock} />
        )) }

        { times(PLAYGROUND_SIZE * PLAYGROUND_SIZE, (i) => {
          const x = i % PLAYGROUND_SIZE;
          const z = Math.floor(i / PLAYGROUND_SIZE);
          const y = 0;

          return (
            <Block key={`bottom-${i}`} x={x} y={y} z={z} color={'#ffffff'} />
          )
        }) }

        <OrbitControls
          camera={camera}
          minDistance={4.25}
          maxDistance={4.25}
          autoRotate={false}
          enableZoom={false}
          enablePan={false}
          onChange={onRotate}
          target={[0.5, 1.5, 0.5]}
          minPolarAngle={1.5}
          maxPolarAngle={1.5}
        />
      </group>
    </>
  )
}
