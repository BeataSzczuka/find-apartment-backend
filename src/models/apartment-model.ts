export interface IApartment {
    _id?: String;
    title: String;
    price: number;
    propertySize: number;
    location: String;
    description: String;
    isDeleted?: Boolean;
}