import { Context, Markup } from "telegraf";
import { buttonGuideMenuExercisesPrincipal } from "../inlineButtons.ts/buttons";

export class Trapecios {
  constructor(private ctx: Context) { }
  public async encogimientoMancuernas() {
    return await this.ctx.reply(`Encogimineto Mancuernas

1. Posición Inicial:
   - Sujeta una mancuerna en cada mano con un agarre neutro (palmas hacia el cuerpo).
   - Mantén los pies a la anchura de los hombros y la espalda recta.

2. Movimiento:
   - Eleva los hombros hacia las orejas lo más alto posible.
   - Mantén la contracción por un segundo.
   - Baja los hombros de manera controlada.

3. Consejos:
   - No uses los brazos para levantar las mancuernas.
   - Mantén la cabeza y el cuello en una posición neutral.
   - Realiza el movimiento lentamente y con control.

4. Respiración:
   - Inhala al bajar los hombros.
   - Exhala al elevar los hombros.

5. Errores Comunes:
   - Usar impulso para levantar las mancuernas.
   - Curvar la espalda.
   - No elevar los hombros completamente.

¡Buena suerte y entrena seguro
`, buttonGuideMenuExercisesPrincipal
    )
  }
  public async encogiminetoBarra() {
    return await this.ctx.reply(`Encogimineto Barra

1. Posición Inicial:
   - Sujeta una barra con un agarre prono (palmas hacia abajo) a la anchura de los hombros.
   - Mantén los pies a la anchura de los hombros y la espalda recta.

2. Movimiento:
   - Eleva los hombros hacia las orejas lo más alto posible.
   - Mantén la contracción por un segundo.
   - Baja los hombros de manera controlada.

3. Consejos:
   - No uses los brazos para levantar la barra.
   - Mantén la cabeza y el cuello en una posición neutral.
   - Realiza el movimiento lentamente y con control.

4. Respiración:
   - Inhala al bajar los hombros.
   - Exhala al elevar los hombros.

5. Errores Comunes:
   - Usar impulso para levantar la barra.
   - Curvar la espalda.
   - No elevar los hombros completamente.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal
    )
  }
  public async remoMenton() {
    return await this.ctx.reply(`Remo Menton

1. Posición Inicial:
   - Sujeta una barra con un agarre prono (palmas hacia abajo) a la anchura de los hombros.
   - Mantén los pies a la anchura de los hombros y la espalda recta.

2. Movimiento:
   - Eleva la barra hacia el mentón, llevando los codos hacia arriba y hacia afuera.
   - Mantén la barra cerca del cuerpo durante el movimiento.
   - Baja la barra de manera controlada hasta la posición inicial.

3. Consejos:
   - No uses los brazos para levantar la barra.
   - Mantén la cabeza y el cuello en una posición neutral.
   - Realiza el movimiento lentamente y con control.

4. Respiración:
   - Inhala al bajar la barra.
   - Exhala al elevar la barra.

5. Errores Comunes:
   - Usar impulso para levantar la barra.
   - Curvar la espalda.
   - No elevar los codos completamente.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal
    )
  }
}
