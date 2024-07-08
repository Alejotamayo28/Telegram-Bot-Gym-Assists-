import { Markup } from "telegraf"

export const menuApiChest = async (ctx: any) => {
  return ctx.reply(`
Aquí tienes algunos ejercicios para pecho que puedes realizar\:
    
1.  Press Inclinado con Mancuernas:
     - Descripción\: Este ejercicio trabaja la parte superior del pecho\.
     - Instrucciones: Acuéstate en un banco inclinado con una mancuerna en cada mano. Empuja las mancuernas hacia arriba hasta que tus brazos estén completamente extendidos, luego bájalas lentamente hasta que tus codos estén a 90 grados.
    
2. Press Plano:
    - Descripción: Este ejercicio trabaja la parte media del pecho\.
    - Instrucciones: Acuéstate en un banco plano con una barra. Sujeta la barra con las manos separadas al ancho de los hombros y bájala lentamente hasta que toque tu pecho. Luego, empújala hacia arriba hasta que tus brazos estén completamente extendidos.
    
3. Aperturas:
    - Descripción: Trabaja la parte externa del pecho y estira los pectorales\.
    - Instrucciones: Acuéstate en un banco plano con una mancuerna en cada mano y los brazos extendidos hacia arriba. Baja lentamente los brazos hacia los lados en un arco amplio hasta que sientas un estiramiento en el pecho, luego vuelve a la posición inicial.
    
Si necesitas más información o una demostración en video, puedes hacer clic en los botones a continuación:`,
    Markup.inlineKeyboard([
      [Markup.button.url('Press Inclinado con Mancuernas \- Video', 'https://www.youtube.com/watch?v=8iPEnn-ltC8')],
      [Markup.button.url('Press Plano \- Video', 'https://www.youtube.com/watch?v=E1ZxHyyQ52I')],
      [Markup.button.url('Aperturas \- Video', 'https://www.youtube.com/watch?v=eozdVDA78K0')],
      [Markup.button.callback(`Menu ejercicios`, `menu_api`), Markup.button.callback(`Menu principal`, `menu_principal`)],
    ])
  )
}
