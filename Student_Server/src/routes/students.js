import express from "express";
const router = express.Router();
import { Student } from "../models/student_schema.js";
import Counter_Model from "../models/counter.js";
import createError from "http-errors";



// Get all studends route
router.get("/all", async (req, res, next) => {
  const all_students = await Student.find({});
  if (all_students.length) {
  
    
    return res.status(200).json(all_students);
  } else {
    return next(createError(404));
  }


});

// get count of all students
router.get('/count', async (req, res, next) => {

    const count = await Student.countDocuments({})
    
    res.status(200).json({
        message: 'Success',
        count: count
    })
    

})  


// Get one student by id
router.get("/:id", async (req, res, next) => {
  const stud_id = req.params?.id;
  
  
  
  
  if(isNaN(stud_id)) {
   
    return next()
    
  }
  
  const doc = await Student.findById(stud_id);
 

  if (!doc) {
    return next();
  }
  res.status(200).send(doc);
});



// save one student
router.post("/create", async (req, res) => {
  const tmp_student = req.body;
  tmp_student.dob = new Date(req.body.dob);

  const new_Student = new Student(tmp_student);

  new_Student._id = await Counter_Model.getNextStudentID("studentID");
  const savedStudent = await new_Student.save().then(res => {
    return res
  
  }).catch(error => {
   
      if (error.name === "ValidationError") {
        let errors = {};
  
        Object.keys(error.errors).forEach((key) => {
          errors[key] = error.errors[key].message;
        });
  
        return res.status(400).send(errors);
      }
      
      res.status(201).send(savedStudent)
      
      
  });


  
  
  res.status(201).send(savedStudent); 
  
  
});


// update student with id
router.patch("/update/:id", async (req, res, next) => {
  const id = req.params.id;

  if(isNaN(id)) {
   
    return next()
    
  }
  const doc = await Student.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  
  
  if (!doc) {
    return next();
  }

  res.status(200).send(doc);
});

router.delete('/deleteMany', async (req, res, next) => {
    try {
        const doc = await Student.deleteMany({
          gender: 'male'
        });
        
        
        
        if (doc.deletedCount === 0) {
            // If no documents were deleted
            return res.status(404).json({ message: 'No matching documents found.' });
        }

        res.status(200).json({ message: 'Documents deleted successfully.' });
    } catch (error) {
        // Handle the error
        res.status(500).json({ message: 'Internal Server Error' });
    }

});

// delete one student with id
router.delete("/:id", async (req, res, next) => {
    const studentID = req.params?.id;



  if(isNaN(studentID)) {
   
    return next()
    
  }
  
    const doc = await Student.findByIdAndDelete(studentID);

    if (!doc) {
        return next(createError(400))
    }

    res.status(200).send(doc);
  });




export default router;
