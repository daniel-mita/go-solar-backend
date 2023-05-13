import { User } from "./User"
import { Image } from "./Image"
import { SolarPanel } from "./SolarPanel"

User.hasMany(Image, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: 'images',
});

Image.belongsTo(User, {
  targetKey: 'id',
  foreignKey: 'userId',
  as: 'user',
});
export { User, Image, SolarPanel }
