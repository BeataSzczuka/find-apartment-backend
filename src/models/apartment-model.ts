export interface IApartment {
    _id: String;
    description: String;
    location: String;
    propertySize: number;
    price: number;
    transactionType: String;
    isAuthor: Boolean;
    isDeleted?: Boolean;
    images: any[];
}