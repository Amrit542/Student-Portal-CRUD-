import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
    _id: String,
    counterValue: Number
}, {
    collection: "Counter_for_ID"
})

counterSchema.statics.getNextStudentID = async function (name) {

    try {
        const new_id_doc = await this.findByIdAndUpdate(
            name,
            { $inc: { counterValue: 1 } },
            { new: true }
        );

      
        return new_id_doc.counterValue;
    } catch (error) {
        console.error('Error updating counter:', error);
        throw error;
    }

     
}

const Counter_Model = mongoose.model("CounterID", counterSchema)

export default Counter_Model





// async function main () {

    
    
//     const counter_doc = new CounterID({
//         _id: "studentID",
//         counterValue: 0
//     })

//     const e = await counter_doc.save()
//     console.log('saved counter');
//     console.log(e);
    
    
//     const r = await getNextStudentID("studentID")
//     console.log('aftert the function');
    
//     console.log(r);
    



// }

