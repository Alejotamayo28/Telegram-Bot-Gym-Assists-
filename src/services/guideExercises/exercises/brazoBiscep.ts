import { Context } from "telegraf";
import { buttonGuideMenuExercisesPrincipal } from "../inlineButtons.ts/buttons";


export class Biscep {
  constructor(private ctx: Context) { }
  public async martillo() {
    return this.ctx.reply(`Curl Martillo

1. Posición Inicial:
   - De pie, con los pies a la altura de los hombros.
   - Sujeta una mancuerna en cada mano con las palmas mirando hacia tu cuerpo.

2. Movimiento:
   - Flexiona los codos y lleva las mancuernas hacia los hombros.
   - Mantén las palmas mirando hacia adentro durante todo el movimiento.
   - Baja las mancuernas de forma controlada hasta la posición inicial.

3. Consejos:
   - Mantén los codos cerca del torso.
   - No balancees el cuerpo; usa solo la fuerza de tus brazos.
   - Controla tanto la subida como la bajada de las mancuernas.

4. Respiración:
   - Inhala mientras bajas las mancuernas.
   - Exhala al levantar las mancuernas.

5. Errores Comunes:
   - Balancear el cuerpo.
   - Usar demasiado peso, comprometiendo la forma.
   - Mover los codos hacia adelante.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal
    )
  }
  public async predicador() {
    return await this.ctx.reply(`Curl Predicador

1. Posición Inicial:
   - Siéntate en el banco predicador y coloca la parte superior de tus brazos sobre el soporte.
   - Sujeta una barra con un agarre supino (palmas hacia arriba).

2. Movimiento:
   - Flexiona los codos y lleva la barra hacia tus hombros.
   - Mantén los brazos en contacto con el soporte durante todo el movimiento.
   - Baja la barra de forma controlada hasta la posición inicial.

3. Consejos:
   - Mantén una posición estable y evita levantar los codos del soporte.
   - Controla tanto la subida como la bajada de la barra.
   - Evita extender completamente los codos al bajar la barra para mantener la tensión.

4. Respiración:
   - Inhala mientras bajas la barra.
   - Exhala al levantar la barra.

5. Errores Comunes:
   - Levantar los codos del soporte.
   - Usar demasiado peso, comprometiendo la forma.
   - Extender completamente los codos, perdiendo tensión.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal
    )
  }
  public async alternado() {
    return await this.ctx.reply(`Curl Alternado

1. Posición Inicial:
   - De pie, con los pies a la altura de los hombros.
   - Sujeta una mancuerna en cada mano con las palmas mirando hacia adentro.

2. Movimiento:
   - Flexiona un codo y lleva la mancuerna hacia el hombro correspondiente.
   - Gira la muñeca mientras levantas la mancuerna, de modo que la palma mire hacia el hombro al final del movimiento.
   - Baja la mancuerna de forma controlada y repite con el otro brazo.

3. Consejos:
   - Mantén los codos cerca del torso.
   - No balancees el cuerpo; usa solo la fuerza de tus brazos.
   - Controla tanto la subida como la bajada de las mancuernas.

4. Respiración:
   - Inhala mientras bajas la mancuerna.
   - Exhala al levantar la mancuerna.

5. Errores Comunes:
   - Balancear el cuerpo.
   - Usar demasiado peso, comprometiendo la forma.
   - Mover los codos hacia adelante.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal
    )
  }
  public async inclinado() {
    return await this.ctx.reply(`Curl inclinado

1. Posición Inicial:
   - Siéntate en un banco inclinado (45 grados) con los pies firmes en el suelo.
   - Sujeta una mancuerna en cada mano con las palmas mirando hacia adentro y los brazos colgando rectos hacia abajo.

2. Movimiento:
   - Flexiona los codos y lleva las mancuernas hacia los hombros.
   - Mantén las palmas mirando hacia arriba durante todo el movimiento.
   - Baja las mancuernas de forma controlada hasta la posición inicial.

3. Consejos:
   - Mantén los codos cerca del torso.
   - No balancees el cuerpo; usa solo la fuerza de tus brazos.
   - Controla tanto la subida como la bajada de las mancuernas.

4. Respiración:
   - Inhala mientras bajas las mancuernas.
   - Exhala al levantar las mancuernas.

5. Errores Comunes:
   - Balancear el cuerpo.
   - Usar demasiado peso, comprometiendo la forma.
   - Mover los codos hacia adelante.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal
    )
  }
}
