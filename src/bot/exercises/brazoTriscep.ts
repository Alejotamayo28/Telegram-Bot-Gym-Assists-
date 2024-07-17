import { Context, Markup } from "telegraf";
import { buttonGuideMenuExercisesPrincipal } from "../inlineButtons.ts/buttons";


export class Triscep {
  constructor(private ctx: Context) { }
  public async pressFrances() {
    return await this.ctx.reply(`Press Frances

1. Posición Inicial:
   - Acuéstate en un banco plano con los pies firmes en el suelo.
   - Sujeta una barra EZ con las palmas mirando hacia arriba y los brazos extendidos sobre el pecho.

2. Movimiento:
   - Flexiona los codos y baja la barra hacia la frente de forma controlada.
   - Mantén los codos fijos y evita mover los hombros.
   - Extiende los brazos para regresar a la posición inicial.

3. Consejos:
   - Mantén los codos cerca de la cabeza.
   - No arquees la espalda.
   - Controla tanto la bajada como la subida de la barra.

4. Respiración:
   - Inhala mientras bajas la barra.
   - Exhala al extender los brazos.

5. Errores Comunes:
   - Mover los codos hacia afuera.
   - Usar demasiado peso, comprometiendo la forma.
   - No controlar la bajada de la barra.

¡Buena suerte y entrena seguro!
`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)]
      ])

    )
  }
  public async fondos() {
    return await this.ctx.reply(`Fondos

1. Posición Inicial:
   - Sujeta las barras paralelas con los brazos extendidos y el cuerpo recto.
   - Cruza los pies detrás de ti.

2. Movimiento:
   - Flexiona los codos y baja el cuerpo hasta que los brazos estén en un ángulo de 90 grados.
   - Empuja hacia arriba para regresar a la posición inicial.

3. Consejos:
   - Mantén el cuerpo recto y el core firme.
   - No dejes que los codos se abran demasiado.
   - Controla tanto la bajada como la subida.

4. Respiración:
   - Inhala mientras bajas el cuerpo.
   - Exhala al empujar hacia arriba.

5. Errores Comunes:
   - Balancear el cuerpo.
   - Usar demasiado peso adicional, comprometiendo la forma.
   - No bajar lo suficiente.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal
    )
  }
  public async pushdowns() {
    return await this.ctx.reply(`Pushdownds

1. Posición Inicial:
   - Colócate frente a una polea alta con una barra recta o cuerda.
   - Sujeta la barra con un agarre pronado (palmas hacia abajo).

2. Movimiento:
   - Empuja la barra hacia abajo hasta que los brazos estén completamente extendidos.
   - Mantén los codos pegados al torso y evita mover los hombros.
   - Regresa a la posición inicial de forma controlada.

3. Consejos:
   - Mantén los codos cerca del cuerpo.
   - No uses el impulso para empujar la barra.
   - Controla tanto la bajada como la subida.

4. Respiración:
   - Inhala mientras subes la barra.
   - Exhala al empujar hacia abajo.

5. Errores Comunes:
   - Mover los codos hacia afuera.
   - Usar demasiado peso, comprometiendo la forma.
   - No controlar la subida de la barra.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal
    )
  }
  public async trasNuca() {
    return await this.ctx.reply(`Pushdowns Tras Nuca

1. Posición Inicial:
   - Colócate frente a una polea alta con una cuerda.
   - Sujeta la cuerda con ambas manos y da un paso hacia adelante, inclinando ligeramente el torso hacia adelante.

2. Movimiento:
   - Empuja la cuerda hacia abajo y hacia afuera, extendiendo los brazos por completo.
   - Mantén los codos fijos y evita mover los hombros.
   - Regresa a la posición inicial de forma controlada.

3. Consejos:
   - Mantén los codos cerca de la cabeza.
   - No uses el impulso para empujar la cuerda.
   - Controla tanto la bajada como la subida.

4. Respiración:
   - Inhala mientras subes la cuerda.
   - Exhala al empujar hacia abajo.

5. Errores Comunes:
   - Mover los codos hacia afuera.
   - Usar demasiado peso, comprometiendo la forma.
   - No controlar la subida de la cuerda.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal
    )
  }
}
