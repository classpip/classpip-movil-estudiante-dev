export class Pregunta {
    Titulo: string;
    Tipo: string; // "Cuatro opciones", "Verdadero o falso", "Respuesta abierta" o "Emparejamiento"
    Pregunta: string;
    Tematica: string;
    Imagen: string;
    FeedbackCorrecto: string;
    FeedbackIncorrecto: string;
    id: number;
    profesorId: number;

    RespuestaCorrecta: string; // "Cuatro opciones", "Respuesta abierta" y "Verdadero o falso"
    RespuestaIncorrecta1: string; // "Cuatro opciones"
    RespuestaIncorrecta2: string; // "Cuatro opciones"
    RespuestaIncorrecta3: string; // "Cuatro opciones"

    Emparejamientos: any[]; // ""Emparejamiento"


    // tslint:disable-next-line:one-line
    // tslint:disable-next-line:max-line-length
    constructor(titulo?: string, tipo?: string, pregunta?: string, tematica?: string,  imagen?: string, feedbackCorrecto?: string, feedbackIncorrecto?: string) {
      // Estos son los campos que tienen todos los tipos de pregunta
      // El resto de atributos hay que ponerselos aparte, cuando se sepa de qué tipo es,
        this.Titulo = titulo;
        this.Tipo = tipo,
        this.Pregunta = pregunta;
        this.Tematica = tematica;
        this.Imagen = imagen;
        this.FeedbackCorrecto = feedbackCorrecto;
        this.FeedbackIncorrecto = feedbackIncorrecto;

    }
}
