import { Context } from "telegraf";

export function withTimeout<T>(promise: Promise<T>): Promise<T> {
  const TIME_OUT = 5000;
  const timeOutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), TIME_OUT),
  );
  return Promise.race([promise, timeOutPromise]);
}

export const handleError = async (
  error: unknown,
  stage: string,
  ctx: Context,
) => {
  const GENERIC_ERROR_MESSAGE =
    "Se ha registrado un pequeño problema.\n\nEscribe el comando '/start' para continuar.";
  if (ctx && typeof ctx.reply == "function") {
    try {
      await ctx.reply(GENERIC_ERROR_MESSAGE);
    } catch (replyError) {
      console.error("Error enviando mensaje de error al usuario:", replyError);
    }
  } else {
    console.error("El contexto no es valido para enviar respuesta");
  }
  if (error instanceof Error) {
    console.error(`[ERROR - ${stage}]`, {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
  } else {
    console.error(`[UNKNOWN ERROR - ${stage}`, error);
  }
};
