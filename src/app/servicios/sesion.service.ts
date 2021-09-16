import { Injectable } from '@angular/core';
import { Profesor, Grupo, Juego, Equipo, Alumno, Coleccion, Cromo, Punto, Insignia, TablaAlumnoJuegoDeCompeticion,
         TablaJornadas, Jornada, TablaEquipoJuegoDeCompeticion, JuegoDeAvatar } from '../clases';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { ReplaySubject } from 'rxjs';
import {JuegoDeEvaluacion} from '../clases/JuegoDeEvaluacion';
import {AlumnoJuegoDeEvaluacion} from '../clases/AlumnoJuegoDeEvaluacion';
import {EquipoJuegoDeEvaluacion} from '../clases/EquipoJuegoDeEvaluacion';

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  alumno: Alumno;
  alumnoObservable = new ReplaySubject(1);
  profesor: Profesor;
  grupo: Grupo;
  juego: Juego;
  juegodeAvatar: JuegoDeAvatar;
  juegoDeEvaluacion: JuegoDeEvaluacion;
  equipo: Equipo;
  alumnosEquipo: Alumno[];
  alumnosGrupo: Alumno[];
  coleccion: Coleccion;
  cromos: Cromo[];
  cromo: Cromo;
  posicion: any;
  tiposPuntosDelJuego: any;
  nivelesDelJuego: any;
  alumnoSeleccionado: any;
  inscripcionAlumnoJuego: any;
  equipoSeleccionado: any;
  inscripcionEquipoJuego: any;

  alumnosDelJuego: any;
  listaAlumnosOrdenadaPorPuntos: any;
  rankingJuegoDePuntos: any;
  equiposDelJuego: any;
  listaEquiposOrdenadaPorPuntos: any;
  rankingEquiposJuegoDePuntos: any;


  alumnoJuegoDeColeccion: Alumno;
  alumnosJuegoDeColeccion: Alumno[];
  inscripcionAlumno: any;
  inscripcionEquipo: any;
  listaGrupos: any;
  imagenLogoEquipo: any;

  punto: Punto;
  insignia: Insignia;
  cromosSinRepetidos: any[];
  cromosQueNoTengo: any[];

  TablaAlumnoJuegoDeCompeticion: TablaAlumnoJuegoDeCompeticion[];
  TablaEquipoJuegoDeCompeticion: TablaEquipoJuegoDeCompeticion[];
  jornadas: any;
  JornadasCompeticion: any;

  PrivilegiosAlumno: any;
  // listaEquiposGrupo: any;

  elem;
  pos;
  cromosQueTengo;
  cromosQueTengoImagenDelante;
  cromosQueTengoImagenDetras;
  cromosQueNoTengoImagenDelante;
  cromosQueNoTengoImagenDetras;
  nickName;

  alumnosJuegoDeEvaluacion: AlumnoJuegoDeEvaluacion[];
  alumnos: Alumno[];
  equiposJuegoDeEvaluacion: EquipoJuegoDeEvaluacion[];
  equipos: Equipo[];
  alumnosDeMiEquipo: Alumno[];
  notaFinal: number;
  respuestas: any[];
  evaluacionesPendientes: number;
  evaluacionesARecibir: number;

  constructor() { }
  public TomaProfesor(profesor: Profesor) {
    this.profesor = profesor;
  }
  public DameProfesor(): Profesor {
    return this.profesor;
  }



  // public TomaProfesor(profesor: Profesor) {
  //   this.profesor.next(profesor);
  // }


  // public  DameProfesor(): any {
  //   return this.profesor;
  // }

  public TomaAlumnosJuegoDeColeccion(alumnos: Alumno []) {
    this.alumnosJuegoDeColeccion = alumnos;
  }
  public DameAlumnosJuegoDeColeccion(): Alumno [] {
    return this.alumnosJuegoDeColeccion;
  }

  public TomaAlumnoJuegoDeColeccion(alumno: Alumno) {
    this.alumnoJuegoDeColeccion = alumno;
  }
  public DameAlumnoJuegoDeColeccion(): Alumno {
    return this.alumnoJuegoDeColeccion;
  }

  public TomaGrupo(grupo: Grupo) {
    this.grupo = grupo;
  }

  public TomaListaGrupos(listaGrupos: any) {
    this.listaGrupos = listaGrupos;
  }

  public DameListaGrupos(): any {
    return this.listaGrupos;
  }

  public DameGrupo(): Grupo {
    return this.grupo;
  }

  // public TomaEquiposGrupo(listaEquipos: any) {
  //   this.listaEquiposGrupo = listaEquipos;
  // }

  // public DameEquiposGrupo(): any {
  //   return this.listaEquiposGrupo;
  // }

  public TomaJuego(juego: Juego) {
    this.juego = juego;
  }

  public DameJuego(): Juego {
    return this.juego;
  }
  public TomaJuegoAvatar(juego: JuegoDeAvatar) {
    this.juegodeAvatar = juego;
  }
  public DameJuegoAvatar() {
    return this.juegodeAvatar;
  }
  public TomaEquipo(equipo: Equipo) {
    this.equipo = equipo;
  }
  public TomaAlumnosEquipo(alumnos: Alumno[]) {
    this.alumnosEquipo = alumnos;
  }
  public DameEquipo(): Equipo {
    return this.equipo;
  }
  public DameAlumnosEquipo(): Alumno[] {
    return this.alumnosEquipo;
  }

  public TomaAlumnosGrupo(alumnos: Alumno[]) {
    this.alumnosGrupo = alumnos;
  }
  public DameAlumnosGrupo(): Alumno[] {
    return this.alumnosGrupo;
  }

  public TomaColeccion(coleccion: Coleccion) {
    this.coleccion = coleccion;
  }
  public DameColeccion(): Coleccion {
    return this.coleccion;
  }

  public TomaCromos(cromosColeccion: Cromo[]) {
    this.cromos = cromosColeccion;
  }

  public DameCromos(): Cromo[] {
    return this.cromos;
  }

  public TomaCromosSinRepetidos(MisCromos: any[]) {
    this.cromosSinRepetidos = MisCromos;
  }
  public TomaCromosQueNoTengo(cromos: any[]) {
    this.cromosQueNoTengo = cromos;
  }

  public DameCromosQueNoTengo(): any[] {
    return  this.cromosQueNoTengo;
  }

  public DameCromosSinRepetidos(): any[] {
    return this.cromosSinRepetidos;
  }

  public TomaCromo(cromo: Cromo) {
    this.cromo = cromo;
  }

  public DameCromo(): Cromo {
    return this.cromo;
  }

  public TomaDatosEvolucionAlumnoJuegoPuntos(posicion: any,
    tiposPuntosDelJuego: any,
    nivelesDelJuego: any,
    alumnoSeleccionado: any,
    inscripcionAlumnoJuego: any) {
    this.posicion = posicion;
    this.tiposPuntosDelJuego = tiposPuntosDelJuego;
    this.nivelesDelJuego = nivelesDelJuego;
    this.alumnoSeleccionado = alumnoSeleccionado;
    this.inscripcionAlumnoJuego = inscripcionAlumnoJuego;
  }

  public DameDatosEvolucionAlumnoJuegoPuntos(): any {
    const datos = {
      posicion: this.posicion,
      tiposPuntosDelJuego: this.tiposPuntosDelJuego,
      nivelesDelJuego: this.nivelesDelJuego,
      alumnoSeleccionado: this.alumnoSeleccionado,
      inscripcionAlumnoJuego: this.inscripcionAlumnoJuego
    };
    return datos;
  }

  public TomaDatosEvolucionEquipoJuegoPuntos(
    posicion: any,
    equipoSeleccionado: any,
    inscripcionEquipoJuego: any,
    nivelesDelJuego: any,
    tiposPuntosDelJuego) {
    this.posicion = posicion;
    this.equipoSeleccionado = equipoSeleccionado;
    this.inscripcionEquipoJuego = inscripcionEquipoJuego;
    this.nivelesDelJuego = nivelesDelJuego;
    this.tiposPuntosDelJuego = tiposPuntosDelJuego;

  }

  public DameDatosEvolucionEquipoJuegoPuntos(): any {
    const datos = {
      posicion: this.posicion,
      equipoSeleccionado: this.equipoSeleccionado,
      inscripcionEquipoJuego: this.inscripcionEquipoJuego,
      nivelesDelJuego: this.nivelesDelJuego,
      tiposPuntosDelJuego: this.tiposPuntosDelJuego
    };
    return datos;
  }

  public TomaInformacionJuego(nivelesDelJuego: any,
    tiposPuntosDelJuego: any) {
    this.nivelesDelJuego = nivelesDelJuego;
    this.tiposPuntosDelJuego = tiposPuntosDelJuego;
  }
  public DameInformacionJuego(): any {
    const datos = {
      nivelesDelJuego: this.nivelesDelJuego,
      tiposPuntosDelJuego: this.tiposPuntosDelJuego
    };
    return datos;
  }


  public TomaDatosParaAsignarPuntos(
    tiposPuntosDelJuego: any,
    nivelesDelJuego: any,
    alumnosDelJuego: any,
    listaAlumnosOrdenadaPorPuntos: any,
    rankingJuegoDePuntos: any,
    equiposDelJuego: any,
    listaEquiposOrdenadaPorPuntos: any,
    rankingEquiposJuegoDePuntos: any
  ) {

    this.tiposPuntosDelJuego = tiposPuntosDelJuego;
    this.nivelesDelJuego = nivelesDelJuego;
    this.alumnosDelJuego = alumnosDelJuego;
    this.listaAlumnosOrdenadaPorPuntos = listaAlumnosOrdenadaPorPuntos;
    this.rankingJuegoDePuntos = rankingJuegoDePuntos;
    this.equiposDelJuego = equiposDelJuego;
    this.listaEquiposOrdenadaPorPuntos = listaEquiposOrdenadaPorPuntos;
    this.rankingEquiposJuegoDePuntos = rankingEquiposJuegoDePuntos;
    console.log('Sesion ' + this.rankingEquiposJuegoDePuntos);
    console.log('Sesion ' + this.equiposDelJuego);
    console.log('Sesion ' + this.listaEquiposOrdenadaPorPuntos);

  }

  public DameDatosParaAsignarPuntos(): any {
    const datos = {
      tiposPuntosDelJuego: this.tiposPuntosDelJuego,
      nivelesDelJuego: this.nivelesDelJuego,
      alumnosDelJuego: this.alumnosDelJuego,
      listaAlumnosOrdenadaPorPuntos: this.listaAlumnosOrdenadaPorPuntos,
      rankingJuegoDePuntos: this.rankingJuegoDePuntos,
      equiposDelJuego: this.equiposDelJuego,
      listaEquiposOrdenadaPorPuntos: this.listaEquiposOrdenadaPorPuntos,
      rankingEquiposJuegoDePuntos: this.rankingEquiposJuegoDePuntos
    };
    console.log('Sesion regreso ' + datos.rankingEquiposJuegoDePuntos);

    return datos;
  }
  public DameRankingEquipos(): any {
    return this.rankingEquiposJuegoDePuntos;
  }

  public TomaAlumnosDelJuego(alumnos: any) {
    this.alumnosDelJuego = alumnos;
  }

  public DameAlumnosDelJuego(): any {
    return this.alumnosDelJuego;
  }

  public DameEquiposDelJuego(): any {
    return this.equiposDelJuego;
  }

  public TomaEquiposDelJuego(equipos: any) {
    this.equiposDelJuego = equipos;
  }

  // public TomaAlumno(alumno: Alumno) {
  //   this.alumno = alumno;
  // }
  public DameAlumno(): Alumno {
    return this.alumno;
  }
  public EnviameAlumno(): any {
    return this.alumnoObservable;
  }

  public TomaAlumno(alumno: Alumno) {
    this.alumno = alumno;
    this.alumnoObservable.next(alumno);
  }


  // public  DameProfesor(): any {
  //   return this.profesor;
  // }


  public TomaInscripcionAlumno(inscripcionAlumno: any) {
    this.inscripcionAlumno = inscripcionAlumno;
  }

  public DameInscripcionAlumno(): any {
    return this.inscripcionAlumno;
  }

  public TomaInscripcionEquipo(inscripcionEquipo: any) {
    this.inscripcionEquipo = inscripcionEquipo;
  }

  public DameInscripcionEquipo(): any {
    return this.inscripcionEquipo;
  }

  public TomaImagenLogoEquipo(imagenLogoEquipo: any) {
    this.imagenLogoEquipo = imagenLogoEquipo;
  }

  public DameImagenLogoEquipo(): any {
    return this.imagenLogoEquipo;
  }

  public TomaTipoPunto(punto: any) {
    this.punto = punto;
  }

  public DameTipoPunto(): any {
    return this.punto;
  }

  public TomaInsignia(insignia: any) {
    this.insignia = insignia;
  }

  public DameInsignia(): any {
    return this.insignia;
  }

  public TomaTablaAlumnoJuegoDeCompeticion(Tabla: TablaAlumnoJuegoDeCompeticion[]) {
    this.TablaAlumnoJuegoDeCompeticion = Tabla;
  }

  public DameTablaAlumnoJuegoDeCompeticion(): TablaAlumnoJuegoDeCompeticion[] {
    const Tabla = this.TablaAlumnoJuegoDeCompeticion;
    return Tabla;
  }

  public TomaDatosJornadas(
    jornadas: Jornada[],
    JornadasCompeticion: TablaJornadas[]
  ) {
  this.JornadasCompeticion = JornadasCompeticion;
  this.jornadas = jornadas;
  console.log ('jornadas:');
  console.log ( this.JornadasCompeticion);
  console.log ('TablaJornadas:');
  console.log ( this.jornadas);

}

  public DameDatosJornadas(): any {
    const datos = {
      jornadas: this.jornadas,
      JornadasCompeticion: this.JornadasCompeticion
    };
    console.log('Aqui estan las jornadas guardadas y la tabla de jornadas: ');
    console.log(this.jornadas);
    console.log(this.JornadasCompeticion);

    return datos;
  }

  public TomaTablaEquipoJuegoDeCompeticion(Tabla: TablaEquipoJuegoDeCompeticion[]) {
    this.TablaEquipoJuegoDeCompeticion = Tabla;
  }

  public DameTablaEquipoJuegoDeCompeticion(): TablaEquipoJuegoDeCompeticion[] {
    const Tabla = this.TablaEquipoJuegoDeCompeticion;
    return Tabla;
  }



  public TomaInfoParaRegaloCromo(
    elem,
    pos,
    cromosSinRepetidos,
    cromosQueTengo,
    cromosQueTengoImagenDelante,
    cromosQueTengoImagenDetras,
    cromosQueNoTengo,
    cromosQueNoTengoImagenDelante,
    cromosQueNoTengoImagenDetras,
    coleccion) {

      this.elem = elem;
      this.pos = pos;
      this.cromosSinRepetidos = cromosSinRepetidos;
      this.cromosQueTengo = cromosQueTengo;
      this.cromosQueTengoImagenDelante = cromosQueTengoImagenDelante;
      this.cromosQueTengoImagenDetras = cromosQueTengoImagenDetras;
      this.cromosQueNoTengo = cromosQueNoTengo;
      this.cromosQueNoTengoImagenDelante = cromosQueNoTengoImagenDelante;
      this.cromosQueNoTengoImagenDetras = cromosQueNoTengoImagenDetras;
      this.coleccion = coleccion;
    }

    public DameInfoParaRegaloCromo(): any {
      const datos = {
        elem: this.elem,
        pos: this.pos,
        cromosSinRepetidos: this.cromosSinRepetidos,
        cromosQueTengo: this.cromosQueTengo,
        cromosQueTengoImagenDelante: this.cromosQueTengoImagenDelante,
        cromosQueTengoImagenDetras: this.cromosQueTengoImagenDetras,
        cromosQueNoTengo: this.cromosQueNoTengo,
        cromosQueNoTengoImagenDelante: this.cromosQueNoTengoImagenDelante ,
        cromosQueNoTengoImagenDetras: this.cromosQueNoTengoImagenDetras,
        coleccion: this.coleccion
      };
      return datos;

    }

  public TomaPrivilegiosAlumno(Priv: any) {
    this.PrivilegiosAlumno = Priv;
  }

  public DamePrivilegiosAlumno() {
    return this.PrivilegiosAlumno;
  }

  public TomaNickName(nick: string) {
    this.nickName = nick;
  }

  public DameNickName(): string {
    return this.nickName;
  }

  public TomaJuegoEvaluacion(juegoDeEvaluacion: JuegoDeEvaluacion) {
    this.juegoDeEvaluacion = juegoDeEvaluacion;
  }
  public DameJuegoEvaluacion(): JuegoDeEvaluacion {
    return this.juegoDeEvaluacion;
  }
  public TomaAlumnosJuegoDeEvaluacion(alumnosJuegoDeEvaluacion: AlumnoJuegoDeEvaluacion[]) {
    this.alumnosJuegoDeEvaluacion = alumnosJuegoDeEvaluacion;
  }
  public DameAlumnosJuegoDeEvaluacion(): AlumnoJuegoDeEvaluacion[] {
    return this.alumnosJuegoDeEvaluacion;
  }
  public TomaEquiposJuegoDeEvaluacion(equiposJuegoDeEvaluacion: EquipoJuegoDeEvaluacion[]) {
    this.equiposJuegoDeEvaluacion = equiposJuegoDeEvaluacion;
  }
  public DameEquiposJuegoDeEvaluacion(): EquipoJuegoDeEvaluacion[] {
    return this.equiposJuegoDeEvaluacion;
  }
  public TomaAlumnos(alumnos: Alumno[]): void {
    this.alumnos = alumnos;
  }
  public DameAlumnos(): Alumno[] {
    return this.alumnos;
  }
  public TomaEquipos(equipos: Equipo[]): void {
    this.equipos = equipos;
  }
  public DameEquipos(): Equipo[] {
    return this.equipos;
  }
  public TomaAlumnosDeMiEquipo(alumnos: Alumno[]): void {
    this.alumnosDeMiEquipo = alumnos;
  }
  public DameAlumnosDeMiEquipo(): Alumno[] {
    return this.alumnosDeMiEquipo;
  }
  public DameNotaFinal(): number {
    return this.notaFinal;
  }
  public TomaNotaFinal(nota: number) {
    this.notaFinal = nota;
  }
  public DameRespuestas(): any[] {
    return this.respuestas;
  }
  public TomaRespuestas(respuestas: any[]) {
    this.respuestas = respuestas;
  }
  public TomaEvaluacionesPendientes(evaluacionesPendientes: number) {
    this.evaluacionesPendientes = evaluacionesPendientes;
  }
  public DameEvaluacionesPendientes(): number {
    return this.evaluacionesPendientes;
  }
  public TomaEvaluacionesARecibir(evaluacionesARecibir: number) {
    this.evaluacionesARecibir = evaluacionesARecibir;
  }
  public DameEvaluacionesARecibir(): number {
    return this.evaluacionesARecibir;
  }
}


