export type Dimensions = {
    width: number;
    height: number;
}

export type Coordinates = {
    x: number;
    y: number;
}

export type MouseDown = {
    coordinates: Coordinates,
    dataset: object;
}

export type Shape = {
    id: string;
    points: Coordinates[];
};

export type CurvePoint = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x: number;
    y: number;
}
