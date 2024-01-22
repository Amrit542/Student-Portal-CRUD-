    export interface Student {
        firstName: string;
        lastName: string;
        email: string;
        dob: Date | undefined | string;
        // dob: string | Date;
        gender: Sex;
        enrolled: boolean | undefined;
        year?: number;
        favSport: string | undefined;
        message?: string;
    

    }

    export interface StudentWithId extends Student {
        _id: 'string' | number
    }

type Sex = "male" | "female" | undefined;

// export class Student {
//     constructor(
//         public firstName: string, 
//         public lastName: string,
//         public email: string,
//         public dob: Date,
//         public enrolled: boolean,
//         public favSport: string,
//         public gender?: Sex,
//         public year?: number,
//         public message?: string
//         ){}
// }