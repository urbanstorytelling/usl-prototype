export interface IGeometry {
    type: string;
    coordinates: number[];
}
export interface IGeoJson {
    type: string;
    geometry: IGeometry;
    properties?: any;
}

export class GeoJson implements IGeoJson {
    type = 'Feature';
    geometry: IGeometry;

    constructor(type: string, coordinates: number[], public properties?: any) {
        this.geometry = {
            type: type,
            coordinates: coordinates
        };
    }
}

export class FeatureCollection {
    type = 'FeatureCollection';
    constructor(public features: Array<GeoJson>) { }

}


// export interface ILayer {
//     id: string;
//     source: string;
//     type: string;
//     layout: {
//         'text-field': object;
//         'text-size': number;
//         'text-transform': string;
//         'icon-image': string;
//         'text-offset': number[];
//     };
//     paint: {
//         'text-color': string;
//         'text-halo-color': string;
//         'text-halo-width': number;
//     };
// }


// export class Layer implements ILayer {
//     constructor(
//         public id,
//         public source,
//         public type,
//         public layout,
//         public paint
//     ) { }
// }
