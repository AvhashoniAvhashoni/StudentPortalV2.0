export class User {
    public id?: string;
    public cellNumber?: string;
    public email: string;
    public firstName: string;
    public lastName: string;
    public idNumber?: string;
    public proofOfPayUrl?: Payment;
    public idUrl?: string;
    public cvUrl?: string;
    public resultsUrl?: string;
    public profilePicUrl?: string;
    public dob?: Date;
    public disability?: string;
    public addressLn1?: string;
    public address?: string[];
    public guardian?: Guardian;
    public payMethod?: string;
}

export class Guardian {
    public firstName?: string;
    public lastName?: string;
    public cellNr?: string;
    public altNr?: string;
}

export class Payment {
    public enroll?: string;
    public registration?: Array<string>;
    public classFee?: string[];
}