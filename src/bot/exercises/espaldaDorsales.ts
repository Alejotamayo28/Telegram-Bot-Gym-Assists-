import { Context} from "telegraf";
import { buttonGuideMenuExercisesPrincipal } from "../inlineButtons.ts/buttons";

export class Dorsales {
  constructor(private ctx: Context) { }
  public async remoMancuernas() {
    return await this.ctx.reply(`Remo Mancuernas

1. Posición Inicial:
   - Coloca una rodilla y una mano en un banco, con la espalda recta y paralela al suelo.
   - Sujeta una mancuerna con la otra mano y deja que cuelgue recta hacia abajo.

2. Movimiento:
   - Tira de la mancuerna hacia el costado, llevando el codo hacia arriba y atrás.
   - Mantén el torso firme y evita girarlo.
   - Baja la mancuerna de forma controlada hasta la posición inicial.

3. Consejos:
   - Mantén el core firme y la espalda recta.
   - No gires el torso.
   - Controla tanto la subida como la bajada de la mancuerna.

4. Respiración:
   - Inhala mientras bajas la mancuerna.
   - Exhala al tirar hacia arriba.

5. Errores Comunes:
   - Girar el torso.
   - Usar demasiado peso, comprometiendo la forma.
   - No controlar la bajada de la mancuerna.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal
    )
  }
  public async remoMaquina() {
    return await this.ctx.reply(`Remo Maquina

1. Posición Inicial:
   - Siéntate en la máquina de remo con los pies firmes en los soportes y las rodillas ligeramente flexionadas.
   - Sujeta las asas con las palmas mirando hacia adentro y los brazos extendidos.

2. Movimiento:
   - Tira de las asas hacia el abdomen, llevando los codos hacia atrás.
   - Mantén el torso firme y evita balancearlo.
   - Regresa las asas a la posición inicial de forma controlada.

3. Consejos:
   - Mantén el core firme y la espalda recta.
   - No balances el torso.
   - Controla tanto la tirada como la devolución de las asas.

4. Respiración:
   - Inhala mientras devuelves las asas.
   - Exhala al tirar hacia el abdomen.

5. Errores Comunes:
   - Balancear el torso.
   - Usar demasiado peso, comprometiendo la forma.
   - No controlar la devolución de las asas.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal
    )
  }
  public async remoBarra() {
    return this.ctx.reply(`Remo Barra

1. Posición Inicial:
   - De pie, con los pies a la altura de los hombros y las rodillas ligeramente flexionadas.
   - Inclina el torso hacia adelante desde las caderas, manteniendo la espalda recta, y sujeta la barra con un agarre pronado (palmas hacia abajo).

2. Movimiento:
   - Tira de la barra hacia el abdomen, llevando los codos hacia arriba y atrás.
   - Mantén el torso firme y evita balancearlo.
   - Baja la barra de forma controlada hasta la posición inicial.

3. Consejos:
   - Mantén el core firme y la espalda recta.
   - No balances el torso.
   - Controla tanto la subida como la bajada de la barra.

4. Respiración:
   - Inhala mientras bajas la barra.
   - Exhala al tirar hacia arriba.

5. Errores Comunes:
   - Balancear el torso.
   - Usar demasiado peso, comprometiendo la forma.
   - No controlar la bajada de la barra.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal
    )
  }
}
