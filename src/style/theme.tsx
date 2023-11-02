export const LOCAL_THEME = {
  components: {
    Button: {
      default: {
        px: 'xs',
        py: 'xxs',
        height: '2rem',
        border: '0 !important',
        background: 'transparent !important',

        svg: {
          stroke: 'secondaryDark',
          width: '32px',
          height: '32px'
        }
      },
      variants: {
        ver: {
          width: '4rem',
        },
        hor: {
          width: '4rem',
        },
        mid: {
          width: '3rem',
          height: '3rem'
        }
      }
    }
  }
}
