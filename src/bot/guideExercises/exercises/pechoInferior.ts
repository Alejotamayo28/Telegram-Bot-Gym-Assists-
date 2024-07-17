import { Context, Markup } from "telegraf";
import { buttonGuideMenuExercisesPrincipal } from "../inlineButtons.ts/buttons";

export class Inferior {
  constructor(private ctx: Context) { }
  public declinadoMancuernas() {
    return this.ctx.reply(`Press Declinado con Mancuernas

1. Posición Inicial:
   - Acuéstate en el banco declinado (15-30 grados) con los pies firmes en el soporte del banco.
   - Sujeta las mancuernas con un agarre ligeramente más ancho que el ancho de los hombros.

2. Movimiento:
   - Baja las mancuernas lentamente hacia la parte inferior del pecho.
   - Mantén los codos en un ángulo de 45 grados.
   - Empuja las mancuernas hacia arriba hasta que tus brazos estén completamente extendidos.

3. Consejos:
   - Mantén la espalda ligeramente arqueada y los hombros pegados al banco.
   - No bloquees los codos en la parte superior del movimiento.
   - Controla el movimiento tanto al subir como al bajar las mancuernas.

4. Respiración:
   - Inhala mientras bajas las mancuernas.
   - Exhala al empujar las mancunernas hacia arriba.

5. Errores Comunes:
   - Elevar los pies del soporte.
   - Rebotar las mancuernas en el pecho.
   - Usar demasiado peso, comprometiendo la forma.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal
    )
  }
  public declinadoSmith() {
    return this.ctx.reply(`Declinado smith`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)]
      ])
    )
  }
  public declinadoBarra() {
    return this.ctx.reply(`Press Declinado con Barra

1. Posición Inicial:
   - Acuéstate en el banco declinado (15-30 grados) con los pies firmes en el soporte del banco.
   - Sujeta la barra con un agarre ligeramente más ancho que el ancho de los hombros.

2. Movimiento:
   - Baja la barra lentamente hacia la parte inferior del pecho.
   - Mantén los codos en un ángulo de 45 grados.
   - Empuja la barra hacia arriba hasta que tus brazos estén completamente extendidos.

3. Consejos:
   - Mantén la espalda ligeramente arqueada y los hombros pegados al banco.
   - No bloquees los codos en la parte superior del movimiento.
   - Controla el movimiento tanto al subir como al bajar la barra.

4. Respiración:
   - Inhala mientras bajas la barra.
   - Exhala al empujar la barra hacia arriba.

5. Errores Comunes:
   - Elevar los pies del soporte.
   - Rebotar la barra en el pecho.
   - Usar demasiado peso, comprometiendo la forma.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal
    )
  }
  public declinadoMaquina() {
    return this.ctx.reply(`Declinado maquina`

      , buttonGuideMenuExercisesPrincipal
    )
  }
  public declinadoPushUps() {
    return this.ctx.reply(`Push ups declinadas`,
      buttonGuideMenuExercisesPrincipal
    )
  }
}
