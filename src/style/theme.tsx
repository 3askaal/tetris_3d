import { darken, brighten } from '3oilerplate'

const black = brighten('#000', .25);
const white = darken('#fff', .25);

export const LOCAL_THEME = {
  colors: {
    black,
    white,
  }
}
