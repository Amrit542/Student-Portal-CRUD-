import Counter_Model from "../models/counter.js";
import express from "express";
const router = express.Router();
import createError from "http-errors";

// const decreaseCounterValue = async () => {

//     const update_counter = await Counter_Model.findByIdAndUpdate('studentID',
//         { $inc : {counterValue: -1} },
//         { new: true }
//         );

//     return update_counter

// };

router.get("/all", async (req, res, next) => {
  const all_doc = await Counter_Model.find({});
  console.log("----------");
  console.log(all_doc);

  if (all_doc) {
    res.status(200).send(all_doc);
  } else {
    next(createError(400));
  }
});

router.put("/update", async (req, res, next) => {
  const updated_val = req.body;

  const doc = await Counter_Model.updateOne(
    { _id: updated_val.id },
    {
      counterValue: updated_val.counterValue,
    }
  );

  if (doc.matchedCount == 0) {
    return next(createError(400, "Couldn't find the document"));
  }

  res.send("success");
});

export default router;
