 import mongoose , { Schema, Document } from "mongoose";

 export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: string;
 }

 const schema: Schema<IUser> = new Schema(
   {
    username:{
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: null,
    },
   },
   {
    timestamps:true,
   }
 )

 const User = mongoose.model<IUser>("User", schema);

 export default User
 

 
 

 