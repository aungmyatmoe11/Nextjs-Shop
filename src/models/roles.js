import { Schema, model,models, Document, Types } from 'mongoose';


const roleSchema = new Schema({
  name: { type: String, required: true, unique: true },
  permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
});

// const Role = models?.Role ?? model("Role", roleSchema);
const Role = mongoose.models.Role || model('Role', roleSchema);
export default Role;
