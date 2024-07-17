import { Context, Markup } from "telegraf";
import { buttonGuideMenuExercisesPrincipal } from "../inlineButtons.ts/buttons";

export class Cuadriceps {
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
`, buttonGuideMenuExercisesPrincipal
    )
  }
  public async extensiones() {
    return await this.ctx.reply(`Extensiones Cuadriceps

1. Posición Inicial:
   - Siéntate en la máquina de extensiones de cuadríceps con la espalda apoyada en el respaldo.
   - Coloca los tobillos debajo de los rodillos acolchados.

2. Movimiento:
   - Extiende las piernas hacia arriba hasta que estén rectas.
   - Mantén la contracción por un segundo.
   - Baja las piernas de manera controlada hasta la posición inicial.

3. Consejos:
   - No uses impulso para levantar las piernas.
   - Mantén la espalda apoyada en el respaldo.
   - Realiza el movimiento lentamente y con control.

4. Respiración:
   - Inhala al bajar las piernas.
   - Exhala al extender las piernas.

5. Errores Comunes:
   - Usar impulso para levantar las piernas.
   - Curvar la espalda.
   - No extender completamente las piernas.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal
    )
  }
  public async prensa() {
    return await this.ctx.reply(`Prensa

1. Posición Inicial:
   - Siéntate en la máquina de prensa con la espalda apoyada en el respaldo.
   - Coloca los pies en la plataforma a la anchura de los hombros.

2. Movimiento:
   - Empuja la plataforma con los pies hasta que las piernas estén casi rectas.
   - Baja la plataforma de manera controlada hasta que las rodillas formen un ángulo de 90 grados.

3. Consejos:
   - No bloquees las rodillas al extender las piernas.
   - Mantén la espalda apoyada en el respaldo.
   - Realiza el movimiento lentamente y con control.

4. Respiración:
   - Inhala al bajar la plataforma.
   - Exhala al empujar la plataforma.

5. Errores Comunes:
   - Bloquear las rodillas al extender las piernas.
   - Curvar la espalda.
   - No bajar la plataforma lo suficiente.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal
    )
  }
  public async variantes() {
    return await this.ctx.reply(`Variantes
    

`, buttonGuideMenuExercisesPrincipal
    )
  }
}
