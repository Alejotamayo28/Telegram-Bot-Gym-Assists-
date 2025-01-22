import { UserProfile } from "../userState";

export class ClientDataFormatter {
  static formatClientInfo(clientData: UserProfile): string {
    const { nickname, password, email, name, lastname, age, weight, height } =
      clientData;
    const displayName =
      name && lastname ? `${name} ${lastname}` : "Información no disponible";
    const displayAge = age ? `${age} años` : "Edad no especificada";
    const displayWeight = weight ? `${weight} kg` : "Peso no especificado";
    const displayHeight = height ? `${height}` : "Altura no especificada";
    return `
🏋️ *Tu información personal* 

   🔒 _Credenciales_:
   👤 Nickname: ${nickname || "No disponible"}
   🔑 Contraseña (encriptada): ${password || "No disponible"}
   📧 Correo: ${email || "No disponible"}

📋 _Datos personales_:
   👤 Nombre: ${displayName}
   🎂 Edad: ${displayAge}
   ⚖️ Peso: ${displayWeight}
   📏 Altura: ${displayHeight}.`;
  }
}
