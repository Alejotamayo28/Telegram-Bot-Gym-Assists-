import { Context, Markup } from "telegraf";
import { buttonGuideMenuExercisesPrincipal } from "../inlineButtons.ts/buttons";

export class Gluteos {
   constructor(private ctx: Context) { }
   public async sentadilla() {
      return await this.ctx.reply(`Sentadilla

1. Posición Inicial:
   - Coloca una barra sobre los trapecios, con los pies a la anchura de los hombros.
   - Mantén la espalda recta y el pecho hacia arriba.

2. Movimiento:
   - Flexiona las rodillas y las caderas para bajar el cuerpo como si te fueras a sentar.
   - Baja hasta que los muslos estén al menos paralelos al suelo.
   - Empuja con los talones para regresar a la posición inicial.

3. Consejos:
   - Mantén las rodillas alineadas con los pies.
   - No permitas que las rodillas se desplacen hacia adentro.
   - Mantén la espalda recta durante todo el movimiento.

4. Respiración:
   - Inhala al bajar.
   - Exhala al subir.

5. Errores Comunes:
   - Curvar la espalda baja.
   - Levantar los talones del suelo.
   - Dejar que las rodillas se desplacen hacia adentro.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal)
   }
   public async puenteGluteo() {
      return await this.ctx.reply(`Puente de Glueteo

1. Posición Inicial:
   - Acuéstate boca arriba con las rodillas dobladas y los pies apoyados en el suelo, separados a la anchura de las caderas.
   - Coloca los brazos a los lados con las palmas hacia abajo.

2. Movimiento:
   - Levanta las caderas hacia arriba mientras contraes los glúteos.
   - Mantén la posición por unos segundos en la parte superior.
   - Baja las caderas de manera controlada hasta volver a la posición inicial.

3. Consejos:
   - Mantén el abdomen contraído durante todo el ejercicio.
   - Evita arquear la espalda en exceso.
   - Controla el movimiento en todo momento.

4. Respiración:
   - Inhala al bajar las caderas.
   - Exhala al levantarlas.

5. Errores Comunes:
   - Levantar las caderas demasiado alto.
   - No contraer los glúteos completamente.
   - Usar demasiado impulso para levantar las caderas.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal)
   }
   public async patada() {
      return await this.ctx.reply(`Patada de Gluteo

1. Posición Inicial:
   - Colócate a cuatro patas en el suelo con las manos directamente debajo de los hombros y las rodillas debajo de las caderas.
   - Mantén la espalda recta y el abdomen contraído.

2. Movimiento:
   - Levanta una pierna hacia atrás, manteniendo la rodilla doblada.
   - Contrae el glúteo en la parte superior del movimiento.
   - Baja la pierna de manera controlada hasta volver a la posición inicial.

3. Consejos:
   - Mantén la pierna en línea con el cuerpo durante todo el movimiento.
   - Controla la velocidad y la amplitud del movimiento.
   - Alterna entre ambas piernas de manera equitativa.

4. Respiración:
   - Inhala al levantar la pierna.
   - Exhala al bajarla.

5. Errores Comunes:
   - Levantar la pierna demasiado alto.
   - No contraer el glúteo en la parte superior.
   - Perder la estabilidad del torso.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal)
   }
   public async estocadas() {
      return await this.ctx.reply(`Estocadas

1. Posición Inicial:
   - Colócate de pie con los pies juntos.
   - Da un paso hacia adelante con una pierna, manteniendo la otra pierna extendida detrás de ti.

2. Movimiento:
   - Flexiona ambas rodillas para bajar el cuerpo hacia el suelo.
   - Mantén la rodilla delantera en línea con el tobillo y asegúrate de que la rodilla trasera casi toque el suelo.
   - Empuja con el talón del pie delantero para volver a la posición inicial.

3. Consejos:
   - Mantén el torso erguido y los abdominales contraídos.
   - Controla el equilibrio y la estabilidad durante el movimiento.
   - Realiza el ejercicio de manera suave y controlada.

4. Respiración:
   - Inhala al bajar el cuerpo.
   - Exhala al subir.

5. Errores Comunes:
   - Doblar demasiado la rodilla delantera.
   - No bajar lo suficiente para activar los glúteos.
   - Realizar el movimiento de manera apresurada.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal
      )
   }
}
