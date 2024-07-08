import { Markup } from "telegraf"

export const menuApiLeg_cuadriceps = async (ctx: any) => {
  return ctx.reply(`
Aquí tienes algunos ejercicios para los cuádriceps que puedes realizar:

1. Sentadillas:
   - Descripción: Este ejercicio es uno de los mejores para desarrollar la fuerza y tamaño de los cuádriceps.
   - Instrucciones: De pie, con los pies separados al ancho de los hombros, baja el cuerpo flexionando las rodillas y caderas como si fueras a sentarte. Mantén la espalda recta y baja hasta que tus muslos estén paralelos al suelo, luego empuja hacia arriba para volver a la posición inicial.

2. Prensa de Piernas:
   - Descripción: Este ejercicio se enfoca en los cuádriceps y permite levantar mucho peso de forma segura.
   - Instrucciones: Siéntate en la máquina de prensa de piernas con los pies apoyados en la plataforma. Empuja la plataforma hacia arriba extendiendo las rodillas y las caderas, luego bájala lentamente hasta que las rodillas estén en un ángulo de 90 grados.

Si necesitas más información o una demostración en video, puedes hacer clic en los botones a continuación:`,
    Markup.inlineKeyboard([
      [Markup.button.url('Sentadillas - Video', 'https://www.youtube.com/watch?v=Dy28eq2PjcM')],
      [Markup.button.url('Prensa de Piernas - Video', 'https://www.youtube.com/watch?v=IZxyjW7MPJQ')],
      [Markup.button.callback(`Menu ejercicios`, `menu_api`), Markup.button.callback(`Menu principal`, `menu_principal`)]
    ])
  )
}

export const menuApiLeg_gluteo = async (ctx: any) => {
  ctx.reply(`
Aquí tienes algunos ejercicios para glúteos que puedes realizar:

1. Hip Thrust:
   - Descripción: Este ejercicio es excelente para activar y desarrollar los glúteos.
   - Instrucciones: Siéntate en el suelo con la parte superior de la espalda apoyada en un banco y una barra sobre tus caderas. Empuja la barra hacia arriba extendiendo las caderas hasta que tu cuerpo forme una línea recta desde los hombros hasta las rodillas, luego baja lentamente a la posición inicial.

2. Sentadillas Búlgaras:
   - Descripción: Este ejercicio se enfoca en los glúteos y mejora el equilibrio.
   - Instrucciones: De pie, coloca un pie en un banco detrás de ti y el otro pie delante. Baja el cuerpo flexionando la rodilla delantera y la cadera hasta que la rodilla trasera casi toque el suelo. Luego, empuja hacia arriba para volver a la posición inicial y repite con la otra pierna.

3. Patadas de Glúteos:
   - Descripción: Este ejercicio aísla los glúteos y es ideal para tonificar.
   - Instrucciones: Apóyate en el suelo con las manos y las rodillas. Mantén la espalda recta y levanta una pierna hacia atrás y hacia arriba hasta que el muslo esté en línea con la espalda. Baja lentamente a la posición inicial y repite con la otra pierna.

Si necesitas más información o una demostración en video, puedes hacer clic en los botones a continuación:`,
    Markup.inlineKeyboard([
      [Markup.button.url('Hip Thrust - Video', 'https://www.youtube.com/watch?v=IR2ZZOLb2so')],
      [Markup.button.url('Sentadillas Búlgaras - Video', 'https://www.youtube.com/watch?v=2C-uNgKwPLE')],
      [Markup.button.url('Patadas de Glúteos - Video', 'https://www.youtube.com/watch?v=U9jS3AIf1Cg')],
      [Markup.button.callback(`Menu ejercicios`, `menu_api`), Markup.button.callback(`Menu principal`, `menu_principal`)]
    ])
  )
}

export const menuApiLeg_isquiotibialeles = async (ctx: any) => {
  ctx.reply(`
Aquí tienes algunos ejercicios para isquiotibiales que puedes realizar:

1. Peso Muerto Rumano:
   - Descripción: Este ejercicio es excelente para trabajar los isquiotibiales y los glúteos.
   - Instrucciones: De pie, sujeta una barra con las manos separadas al ancho de los hombros. Mantén las piernas ligeramente flexionadas y baja la barra hacia el suelo inclinando las caderas hacia atrás y manteniendo la espalda recta. Siente el estiramiento en los isquiotibiales y luego vuelve a la posición inicial empujando las caderas hacia adelante.

2. Curl de Piernas:
   - Descripción: Este ejercicio aísla los isquiotibiales y es ideal para tonificar.
   - Instrucciones: Acuéstate boca abajo en la máquina de curl de piernas con los tobillos debajo de los rodillos acolchados. Flexiona las rodillas para levantar los rodillos hacia los glúteos, manteniendo el torso pegado a la máquina. Baja lentamente a la posición inicial y repite.

Si necesitas más información o una demostración en video, puedes hacer clic en los botones a continuación:`,
    Markup.inlineKeyboard([
      [Markup.button.url('Peso Muerto Rumano - Video', 'https://www.youtube.com/watch?v=PN6k6dtK3uM')],
      [Markup.button.url('Curl de Piernas - Video', 'https://www.youtube.com/watch?v=CU2xY7b-KFs')],
      [Markup.button.url('Curl de Piernas - Video', 'https://www.youtube.com/watch?v=CU2xY7b-KFs')],
      [Markup.button.callback(`Menu ejercicios`, `menu_api`), Markup.button.callback(`Menu principal`, `menu_principal`)]
    ])
  )
}

export const menuApiLeg_femorales = async (ctx: any) => {
  ctx.reply(`
Aquí tienes algunos ejercicios para femorales que puedes realizar:

1. Peso Muerto con Piernas Rígidas:
   - Descripción: Este ejercicio trabaja los músculos femorales y la parte baja de la espalda.
   - Instrucciones: De pie, sujeta una barra con las manos separadas al ancho de los hombros. Mantén las piernas ligeramente flexionadas y baja la barra hacia el suelo manteniendo la espalda recta. Siente el estiramiento en los femorales y luego vuelve a la posición inicial levantando la barra.

2. Curl de Piernas Acostado:
   - Descripción: Este ejercicio aísla los músculos femorales.
   - Instrucciones: Acuéstate boca abajo en la máquina de curl de piernas con los tobillos debajo de los rodillos acolchados. Flexiona las rodillas para levantar los rodillos hacia los glúteos, manteniendo el torso pegado a la máquina. Baja lentamente a la posición inicial y repite.

Si necesitas más información o una demostración en video, puedes hacer clic en los botones a continuación:`,
    Markup.inlineKeyboard([
      [Markup.button.url('Peso Muerto con Piernas Rígidas - Video', 'https://www.youtube.com/watch?v=1uDiW5--rAE')],
      [Markup.button.url('Curl de Piernas Acostado - Video', 'https://www.youtube.com/watch?v=CU2xY7b-KFs')],
      [Markup.button.callback(`Menu ejercicios`, `menu_api`), Markup.button.callback(`Menu principal`, `menu_principal`)]
    ])
  )
}


