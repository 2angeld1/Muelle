import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Usuario from "@/models/Usuario";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectDB();
    
    const adminEmail = "admin@nexoexport.com";
    const existingAdmin = await Usuario.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      return NextResponse.json({ message: "El superadmin ya existe" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    await Usuario.create({
      nombre: "Super Admin",
      email: adminEmail,
      password: hashedPassword,
      rol: "ADMIN",
    });

    return NextResponse.json({ success: true, message: "Superadmin creado: admin@nexoexport.com / admin123" });
  } catch (error: any) {
    console.error("Error creating admin:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
