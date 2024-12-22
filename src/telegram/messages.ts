export const botMessages = {
  menus: {
    mainMenu: `*¡Hola! Bienvenido al menú de usuario!* 👋 \n\n_En este menú encontrarás varias funciones que pueden ajustarse a tus necesidades. 🔍 Siéntete libre de explorar y utilizar todas las opciones disponibles._ 📋\n\nActualmente, estamos en la versión beta, y planeo agregar muchas más funciones en el futuro. ¡Gracias por probarlo! 🙏`,
  },
  inputRequest: {
    auth: {
      nickname:
        `*👋 Nombre del usuario:*\n\n_Por favor, escribe tu nombre de usuario.\nEjemplo: alejotamayo28_`,
      password:
        `*👋 Contraseña del usuario:*\n\n_Por favor, escribe tu contraseña de usuario.\nEjemplo: contraseña123_`,
      errors: {
        invalidNickname:
          `🚫*Nombre de usuario no encontrado*🚫\n\n_Por favor, vuelve a escribir tu nombre de usuario._`,
        invalidPassword:
          `🚫*Contraseña incorrecta*🚫\n\n_Por favor, escoge otra vez tu contraseña de usuario._`
      },
      example: ` 🌟 *¡Bienvenido!* 🌟\n\n_Cuando hagas clic en el botón "Iniciar sesión", te encontraremos con dos preguntas importantes sobre tu cuenta._ 🗨️✨\n\n👉 Asegúrate de leer cada pregunta con atención para que tu experiencia sea lo más fluida posible. ¡Estamos aquí para ayudarte!`
    },
    register: {
      nickname:
        `🔒*Registrando cuenta*🔒\n*¡Nombre de usuario!*\n\n_Por favor, ingresa tu nombre de usuario.\nEjemplo: alejotamayo28_`,
      password:
        `🔒*Registrando cuenta*🔒\n*¡Contrasena de usuario!*\n\n_Por favor, ingresa tu contrasena de usuario.\nEjemplo: contrasena123_`,
      email:
        `🔒*Registrando cuenta*🔒\n*¡Correo de usuario!*\n\n_Por favor, ingresa tu email de usuario.\nEjemplo: usuario@correo.com_`,
      errors: {
        invalidNickname:
          `🚫*Registrando cuenta*🚫\n*¡Usuario no disponible!*\n\n_Por favor, escoge otro nombre de usuario.\nEjemplo: alejotamayo28_`
      },
      example:
        `✨ *¡Crea tu cuenta hoy mismo!* ✨\n\n_Al hacer clic en el botón "Crear cuenta", se te presentarán algunas preguntas sobre tu información personal._📝\n\n*Recuerda:*\n_Lee cada pregunta con atención y responde de manera responsable. 📚\nTus datos estarán seguros: se almacenarán en una base de datos protegida. 🔒
\nSolo tu "nickname" será visibles para otros usuarios.\nTu contraseña estará encriptada, asegurando así tu privacidad._ 🛡️`
    },
    validation: {
      invalidMonth:
        `❌ *El mes ingresado inválido ❌*\n\n_Por favor, asegurate de escribir el mes correctamente\nEjemplo: Enero_`,
      invalidDay:
        `❌ *El día ingresado inválido ❌*\n\n_Por favor, asegúrate de escribir el dia correctamente\nEjemplo: Lunes_`,
      invalidExerciseName:
        `❌ *Nombre del ejercicio invalido ❌*\n\n_¡Por favor, escribe bien el nombre del ejercicio que deseas registrar!\nEjemplo: Press militar_`,
      invalidExerciseReps:
        `❌ *Repeticiones invalidas ❌*\n\n_¡Por favor, ingresa la cantidad de repeticiones que realizaste en cada serie!\nEjemplo: 10 10 10_`,
      invalidExerciseWeight:
        `❌ *Peso invalido ❌*\n\n_¡Por favor, ingresa el peso en kilogramos (kg) con el cual realizase el ejercicio!\nEjemplo: 20_`,
      invalidExericseWeek:
        `❌ *Semana invalida ❌*\n\n_Por favor, escribe el numero de la semana donde realizaste el ejercicio a eliminar!.\nEjemplo: _3_`,
    },
    prompts: {
      getMethod: {
        exerciseMonth:
          `*📋 Mes del entrenamiento*\n\n_Ingresa el nombre del mes en el cual realizaste el ejercicio_.\nEjemplo: _Noviembre:_`,
        exerciseDay:
          `*🗓️ Dia del entrenamiento*\n\n_Por favor, escribe el dia donde realizaste el ejercicio a obtener_.\nEjemplo: _Lunes_`,
        outPut: {
          Monthly(month: string, date: Date, formattedOutput: string): string {
            return `*${month}  -  Fecha: ${date.toLocaleDateString()}*\n\n${formattedOutput}\n`
          },
          Daily(month: string, formattedDay: string, date: Date, formattedOutput: string): string {
            return `* ${month.toUpperCase()} - ${formattedDay} - Fecha: ${date.toLocaleDateString()} *\n\n${formattedOutput}\n`
          },
          Alltime(date: Date, formattedExercises: string): string {
            return `* Registro ejercicios - Fecha: ${date.toLocaleDateString()} * \n\n${formattedExercises}`
          }
        },
        errors: {
          exerciseNotFound:
            `*¡Ejercicio no encontrado! * 🤕\n\n_¿Sigue explorando, qué te gustaría hacer ahora ?_`,
          exerciseEmptyData:
            `*Ejercicios no encontrados! * 🤕\n\n_No hemos encontrado ejercicios registrados\n\n_¿Sigue explorando, qué te gustaría hacer ahora ?_`
        },
        succesfull: `🌟 _Obtencion de datos se ha realizado con exito._`
      },
      postMethod: {
        exerciseDay:
          `*🗓️ Día del entrenamiento *\n_Por favor, escribe el día de la semana en el cual realizaste el ejercicio._\n_Ejemplo: Lunes_\n\nSi prefieres, puedes seleccionar el día de la semana sugerido a continuación.`,
        exerciseName:
          `*🏋️ Nombre del ejercicio *\n_¡Por favor, escribe el nombre del ejercicio que deseas registrar!_\n_Ejemplo: Press militar_\n\nSi prefieres, puedes seleccionar uno de los nombres sugeridos a continuación.`,
        exerciseReps:
          `*📋 Cantidad de repeticiones *\n_¡Por favor, ingresa la cantidad de repeticiones que realizaste en cada serie!_\n_Ejemplo: 10 10 10_`,
        exerciseWeight:
          `*🏋️ Peso utilizado *\n_¡Por favor, ingresa el peso en kilogramos con el cual realizaste el ejercicio!_\n_Ejemplo: 20_`,
        outPut: {
          exerciseSuggestions(exercises: string[]): string {
            let result = ""
            exercises.forEach((exercise) => {
              let firstUpperLetter = ""
              firstUpperLetter = exercise.charAt(0).toUpperCase() + exercise.slice(1)
              result += `- _${firstUpperLetter}_\n`
            })
            return `Quisiste decir algunos de estos ejercicios: \n\n ${result}`
          }
        },
        successful: `*Ejercicio agregado* 🗓️ \n\n_El ejercicio ha sido agregado exitosamente._`,
        notSuccessful: `*Accion cancelada* ❌ \n\n_La accion ha sido cancelada exitosamente._`
      },
      updateMethod: {
        exerciseName:
          `*🗓️ Nombre del entrenamiento *\n\n_Por favor, escribe el nombre del ejercicio a actualizar_.\nEjemplo: _Press militar_`,
        exerciseDay:
          `*🗓️ Dia del entrenamiento *\n\n_Por favor, escribe el dia donde realizaste el ejercicio a actualizar_.\nEjemplo: _Lunes_\nSi prefieres, puedes seleccionar el dia de la semana sugerido a continuacion.`,
        exerciseReps:
          `*📋 Cantidad de repeticiones *\n\n_¡Por favor, ingresa la cantidad de repeticiones que realizaste en cada serie_.\nEjemplo: 10 10 10_`,
        exerciseWeight:
          `*📋 Peso realizado *\n\n_¡Por favor, ingresa el nuevo peso realizado en la serie!_\nEjemplo: _80_`,
      },
      deleteMethod: {
        exerciseMonth:
          `🗓️* Mes del entrenamiento *🗓️\n\n_Por favor, escribe el mes donde realizaste el ejercicio a eliminar._\n\nEjemplo: _Diciembre_`,
        exerciseName:
          `🗓️* Nombre del entrenamiento *🗓️\n\n_Por favor, escribe el dia donde realizaste el ejercicio a eliminar._\n\nEjemplo: _Press militar_`,
        exerciseDay:
          `🗓️* Dia del entrenamiento *🗓️\n\n_Por favor, escribe el dia donde realizaste el ejercicio a eliminar._\n\nEjemplo: _Lunes_\nSi prefieres, puedes seleccionar el dia de la semana sugerido a continuacion.`,
        exerciseWeek:
          `🗓️* Semana del entrenamiento *🗓️\n\n_Por favor, escribe el numero de la semana donde realizaste el ejercicio a eliminar._\nEjemplo: _3_`
      }

    }
  }
}

