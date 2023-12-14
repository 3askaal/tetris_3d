import { Spacer, s } from "3oilerplate";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ChevronsDown, RotateCw, Move } from "react-feather";

interface ControlsProps {
  onReposition: (axis: 'x' | 'y' | 'z', direction: 1 | -1) => void;
  rotation: number;
  rotatedControls: any;
}

const SControlPad = s.div(({ rotation }: { rotation: number }) => ({
  position: 'relative',
  width: '8rem',
  height: '8rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transform: `rotate(${rotation}deg)`,
}));

const SControlPadButton = s.button(({ direction }: { direction: string }) => ({
  position: 'absolute',
  px: 'xs',
  py: 'xxs',
  margin: 'auto',
  width: '3rem',
  height: '3rem',
  borderRadius: '.5rem',
  border: '0 !important',
  background: 'transparent !important',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  svg: {
    stroke: 'secondaryDark',
  },

  ...(direction === 'up' && {
    top: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  }),

  ...(direction === 'down' && {
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  }),

  ...(direction === 'left' && {
    top: 0,
    left: 0,
    bottom: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  }),

  ...(direction === 'right' && {
    top: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  })
}));

const SControlPadIcon = s.div(() => ({
  pointerEvents: 'none',

  svg: {
    stroke: 'greys.90'
  }
}));

const ControlPad = ({ children, onUp, onDown, onLeft, onRight, rotation }: any) => {
  return (
    <SControlPad rotation={rotation}>
      <SControlPadButton direction="up" onClick={onUp}>
        <ChevronUp size="2rem" />
      </SControlPadButton>
      <SControlPadButton direction="left" onClick={onLeft}>
        <ChevronLeft size="2rem" />
      </SControlPadButton>
      <SControlPadButton direction="right" onClick={onRight}>
        <ChevronRight size="2rem" />
      </SControlPadButton>
      <SControlPadButton direction="down" onClick={onDown}>
        <ChevronDown size="2rem" />
      </SControlPadButton>
      <SControlPadIcon>
        { children }
      </SControlPadIcon>
    </SControlPad>
  )
}

export const Controls = ({ onReposition, rotation, rotatedControls }: ControlsProps) => {
  return (
    <Spacer size="xl" s={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      <ControlPad
        onUp={() => rotatedControls().up.rot()}
        onLeft={() => rotatedControls().left.rot()}
        onRight={() => rotatedControls().right.rot()}
        onDown={() => rotatedControls().down.rot()}
        rotation={rotation}
      >
        <RotateCw size="1.25rem" />
      </ControlPad>
      <SControlPadButton onClick={() => onReposition('y', -1)}>
        <ChevronsDown size="2rem" />
      </SControlPadButton>
      <ControlPad
        onUp={() => onReposition('z', -1)}
        onLeft={() => onReposition('x', -1)}
        onRight={() => onReposition('x', 1)}
        onDown={() => onReposition('z', 1)}
        rotation={rotation}
      >
        <Move size="1.25rem" />
      </ControlPad>
    </Spacer>
  )
}
