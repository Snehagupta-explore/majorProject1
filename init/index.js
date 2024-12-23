const mongoose=require("mongoose")
const initdata=require("./data.js")
const Listing=require("../models/listing.js")

const mongo_Url="mongodb://127.0.0.1:27017/wanderlust"
main()
.then(()=>{
    console.log("connected to db")
})
.catch((err)=>{
    console.log(err)
})

async function main() {
    await mongoose.connect(mongo_Url)
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"675d7e1dbd6673e7f3d0c8d9"}))
    await Listing.insertMany(initdata.data)
    console.log("data initialized")
}
initDB()