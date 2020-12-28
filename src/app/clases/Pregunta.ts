export class Pregunta {
    Titulo: string;
    Pregunta: string;
    Tematica: string;
    Imagen: string;
    RespuestaCorrecta: string;
    RespuestaIncorrecta1: string;
    RespuestaIncorrecta2: string;
    RespuestaIncorrecta3: string;
    FeedbackCorrecto: string;
    FeedbackIncorrecto: string;
    id: number;
    profesorId: number;

    // tslint:disable-next-line:one-line
    // tslint:disable-next-line:max-line-length
    constructor(titulo?: string, pregunta?: string, tematica?: string, respuestaCorrecta?: string, respuestaIncorrecta1?: string, respuestaIncorrecta2?: string, respuestaIncorrecta3?: string, feedbackCorrecto?: string, feedbackIncorrecto?: string){
        this.Titulo = titulo;
        this.Pregunta = pregunta;
        this.Tematica = tematica;
        this.RespuestaCorrecta = respuestaCorrecta;
        this.RespuestaIncorrecta1 = respuestaIncorrecta1;
        this.RespuestaIncorrecta2 = respuestaIncorrecta2;
        this.RespuestaIncorrecta3 = respuestaIncorrecta3;
        this.FeedbackCorrecto = feedbackCorrecto;
        this.FeedbackIncorrecto = feedbackIncorrecto;
    }
}