import { Box, Spacer, Button, theme } from "3oilerplate";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ChevronsDown, RotateCw, Move } from "react-feather";

interface ControlsProps {
  onRotate: (axis: 'x' | 'z', direction: 'cw' | 'ccw') => void;
  onReposition: (axis: 'x' | 'z', direction: 1 | -1) => void;
  rotation: number;
}

export const Controls = ({ onRotate, onReposition, rotation }: ControlsProps) => {
  return (
    <Spacer size="xs" s={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      <Box posr s={{ mb: 0, transform: `rotate(${rotation}deg)` }}>
        <Box df w100p jcc s={{ flexGrow: 1 }}>
          <Button ver onClick={() => onRotate('x', 'ccw')}><ChevronUp /></Button>
        </Box>
        <Box df w100p jcc s={{ flexGrow: 1 }}>
          <Button hor onClick={() => onRotate('z', 'ccw')}><ChevronLeft /></Button>
          <Button hor onClick={() => onRotate('z', 'cw')}><ChevronRight /></Button>
        </Box>
        <Box df w100p jcc s={{ flexGrow: 1 }}>
          <Button ver onClick={() => onRotate('x', 'cw')}><ChevronDown /></Button>
        </Box>
        <Box df posa aic jcc r={0} l={0} b={0} t={0} s={{ svg: { stroke: theme.colors.greys['90'] }, pointerEvents: 'none' }}>
          <RotateCw size={20}/>
        </Box>
      </Box>
      <Box s={{ mb: 0 }}>
        <Button mid onClick={() => onReposition('y', -1)}><ChevronsDown /></Button>
      </Box>
      <Box posr s={{ mb: 0, transform: `rotate(${rotation}deg)` }}>
        <Box df w100p jcc s={{ flexGrow: 1 }}>
          <Button ver onClick={() => onReposition('z', -1)}><ChevronUp /></Button>
        </Box>
        <Box df w100p jcc s={{ flexGrow: 1 }}>
          <Button hor onClick={() => onReposition('x', -1)}><ChevronLeft /></Button>
          <Button hor onClick={() => onReposition('x', 1)}><ChevronRight /></Button>
        </Box>
        <Box df w100p jcc s={{ flexGrow: 1 }}>
          <Button ver onClick={() => onReposition('z', 1)}><ChevronDown /></Button>
        </Box>
        <Box df posa aic jcc r={0} l={0} b={0} t={0} s={{ svg: { stroke: theme.colors.greys['90'] }, pointerEvents: 'none' }}>
          <Move size={20}/>
        </Box>
      </Box>
    </Spacer>
  )
}
