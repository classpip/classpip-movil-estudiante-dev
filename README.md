# Classpip mobile para estudiantes

## ¿Qué es Classpip?

[![Classpip Badge](https://img.shields.io/badge/classpip-dashboard-brightgreen.svg)](https://github.com/rocmeseguer/classpip-dashboard)
[![Classpip Badge](https://img.shields.io/badge/classpip-mobile--profe-brightgreen)](https://github.com/rocmeseguer/classpip-mobile-profe)
[![Classpip Badge](https://img.shields.io/badge/classpip-mobile--student-brightgreen)](https://github.com/rocmeseguer/classpip-mobile-student)
[![Classpip Badge](https://img.shields.io/badge/classpip-server-brightgreen.svg)](https://github.com/rocmeseguer/classpip-server)
[![Classpip Badge](https://img.shields.io/badge/classpip-services-brightgreen.svg)](https://github.com/rocmeseguer/classpip-services)
[![license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://github.com/classpip/classpip/blob/master/LICENSE)


Classpip es una herramienta para introducir gamificación en el aula. La gamificación consiste en la introducción de las mecánicas típicas de los juegos en escenarios que no son juegos, para motivar a las personas a hacer cosas que quizá no tienen muchas ganas de hacer.

![classpip-arch](https://github.com/classpip/classpip/raw/master/images/project-architecture.png)

En la actualidad Classpip tiene 5 módulos:
 
* *Dashboard*: Es la aplicación web con la que, desde su ordenador, el profesor puede tomar todas las decisiones sobre configuración de los juegos (por ejemplo, crear una colección nueva) e interacción con cada juego (por ejemplo, asignar puntos a los alumnos).
 [![Classpip Badge](https://img.shields.io/badge/classpip-dashboard-brightgreen.svg)](https://github.com/rocmeseguer/classpip-dashboard)

* *Mobile-profe*: Es la app mediante la cual el profesor puede hacer algunas funciones que resulta apropiado hacer desde un dispositivo móvil (por ejemplo, asignar cromos a alumnos concretos o consultar el ranking del juego de puntos).
 [![Classpip Badge](https://img.shields.io/badge/classpip-mobile--profe-brightgreen)](https://github.com/rocmeseguer/classpip-mobile-profe)

* *Mobile-student*: Es la app mediante la cual el alumno interacciona con el juego (por ejemplo, consulta los puntos que tiene, intercambia cromos con los compañeros o responde a las preguntas de un juego de preguntas). 
[![Classpip Badge](https://img.shields.io/badge/classpip-mobile--student-brightgreen)](https://github.com/rocmeseguer/classpip-mobile-student)
  
* *Services*: Es la aplicación que ofrece al resto de módulos los servicios de acceso a datos en modo API-REST  (por ejemplo, obtener la lista de juegos de un grupo, o los cromos que tiene un alumno en su álbum).
 [![Classpip Badge](https://img.shields.io/badge/classpip-services-brightgreen.svg)](https://github.com/rocmeseguer/classpip-services)
 
 * *Server*: Es un servidor que realizar tareas de notificación entre los usuarios. Por ejemplo, recibe la notificación de que un alumno ha completado un cuestionario y remite esa notificación al Dash para que refleje esa circunstancia en el listado de alumnos que participan en el juego. También realiza tareas de registro de actividad (por ejemplo, registrar la creación de grupos o de juegos).
 [![Classpip Badge](https://img.shields.io/badge/classpip-server-brightgreen.svg)](https://github.com/rocmeseguer/classpip-server)

  
# Mobile-student

Este repositorio contiene la aplicación que se ejecuta en el movil del estudiante.

## Git y GitHub

Necesitas tener instalado Git y una cuenta en GitHub
 
https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
 
https://github.com/

## NodeJS

Instala NodeJS v10.13.0 (también instalará el gestor de paquetes npm). Comprueba que has instalado la versión correcta haciendo:

node -v
> v10.13.0

## Ionic y Cordova

Necesitarás estas dos instalaciones (haz las instalaciones con permisos de administrador).

```
npm install -g ionic@4.6.0
npm install -g cordova@8.1.2
```
Comprueba que has instalado las versiones correctas haciendo:

```
npm list -g -depth=0
```


## Dependencias locales

Después de clonar el repositorio, instala las dependencias locales:

```
npm install
```

## Puesta en marcha en modo navegador web

Puedes iniciar la app para trabajar con ella desde el navegador haciendo

```
ionic serve --lab
```
## Instalación en tu dispositivo movil

PENDIENTE
