export interface IApartmentUser {
    _id: String;
    description: String;
    location: String;
    propertySize: number;
    price: number;
    transactionType: String;
    publicationDate: Date;
    phoneNumber: String;
    author: String;
    email: String;
    isAuthor: Boolean;
    isDeleted?: Boolean;
};