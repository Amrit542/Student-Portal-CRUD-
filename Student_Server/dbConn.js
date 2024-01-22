import mongoose from 'mongoose';
import 'dotenv/config';







async function connectDB() {
   await  mongoose.connect(process.env.DATABASE_URI, {
        dbName: 'AllStudents_db'
    }).then(
        () => {
            console.log('Successfully connected');
            
        },
        (err) => {
            console.log(err);
            
        }
    )

}



export {connectDB};