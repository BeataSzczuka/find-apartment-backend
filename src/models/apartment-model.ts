export interface IApartment {
    _id: String;
    description: String;
    location: String;
    propertySize: number;
    price: number;
    transactionType: String;
    isDeleted?: Boolean;
    images: any[];
}