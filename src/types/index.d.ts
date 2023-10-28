export interface IPos {
  x: number;
  y: number;
  z: number;
}

export interface IBlock {
  x: number;
  y: number;
  z: number;
  color: string;
}

export interface IShape {
  pos: {
    x: number;
    y: number;
    z: number;
  };
  size: {
    x: number;
    y: number;
    z: number;
  };
  blocks: IBlock[];
  color: string;
}
