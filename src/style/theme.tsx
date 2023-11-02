export const LOCAL_THEME = {
  components: {
    Button: {
      default: {
        px: 'xs',
        py: 'xxs',
        border: '0 !important',
        background: 'transparent !important',
        width: '4rem',
        height: '2.5rem',

        svg: {
          stroke: 'secondaryDark',
          width: '32px',
          height: '32px'
        }
      },
      variants: {
        hor: {
          '+ *': {
            ml: '1rem'
          }
        },
        mid: {
          width: '3rem',
          height: '3rem'
        }
      }
    }
  }
}
