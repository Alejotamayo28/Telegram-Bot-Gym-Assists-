import { Context, Markup } from "telegraf";
import { buttonGuideMenuExercisesPrincipal } from "../inlineButtons.ts/buttons";

export class Superior {
  constructor(private ctx: Context) { }
  public async inclinadoMancuernas() {
    return await this.ctx.reply(`Press Inclinado en Banca con Mancuernas

1. Posición Inicial:
   - Acuéstate en el banco inclinado (30-45 grados) con los pies firmes en el suelo.
   - Sujeta las mancuernas con un agarre ligeramente más ancho que el ancho de los hombros.

2. Movimiento:
   - Baja las mancuernas lentamente hacia la parte superior de tu pecho.
   - Mantén los codos en un ángulo de 45 grados.
   - Empuja las mancuernas hacia arriba hasta que tus brazos estén completamente extendidos.

3. Consejos:
   - Mantén la espalda ligeramente arquedad y los hombros pegados al banco.
   - No bloquees los codos en la parte superior del movimiento.
   - Controla el movimiento tanto al subir como al bajar las mancuernas.

4. Respiración:
   - Inhala mientras bajas las mancuernas.
   - Exhala al empujar las mancuernas hacia arriba.

5. Errores Comunes:
   - Elevar los pies del suelo.
   - Rebotar la mancuernas en el pecho.
   - Usar demasiado peso, comprometiendo la forma.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal
    )
  }
  public async inclinadoSmith() {
    return await this.ctx.reply(`Inclinado smith`,
      buttonGuideMenuExercisesPrincipal
    )
  }
  public async inclinadoBarra() {
    return await this.ctx.reply(`Press Inclinado con Barra

1. Posición Inicial:
   - Acuéstate en el banco inclinado (30-45) grados con los pies firmes en el suelo.
   - Sujeta la barra con un agarre ligeramente más ancho que el ancho de los hombros.

2. Movimiento:
   - Baja la barra lentamente hacia la parte superior de tu pecho.
   - Mantén los codos en un ángulo de 45 grados.
   - Empuja la barra hacia arriba hasta que tus brazos estén completamente extendidos.

3. Consejos:
   - Mantén la espalda recta y los hombros pegados al banco.
   - No bloquees los codos en la parte superior del movimiento.
   - Controla el movimiento tanto al subir como al bajar la barra.

4. Respiración:
   - Inhala mientras bajas la barra.
   - Exhala al empujar la barra hacia arriba.

5. Errores Comunes:
   - Elevar los pies del suelo.
   - Rebotar la barra en el pecho.
   - Usar demasiado peso, comprometiendo la forma.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal
    )
  }
  public async inclinadoMaquina() {
    return await this.ctx.reply(`Inclinado maquina`,
buttonGuideMenuExercisesPrincipal
    )
  }
}
