import mongoose from 'mongoose';
import validator from 'validator';

const student_prop = {
    _id: Number,
    firstName: {
        type: String,
        required: true,
        trim: true,
        

        
    },
    lastName:{
        type: String,
        required: true,
        trim: true,
      
        
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        validate(val) { 
            if (!validator.isEmail(val)) {
                throw new Error("Email is invalid!")
            }

        }
        
    },
    dob:{
        type: Date,
        required: true,
        
    },
    gender:{
        type: String,
        required: true,
        validate(val){
            var isValid = val === 'male' || val === 'female';
            if (!isValid){
                throw new Error("Gender type is Invalid")
            }
        }
        
    },
    enrolled: {
        type: Boolean,
        required: true,
        
    },
    year: {
        type: Number,
        min: 1,
        max: 12
    },
    favSport: String,
    message: {
        type: String,
        trim: true,

    }


}

const student_schmea = new mongoose.Schema(student_prop, {
    collection: 'Student_table_coll'
})




const Student = new mongoose.model('Student', student_schmea)



export {Student}

// export interface Student {
//     firstName: string;
//     lastName: string;
//     email: string;
//     dob: Date | undefined;
//     gender: Sex;
//     enrolled: boolean | undefined;
//     year?: number;
//     favSport: string | undefined;
//     message?: string;
   

// }