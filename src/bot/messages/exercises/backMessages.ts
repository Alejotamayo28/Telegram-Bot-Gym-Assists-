import { Markup } from "telegraf"

export const menuApiBack_trapecios = async (ctx: any) => {
  return ctx.reply(`
Aqui tienes un ejercicio para el trapecio que puedes realizar:

1. Encogimiento de hombros:
   - Descripcion: Este ejercicio trabaja el musculo trapecio.
   - Instrucciones: De pie, sujeta una mancuerna en cada mano con los brazos extendidos a los lados y las palmas hacia adentro. Encoge los hombros hacia arriba lo mas alto posible. Luego baja lentamente a la posicion inicial.

Si necesitas mas informacion o una demostracion en video, puedes hacer clic en los botones a continuacion: `,
    Markup.inlineKeyboard([
      [Markup.button.url('Encogimientos de Hombros - Video', 'https://www.youtube.com/watch?v=J2ZVVWqaJ9E')],
      [Markup.button.callback(`Menu ejercicios`, `menu_api`), Markup.button.callback(`Menu principal`, `menu_principal`)]
    ]))
}

export const menuApiBack_EspaldaAlta = async (ctx: any) => {
  return ctx.reply(`Aquí tienes algunos ejercicios para la espalda alta (densidad) que puedes realizar:

1. Remo con Barra:
   - Descripción: Este ejercicio trabaja los músculos de la parte superior de la espalda, incluyendo el trapecio y los romboides.
   - Instrucciones: De pie, con las rodillas ligeramente flexionadas, sujeta una barra con un agarre prono (palmas hacia abajo). Inclina el torso hacia adelante y mantén la espalda recta. Levanta la barra hacia tu abdomen contrayendo los músculos de la espalda y luego bájala lentamente a la posición inicial.

2. Jalón al Pecho con Agarre Amplio:
   - Descripción: Este ejercicio se enfoca en la parte superior de la espalda y los músculos dorsales.
   - Instrucciones: Sentado en una máquina de jalón, sujeta la barra con un agarre amplio (más ancho que los hombros). Tira de la barra hacia tu pecho mientras aprietas los omóplatos juntos, luego vuelve lentamente a la posición inicial.

Si necesitas más información o una demostración en video, puedes hacer clic en los botones a continuación:`,
    Markup.inlineKeyboard([
      [Markup.button.url('Remo con Barra - Video', 'https://www.youtube.com/watch?v=DJxY70uPThI')],
      [Markup.button.url('Jalón al Pecho con Agarre Amplio - Video', 'https://www.youtube.com/watch?v=CAwf7n6Luuc')],
      [Markup.button.callback(`Menu ejercicios`, `menu_api`), Markup.button.callback(`Menu principal`, `menu_principal`)]
    ]))
}

export const menuApiBack_dorsales = async (ctx: any) => {
  return ctx.reply(
    `Aquí tienes algunos ejercicios para los dorsales que puedes realizar:

1. Dominadas:
   - Descripción: Este ejercicio es excelente para desarrollar la fuerza y tamaño de los dorsales.
   - Instrucciones: Sujeta una barra de dominadas con un agarre prono (palmas hacia afuera) y las manos separadas al ancho de los hombros. Levanta tu cuerpo hasta que tu barbilla esté por encima de la barra contrayendo los músculos dorsales, luego baja lentamente hasta la posición inicial.

2. Remo en Polea Baja:
   - Descripción: Este ejercicio se enfoca en los músculos dorsales y otros músculos de la espalda.
   - Instrucciones: Siéntate en la máquina de remo con los pies apoyados en la plataforma y las rodillas ligeramente flexionadas. Sujeta la barra o el mango con ambas manos. Tira del mango hacia tu abdomen mientras aprietas los omóplatos juntos y luego vuelve lentamente a la posición inicial.

Si necesitas más información o una demostración en video, puedes hacer clic en los botones a continuación:`,
    Markup.inlineKeyboard([
      [Markup.button.url('Dominadas - Video', 'https://www.youtube.com/watch?v=eGo4IYlbE5g')],
      [Markup.button.url('Remo en Polea Baja - Video', 'https://www.youtube.com/watch?v=GZbfZ033f74')],
      [Markup.button.callback(`Menu ejercicios`, `menu_api`), Markup.button.callback(`Menu principal`, `menu_principal`)]
    ])
  )
}

