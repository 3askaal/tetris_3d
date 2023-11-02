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
          stroke: 'secondary'
        }
      },
      variants: {
        vertical: {
          width: '6rem',
        },
        horizontal: {
          width: '4rem',
        },
      }
    }
  }
}
