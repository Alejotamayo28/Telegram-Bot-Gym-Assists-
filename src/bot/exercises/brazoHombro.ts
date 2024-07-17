import { Context, Markup } from "telegraf";
import { buttonGuideMenuExercisesPrincipal } from "../inlineButtons.ts/buttons";

export class Hombro {
  constructor(private ctx: Context) { }
  public async pressMilitar() {
    return await this.ctx.reply(`Press Militar

1. Posición Inicial:
   - Sentado, con los pies firmes en el suelo.
   - Sujeta una mancuerna en cada mano la altura de los hombros.

2. Movimiento:
   - Manten los codos en un angulo de 45 grados.
   - Empuja las mancuernas hacia arriba hasta que tus brazos estén completamente extendidos.
   - Baja las mancuernas de forma controlada hasta la altura de los hombros.

3. Consejos:
   - Mantén el core firme y la espalda ligeramente arqueada.
   - No arquees mucho la espalda durante el levantamiento.
   - Controla tanto la subida como la bajada de las mancuernas.

4. Respiración:
   - Inhala mientras bajas las mancuernas.
   - Exhala al empujar las mancuernas hacia arriba.

5. Errores Comunes:
   - Arquear mucho la espalda.
   - Usar demasiado peso, comprometiendo la forma.
   - No bajar las mancuernas hasta la altura de los hombros.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal
    )
  }
  public async vuelosLaterales() {
    return await this.ctx.reply(`Vuelos Laterales

1. Posición Inicial:
   - De pie, con los pies a la altura de los hombros.
   - Sujeta una mancuerna en cada mano con las palmas mirando hacia adentro y los brazos colgando a los lados.

2. Movimiento:
   - Levanta las mancuernas hacia los lados hasta que los brazos estén paralelos al suelo.
   - Mantén una ligera flexión en los codos y las palmas mirando hacia abajo.
   - Baja las mancuernas de forma controlada hasta la posición inicial.

3. Consejos:
   - Mantén el core firme y la espalda recta.
   - No balancees el cuerpo; usa solo la fuerza de tus hombros.
   - Controla tanto la subida como la bajada de las mancuernas.

4. Respiración:
   - Inhala mientras bajas las mancuernas.
   - Exhala al levantar las mancuernas.

5. Errores Comunes:
   - Balancear el cuerpo.
   - Usar demasiado peso, comprometiendo la forma.
   - Levantar las mancuernas por encima de los hombros.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal
    )
  }
  public async peckDeckInvertido() {
    return await this.ctx.reply(`Peck Deck Invertido

1. Posición Inicial:
   - Siéntate en la máquina Peck Deck con el pecho apoyado en el respaldo.
   - Sujeta las asas con las palmas mirando hacia abajo y los brazos extendidos frente a ti.

2. Movimiento:
   - Abre los brazos hacia los lados, apretando los omóplatos.
   - Mantén una ligera flexión en los codos durante todo el movimiento.
   - Regresa a la posición inicial de forma controlada.

3. Consejos:
   - Mantén el core firme y la espalda recta.
   - No balancees el cuerpo; usa solo la fuerza de los hombros.
   - Controla tanto la apertura como el cierre de los brazos.

4. Respiración:
   - Inhala mientras cierras los brazos.
   - Exhala al abrir los brazos.

5. Errores Comunes:
   - Balancear el cuerpo.
   - Usar demasiado peso, comprometiendo la forma.
   - No apretar los omóplatos al abrir los brazos.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal
    )
  }

}
