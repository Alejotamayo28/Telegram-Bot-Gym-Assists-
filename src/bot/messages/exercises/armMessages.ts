import { Markup } from "telegraf";

export const menuApiBrazo_hombro = async (ctx: any) => {
  return ctx.reply(
    `Aquí tienes algunos ejercicios para hombro que puedes realizar:

1. Press Militar: 
   - Descripción: Este ejercicio trabaja los deltoides y el trapecio.
   - Instrucciones: Siéntate en un banco con respaldo y sujeta una barra con las manos a la altura de los hombros. Empuja la barra hacia arriba hasta que tus brazos estén completamente extendidos. Luego, bájala de nuevo a la posición inicial.

2. Elevaciones Laterales:
   - Descripción: Este ejercicio se enfoca en los deltoides laterales.
   - Instrucciones: De pie, con una mancuerna en cada mano, levanta los brazos hacia los lados hasta que estén a la altura de los hombros, luego baja lentamente.

3. Pájaros (Rear Delt Fly):
   - Descripción: Trabaja los deltoides traseros.
   - Instrucciones: Inclínate hacia adelante con una mancuerna en cada mano y los brazos colgando. Levanta los brazos hacia los lados manteniendo un ligero doblez en los codos, luego baja lentamente.

Si necesitas más información o una demostración en video, puedes hacer clic en los botones a continuación:`,
    Markup.inlineKeyboard([
      [Markup.button.url('Press Militar - Video', 'https://www.youtube.com/watch?v=UyJmEYDa7Kk')],
      [Markup.button.url('Elevaciones Laterales - Video', 'https://www.youtube.com/watch?v=qEwKCR5JCog')],
      [Markup.button.url('Pájaros - Video', 'https://www.youtube.com/watch?v=pMTd4_jRg5k')],
      [Markup.button.callback(`Menu ejercicios`, `menu_api`), Markup.button.callback(`Menu principal`, `menu_principal`)],
    ])
  );
}


export const menuApiBrazo_Biscep = async (ctx: any) => {
  return ctx.reply(
    `Aqui tienes algunos ejercicios para el biscep que puedes realizar:

1. Curl predicador:
   - Descripcion: Este ejercicio trabaja el biscep en su posicion mas corta.
   - Instrucciones: Siéntate en un banco predicador y sujeta una barra con las manos separadas al ancho de los hombros. Levanta la barra hacia tus hombros contrayendo los bíceps y luego bájala lentamente a la posición inicial.

2. Curl Inclinado:
   - Descripción: Este ejercicio se enfoca en la parte larga del bíceps, estirándola más en la posición inicial.
   - Instrucciones: Siéntate en un banco inclinado con una mancuerna en cada mano y las palmas hacia arriba. Levanta las mancuernas hacia tus hombros contrayendo los bíceps y luego bájalas lentamente

3. Curl Martillo:
   - Descripción: Trabaja el braquiorradial y los bíceps desde un ángulo diferente.
   - Instrucciones: De pie, sujeta una mancuerna en cada mano con las palmas hacia el cuerpo. Levanta ambas mancuernas hacia tus hombros manteniendo las palmas enfrentadas y luego bájalas lentamente.

Si necesitas más información o una demostración en video, puedes hacer clic en los botones a continuación:`,
    Markup.inlineKeyboard([
      [Markup.button.url('Curl Predicador - Video', 'https://www.youtube.com/watch?v=-Vyt2QdsR7E')],
      [Markup.button.url('Curl Inclinado - Video', 'https://www.youtube.com/watch?v=soxrZlIl35U')],
      [Markup.button.url('Curl Martillo - Video', 'https://www.youtube.com/watch?v=zC3nLlEvin4')],
      [Markup.button.callback(`Menu ejercicios`, `menu_api`), Markup.button.callback(`Menu principal`, `menu_principal`)],
    ])
  )
}

export const menuApiBrazo_triscep = async (ctx: any) => {
  return ctx.reply(
    `Aqui tienes algunos ejercicios para el triscep que puedes realizaar: 

1. Extensiones sobre nuca:
   - Descripcion: Este ejercicio trabaja el tricep, principalmente su cabeza lateral.
   - Instrucciones: De pie, sujeta la barra con ambas manos detras de la cabeza. Extiende los codos para levantar la barra hacia arriba y luego baja lentamente.

2. Pushdowns:
   - Descripcion: Este ejercicio trabaja el tricep, principalmente su cabeza larga.
   - Instrucciones: De pie, sujeta una cuerda o barra con ambas manos y presiona hacia abajo extendiendo los codos. Luego vuelve levementa a la posicion  inicial.

3. Extensiones unilaterales:
   - Descripcion: Trabaja el tricep de manera unilateral para mejorar el equilibrio muscular.
   - Instrucciones: De pie, sujeta una mancuerna con una mano y extiende el codo para levantar la mancuerna hacia arriba. Baja lentamente y repite con el otro brazo.

Si necesitas informacion o una demostracion en video, puedes hacer clic en los botones a continuacion: `,
    Markup.inlineKeyboard([
      [Markup.button.url('Extensiones Tras Nuca \- Video', 'https://www.youtube.com/watch?v=5JDBQPr1dNs')],
      [Markup.button.url('Pushdowns \- Video', 'https://www.youtube.com/watch?v=J5ziyiTdc8o')],
      [Markup.button.url('Extensiones Unilaterales \- Video', 'https://www.youtube.com/watch?v=sQrVvTt5PbE')],
      [Markup.button.callback(`Menu ejercicios`, `menu_api`), Markup.button.callback(`Menu principal`, `menu_principal`)]
    ])
  )
}
