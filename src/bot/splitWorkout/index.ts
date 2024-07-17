import { Context, Markup } from "telegraf";
import { menuPrincipalSplits, splitWorkoutButtons, splitsButton } from "./inlineButtons";

export class SplitWorkout {
  constructor(protected ctx: Context) { }
  public async menu() {
    return await this.ctx.reply(`Menu de Split Semanales.

Es este menu encontraras diferentes funciones en base a los Split Semanales, sientete libre de interactuar con todas las funciones!`, splitWorkoutButtons)
  }
  public async definicion() {
    return await this.ctx.reply(`
Un split es una forma de organizar tus entrenamientos semanales, dividiendo los ejercicios por grupos musculares en diferentes días. Esto te permite enfocarte en músculos específicos y darles tiempo adecuado para recuperarse antes del próximo entrenamiento.`, splitWorkoutButtons
    )
  }
  public async recomendaciones() {
    return await this.ctx.reply(`Split Semanales mas recomendados y usados por los usuarios del gimnasio`,
      splitsButton
    )
  }
}

export class SplitWorkoutRecomendaciones extends SplitWorkout {
  public async pushPullLegs() {
    return await this.ctx.reply(`Push Pull Legs

📅 Día 1: Push (Empuje)
- Pecho: Press banca, Aperturas mancuernas
- Hombros: Press militar, Elevaciones laterales
- Tríceps: Fondos, Extensiones tríceps

📅 Día 2: Pull (Tirón)
- Espalda: Dominadas, Remo barra
- Bíceps: Curl barra, Curl martillo

📅 Día 3: Legs (Piernas)
- Cuádriceps: Sentadillas, Prensa piernas
- Isquios: Peso muerto rumano, Curl pierna
- Glúteos: Puente glúteos
- Pantorrillas: Elevación talones

📅 Día 4: Descanso (opcional)

🔄 Repetir ciclo
`, menuPrincipalSplits
    )
  }
  public async fullBody() {
    return await this.ctx.reply(`Full Body

📅 Día 1: Full Body
- Pecho: Press banca
- Espalda: Remo barra
- Piernas: Sentadillas
- Hombros: Press militar
- Bíceps: Curl alternado
- Tríceps: Fondos

📅 Día 2: Descanso

📅 Día 3: Full Body
- Pecho: Press inclinado
- Espalda: Dominadas
- Piernas: Prensa piernas
- Hombros: Elevaciones laterales
- Bíceps: Curl perdicador
- Tríceps: Extensiones tríceps

📅 Día 4: Descanso

📅 Día 5: Full Body
- Pecho: Aperturas (Peck deck)
- Espalda: Remo mancuernas
- Piernas: Sentadilla
- Hombros: Elevaciones laterales
- Bíceps: Curl martillo
- Tríceps: Pushdowns tras nuca

📅 Día 6 y 7: Descanso
`, menuPrincipalSplits
    )
  }
  public async upperLower() {
    return await this.ctx.reply(`Upper Lower

📅 Día 1: Upper Body
- Pecho: Press banca
- Espalda: Dominadas
- Hombros: Press militar
- Bíceps: Curl alternado
- Tríceps: Fondos

📅 Día 2: Lower Body
- Cuádriceps: Sentadilla
- Isquios: Peso muerto rumano
- Glúteos: Puente glúteos
- Pantorrillas: Elevación talones

📅 Día 3: Descanso

📅 Día 4: Upper Body
- Pecho: Press inclinado
- Espalda: Remo barra
- Hombros: Elevaciones laterales
- Bíceps: Curl martillo
- Tríceps: Extensiones tríceps

📅 Día 5: Lower Body
- Cuádriceps: Prensa piernas
- Isquios: Curl pierna
- Glúteos: Estocadas
- Pantorrillas: Elevación talones

📅 Día 6 y 7: Descanso
`, menuPrincipalSplits
    )
  }
  public async arnoldsSplit() {
    return await this.ctx.reply(`Arnold's Split

📅 Día 1: Pecho y Espalda
- Pecho: Press banca, Press inclinado
- Espalda: Dominadas, Remo barra

📅 Día 2: Hombros y Brazos
- Hombros: Press militar, Elevaciones laterales
- Bíceps: Curl incliando, Curl martillo
- Tríceps: Fondos, Pushdowns

📅 Día 3: Piernas y Espalda Baja
- Cuádriceps: Sentadillas, Prensa piernas
- Isquios: Peso muerto rumano, Curl pierna
- Glúteos: Puente glúteos
- Pantorrillas: Elevación talones

📅 Día 4: Descanso

🔄 Repetir ciclo
`, menuPrincipalSplits
    )
  }
  public async broSplit() {
    return await this.ctx.reply(`Bro Split

📅 Día 1: Pecho
- Press banca, Press inclinado

📅 Día 2: Espalda
- Dominadas, Remo barra, Remo mancuerna

📅 Día 3: Hombros
- Press militar, Elevaciones laterales, Peck deck invertido

📅 Día 4: Brazos
- Bíceps: Curl predicador, curl alternado, Curl martillo
- Tríceps: Fondos, pushdowns 

📅 Día 5: Piernas
- Cuádriceps: Sentadillas, Prensa piernas
- Isquios: Peso muerto rumano, Curl pierna
- Glúteos: Puente glúteos
- Pantorrillas: Elevación talones

📅 Días 6 y 7: Descanso
`, menuPrincipalSplits
    )
  }
}

