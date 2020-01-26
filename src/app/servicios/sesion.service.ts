import { Injectable } from '@angular/core';
import { Profesor, Grupo, Juego, Equipo, Alumno, Coleccion, Cromo, Punto, Insignia } from '../clases';
import { AnonymousSubject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  profesor: Profesor;
  grupo: Grupo;
  juego: Juego;
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

  alumno: Alumno;
  alumnoJuegoDeColeccion: Alumno;
  inscripcionAlumno: any;
  inscripcionEquipo: any;
  listaGrupos: any;
  imagenLogoEquipo: any;

  punto: Punto;
  insignia: Insignia;
  cromosSinRepetidos: any[];

  // listaEquiposGrupo: any;

  constructor() { }
  public TomaProfesor(profesor: Profesor) {
    this.profesor = profesor;
  }
  public  DameProfesor(): Profesor {
    return this.profesor;
  }
  public TomaAlumnoJuegoDeColeccion(alumno: Alumno) {
    this.alumnoJuegoDeColeccion = alumno;
  }
  public  DameAlumnoJuegoDeColeccion(): Alumno {
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

  public  DameGrupo(): Grupo {
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
  public  DameJuego(): Juego {
    return this.juego;
  }
  public TomaEquipo(equipo: Equipo) {
    this.equipo = equipo;
  }
  public TomaAlumnosEquipo(alumnos: Alumno[]) {
    this.alumnosEquipo = alumnos;
  }
  public  DameEquipo(): Equipo {
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
    return this.coleccion ;
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

  public DameCromosSinRepetidos(): any[] {
    return this.cromosSinRepetidos;
  }

  public TomaCromo( cromo: Cromo) {
    this.cromo = cromo;
  }

  public DameCromo(): Cromo {
    return this.cromo;
  }

  public TomaDatosEvolucionAlumnoJuegoPuntos( posicion: any,
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

  public TomaInformacionJuego(  nivelesDelJuego: any,
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
        console.log ('Sesion ' + this.rankingEquiposJuegoDePuntos );
        console.log ('Sesion ' + this.equiposDelJuego );
        console.log ('Sesion ' + this.listaEquiposOrdenadaPorPuntos );

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
    console.log ('Sesion regreso ' + datos.rankingEquiposJuegoDePuntos );

    return datos;
  }
  public DameRankingEquipos(): any {
    return this.rankingEquiposJuegoDePuntos;
  }

  public TomaAlumnosDelJuego( alumnos: any) {
    this.alumnosDelJuego = alumnos;
  }

  public DameAlumnosDelJuego(): any {
    return this.alumnosDelJuego;
  }

  public DameEquiposDelJuego(): any {
    return this.equiposDelJuego;
  }

  public TomaEquiposDelJuego( equipos: any) {
    this.equiposDelJuego = equipos;
  }

  public TomaAlumno(alumno: Alumno) {
    this.alumno = alumno;
  }
  public DameAlumno(): Alumno {
    return this.alumno;
  }

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
}
