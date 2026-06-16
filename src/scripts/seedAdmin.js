require("dotenv").config({ path: ".env" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("No MONGODB_URI provided");
  process.exit(1);
}

const UsuarioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Usuario = mongoose.models.Usuario || mongoose.model("Usuario", UsuarioSchema);

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Conectado a MongoDB");

    const adminEmail = "admin@nexoexport.com";
    
    const existingAdmin = await Usuario.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("El superadmin ya existe");
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    await Usuario.create({
      nombre: "SuperAdmin",
      email: adminEmail,
      password: hashedPassword,
      rol: "ADMIN",
    });

    console.log("Superadmin creado exitosamente: admin@nexoexport.com / admin123");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
}

seedAdmin();
