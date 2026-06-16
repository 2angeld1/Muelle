import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import Usuario from "@/models/Usuario";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";
import { sendMail } from "@/lib/mailer";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(request: NextRequest) {
  try {
    // 1. Verificar si es ADMIN
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.rol !== "ADMIN") {
      return NextResponse.json({ error: "Solo los administradores pueden crear cuentas" }, { status: 403 });
    }

    // 2. Procesar registro
    await connectDB();
    const body = await request.json();
    const { nombre, email, rol } = body;

    if (!nombre || !email) {
      return NextResponse.json(
        { error: "El nombre y el correo son requeridos" },
        { status: 400 }
      );
    }

    const existingUser = await Usuario.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "El correo ya está registrado" },
        { status: 400 }
      );
    }

    // Generar contraseña aleatoria de 8 caracteres
    const generatedPassword = crypto.randomBytes(4).toString('hex'); // 8 caracteres hex
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(generatedPassword, salt);

    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
      rol: rol === "ADMIN" ? "ADMIN" : "USER",
    });

    // 3. Enviar correo al usuario con sus credenciales
    const htmlEmail = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Bienvenido a NexoExport, ${nombre}!</h2>
        <p>Un administrador ha creado una cuenta para ti en nuestra plataforma de gestión logística.</p>
        <p>Tus credenciales de acceso son:</p>
        <ul>
          <li><strong>Correo:</strong> ${email}</li>
          <li><strong>Contraseña temporal:</strong> ${generatedPassword}</li>
        </ul>
        <p>Por favor, inicia sesión y no compartas estas credenciales con nadie.</p>
        <p><a href="http://localhost:3000/login">Ir a NexoExport</a></p>
      </div>
    `;

    await sendMail({
      to: email,
      subject: "Tus credenciales de acceso - NexoExport",
      html: htmlEmail,
    });

    return NextResponse.json(
      { success: true, message: "Cuenta creada exitosamente" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registro error:", error);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
