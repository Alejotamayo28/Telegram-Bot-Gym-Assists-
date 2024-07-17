import { Context } from "telegraf";
import { buttonGuideMenuExercisesPrincipal } from "../inlineButtons.ts/buttons";

export class Femorales {
  constructor(private ctx: Context) { }
  public async curlSentado() {
    return await this.ctx.reply(`Curl Sentado

1. Posición Inicial:
   - Siéntate en la máquina de curl femoral con las piernas extendidas y colocadas debajo de los rodillos acolchados.
   - Ajusta la almohadilla para muslos para que quede justo por encima de las rodillas.

2. Movimiento:
   - Flexiona las piernas para levantar los rodillos hacia los glúteos.
   - Mantén la contracción en los femorales durante un segundo.
   - Baja los rodillos de manera controlada hasta la posición inicial.

3. Consejos:
   - No uses impulso para levantar los rodillos.
   - Mantén el torso estable durante todo el movimiento.
   - Realiza el movimiento lentamente y con control.

4. Respiración:
   - Inhala al bajar los rodillos.
   - Exhala al flexionar las piernas.

5. Errores Comunes:
   - Levantar la espalda del respaldo.
   - No flexionar completamente las piernas.
   - Usar demasiado peso y perder la forma correcta.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal
    )
  }
  public async curlAcostado() {
    return await this.ctx.reply(`Curl Acostado

1. Posición Inicial:
   - Acuéstate boca abajo en una máquina de curl femoral con los tobillos debajo de los rodillos acolchados.
   - Ajusta la almohadilla para muslos para que quede justo por encima de las rodillas.

2. Movimiento:
   - Flexiona las piernas para levantar los rodillos hacia los glúteos.
   - Mantén la contracción en los femorales durante un segundo.
   - Baja los rodillos de manera controlada hasta la posición inicial.

3. Consejos:
   - No uses impulso para levantar los rodillos.
   - Mantén el torso estable durante todo el movimiento.
   - Realiza el movimiento lentamente y con control.

4. Respiración:
   - Inhala al bajar los rodillos.
   - Exhala al flexionar las piernas.

5. Errores Comunes:
   - Levantar la cadera del banco.
   - No flexionar completamente las piernas.
   - Usar demasiado peso y perder la forma correcta.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal
    )
  }
  public async pesoMuertoRumano() {
    return await this.ctx.reply(`Peso Muerto Rumano

1. Posición Inicial:
   - Sujeta una barra con un agarre prono (palmas hacia abajo) a la anchura de los hombros.
   - Mantén los pies a la anchura de los hombros y la espalda recta.

2. Movimiento:
   - Inclina las caderas hacia atrás y baja la barra por delante de las piernas.
   - Mantén la espalda recta y las rodillas ligeramente flexionadas.
   - Baja la barra hasta que sientas un estiramiento en los isquiotibiales.
   - Regresa a la posición inicial extendiendo las caderas.

3. Consejos:
   - No permitas que la espalda se arquee.
   - Mantén la barra cerca del cuerpo durante todo el movimiento.
   - Realiza el movimiento lentamente y con control.

4. Respiración:
   - Inhala al bajar la barra.
   - Exhala al subir.

5. Errores Comunes:
   - Arqueo de la espalda.
   - Doblar demasiado las rodillas.
   - Alejar la barra del cuerpo.

¡Buena suerte y entrena seguro!
`, buttonGuideMenuExercisesPrincipal
    )
  }
}
