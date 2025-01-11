import { ClientInfo } from "../../../model/client";

export class ClientDataMapped {
  static ClientInfo(clientData: ClientInfo): string {
    const { nickname, password, email, name, lastname, age, weight, height } = clientData;
    let result = `
🏋️ *Tu información personal* 

   🔒 _Credenciales_:
   👤 Nickname: ${nickname}
   🔑 Contraseña (encriptada): ${password}
   📧 Correo: ${email}

📋 _Datos personales_:
   👤 Nombre: ${name} ${lastname}
   🎂 Edad: ${age} años
   ⚖️ Peso: ${weight} kg
   📏 Altura: ${height}.`;
    return result
  }
}
