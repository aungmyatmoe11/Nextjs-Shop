import { Schema, model, models, Document } from "mongoose"


const permissionSchema = new Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
})

// const Permission = models?.Permission ?? model("Permission", permissionSchema)
const Permission = mongoose.models.Permission || model('Permission', permissionSchema);

export default Permission
