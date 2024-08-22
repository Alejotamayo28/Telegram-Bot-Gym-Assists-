import { Context } from "telegraf";
import { buttonGuideMenuExercisesPrincipal } from "../inlineButtons.ts/buttons";

export class Lumbar {
   constructor(private ctx: Context) { }
   public async pesoMuerto() {
      return await this.ctx.reply(`Peso Muerto
1. Posición Inicial:
   - Coloca los pies a la altura de los hombros.
   - Mantén la barra cerca de las espinillas, con una postura neutra y la espalda recta.
   - Sujeta la barra con un agarre prono o mixto.

2. Movimiento:
   - Levanta la barra extendiendo las caderas y rodillas simultáneamente.
   - Mantén la barra cerca del cuerpo durante todo el movimiento.
   - Endereza el torso al final del movimiento.

3. Consejos:
   - Mantén la espalda recta durante todo el movimiento.
   - No levantes la barra con los brazos.
   - Controla la bajada de la barra.

4. Respiración:
   - Inhala antes de levantar la barra.
   - Exhala al finalizar el levantamiento.

5. Errores Comunes:
   - Curvar la espalda baja.
   - Levantar la barra con los brazos en lugar de las piernas.
   - No mantener la barra cerca del cuerpo.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal
      )
   }
   public async hiperextensiones() {
      return await this.ctx.reply(`Hiperextensiones

1. **Posición Inicial**:
   - Colócate en la máquina de hiperextensiones con las caderas apoyadas en el borde del cojín.
   - Cruza los brazos sobre el pecho o detrás de la cabeza.

2. **Movimiento**:
   - Baja el torso hacia el suelo flexionando la cintura, manteniendo la espalda recta.
   - Levanta el torso extendiendo la espalda hasta que quede en línea con las piernas.

3. **Consejos**:
   - Mantén la espalda recta durante todo el movimiento.
   - No hiperextiendas la espalda al final del movimiento.
   - Realiza el movimiento de forma controlada.

4. **Respiración**:
   - Inhala al bajar el torso.
   - Exhala al levantar el torso.

5. **Errores Comunes**:
   - Curvar la espalda baja.
   - Hacer el movimiento de forma rápida y sin control.
   - Hiperextender la espalda al final del movimiento.

¡Buena suerte y entrena seguro!

`, buttonGuideMenuExercisesPrincipal
      )
   }
   public async buenosDias() {
      return await this.ctx.reply(`Buenos Dias

1. Posición Inicial:
   - Coloca una barra sobre los trapecios, como en una sentadilla trasera.
   - Mantén los pies a la altura de los hombros y las rodillas ligeramente flexionadas.

2. Movimiento:
   - Inclina el torso hacia adelante desde las caderas, manteniendo la espalda recta.
   - Baja el torso hasta sentir un estiramiento en los isquiotibiales.
   - Levanta el torso extendiendo las caderas y manteniendo la espalda recta.

3. Consejos:
   - Mantén la espalda recta durante todo el movimiento.
   - No flexiones demasiado las rodillas.
   - Realiza el movimiento de forma controlada.

4. Respiración:
   - Inhala al bajar el torso.
   - Exhala al levantar el torso.

5. Errores Comunes:
   - Curvar la espalda baja.
   - Flexionar demasiado las rodillas.
   - Realizar el movimiento de forma rápida y sin control.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal
      )
   }
}
