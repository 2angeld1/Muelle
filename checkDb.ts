import connectDB from "./src/lib/db";
import Usuario from "./src/models/Usuario";
import bcrypt from "bcryptjs";

async function check() {
  await connectDB();
  const user = await Usuario.findOne({ email: "admin@nexoexport.com" });
  if (!user) {
    console.log("No user found");
  } else {
    console.log("User found:", user);
    const match = await bcrypt.compare("admin123", user.password);
    console.log("Password match:", match);
  }
  process.exit(0);
}
check();
