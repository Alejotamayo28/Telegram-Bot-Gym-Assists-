import { Context, Markup } from "telegraf";
import { buttonGuideMenuExercisesPrincipal } from "../inlineButtons.ts/buttons";

export class EspaldaAlta {
   constructor(private ctx: Context) { }
   public jalonPecho() {
      return this.ctx.reply(`Jalon al Pecho

1. Posición Inicial:
   - Siéntate en una máquina de polea alta con una barra ancha.
   - Agarra la barra con las palmas mirando hacia adelante y las manos un poco más abiertas que la anchura de los hombros.

2. Movimiento:
   - Tira de la barra hacia abajo hasta que toque la parte superior del pecho.
   - Mantén el torso recto y ligeramente inclinado hacia atrás.
   - Regresa la barra a la posición inicial de forma controlada.

3. Consejos:
   - Mantén el core firme y el pecho hacia afuera.
   - No uses el impulso para bajar la barra.
   - Controla tanto la bajada como la subida.

4. Respiración:
   - Inhala mientras subes la barra.
   - Exhala al tirar hacia abajo.

5. Errores Comunes:
   - Balancear el cuerpo.
   - No llevar la barra hasta el pecho.
   - Usar el impulso para bajar la barra.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal
      )
   }
   public dominadas() {
      return this.ctx.reply(`Dominadas

1. Posición Inicial:
   - Agarra una barra con las palmas mirando hacia adelante y las manos un poco más abiertas que la anchura de los hombros.
   - Cuelga con los brazos extendidos y los pies fuera del suelo.

2. Movimiento:
   - Tira de tu cuerpo hacia arriba hasta que la barbilla pase la barra.
   - Baja de forma controlada hasta que los brazos estén completamente extendidos.

3. Consejos:
   - Mantén el core firme y evita balancearte.
   - No uses el impulso para subir.
   - Controla tanto la subida como la bajada.

4. Respiración:
   - Inhala mientras bajas.
   - Exhala al tirar hacia arriba.

5. Errores Comunes:
   - Balancear el cuerpo.
   - No extender completamente los brazos al bajar.
   - Usar el impulso para subir.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal
      )
   }
}
