# Classpip móvil para estudiantes

## ¿Qué es Classpip?

[![Classpip Badge](https://img.shields.io/badge/classpip-dashboard-brightgreen.svg)](https://github.com/classpip/classpip-dashboard-dev)
[![Classpip Badge](https://img.shields.io/badge/classpip-movil--profesor-brightgreen)](https://github.com/classpip/classpip-movil-profesor-dev)
[![Classpip Badge](https://img.shields.io/badge/classpip-movil--estudiante-brightgreen)](https://github.com/classpip/classpip-movil-estudiante-dev)
[![Classpip Badge](https://img.shields.io/badge/classpip-server-brightgreen.svg)](https://github.com/classpip/classpip-server-dev)
[![Classpip Badge](https://img.shields.io/badge/classpip-API-brightgreen)](https://github.com/classpip/classpip-API-dev)
[![license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://github.com/classpip/classpip/blob/master/LICENSE)


Classpip es una herramienta para introducir gamificación en el aula. La gamificación consiste en la introducción de las mecánicas típicas de los juegos en escenarios que no son juegos, para motivar a las personas a hacer cosas que quizá no tienen muchas ganas de hacer.

![classpip-arch](https://github.com/classpip/classpip/blob/master/classpip.png)

En la actualidad Classpip se compone de 5 aplicaciones, que se muestran en la figura, con una indicación de las tecnologías más importantes usadas en cada una de ellas. A continuación se describen esas aplicaciones y se proporcionan los enlaces a las versiones en desarrollo de cada una de ellas.
 
* *Classpip-dashboard*: Es la aplicación web con la que, desde su ordenador, el profesor puede tomar todas las decisiones sobre configuración de los juegos (por ejemplo, crear una colección nueva) e interacción con cada juego (por ejemplo, asignar puntos a los alumnos). 
[![Classpip Badge](https://img.shields.io/badge/classpip-dashboard-brightgreen.svg)](https://github.com/classpip/classpip-dashboard-dev)

* *Classpip-movil-profesor*: Es la aplicación mediante la cual el profesor puede hacer algunas funciones que resulta apropiado hacer desde un dispositivo móvil (por ejemplo, asignar cromos a alumnos concretos o consultar el ranking del juego de puntos).
[![Classpip Badge](https://img.shields.io/badge/classpip-movil--profesor-brightgreen)](https://github.com/classpip/classpip-movil-profesor-dev)

* *Classpip-movil-estudiante*: Es la aplicación mediante la cual el alumno interacciona con el juego (por ejemplo, consulta los puntos que tiene, intercambia cromos con los compañeros o responde a las preguntas de un juego de preguntas). 
[![Classpip Badge](https://img.shields.io/badge/classpip-movil--estudiante-brightgreen)](https://github.com/classpip/classpip-movil-estudiante-dev)
  
* *Classpip-API*: Es la aplicación que ofrece al resto de aplicaciones los servicios de acceso a datos en modo API-REST  (por ejemplo, obtener la lista de juegos de un grupo, o los cromos que tiene un alumno en su álbum).
[![Classpip Badge](https://img.shields.io/badge/classpip-API-brightgreen)](https://github.com/classpip/classpip-API-dev)
 
 * *Classpip-server*: Es la aplicación que realiza tareas de notificación entre los usuarios. Por ejemplo, recibe la notificación de que un alumno ha completado un cuestionario y remite esa notificación al Dash para que refleje esa circunstancia en el listado de alumnos que participan en el juego. También realiza tareas de registro de actividad (por ejemplo, registrar la creación de grupos o de juegos).
[![Classpip Badge](https://img.shields.io/badge/classpip-server-brightgreen.svg)](https://github.com/classpip/classpip-server-dev)  

# Classpip-movil-estudiante

Este repositorio contiene la aplicación que se ejecuta en el movil del estudiante, en su versión en desarrollo.

## Git y GitHub

Necesitas tener instalado Git y una cuenta en GitHub
 
https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
 
https://github.com/

Debes crear una cuenta en Github para poder hacer contribuciones en el desarrollo del código de esta aplicación.

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


## Instalación de la aplicación

Para instalar la aplicación y organizar la información para futuras contribuciones hay que seguir los pasos del 1 al 6 del protocolo de instalación y contríbuciones que se encuentra aquí: https://github.com/classpip/classpip.

## Puesta en marcha en modo navegador web

Puedes iniciar la app para trabajar con ella desde el navegador haciendo

```
ionic serve --lab
```
Si quieres acceder desde tu propio dispositivo movil a la aplicación en modo navegador web debes poner en marcha la aplicación asi:

```
ionic serve --external
```
El sistema te indicará la IP y el puerto en los que está escuchando la aplicación de manera que desde tu movil puedes conectarte a esa IP:puerto para acceder a la aplicación. El comportamiento es bastante similar al que tienes si te instalas la aplicación en el móvil.
Recuerda que para que funcione la aplicación debes poner en marcha también Classpip-API y Classpip-server.
 
## Instalación de la aplicación en tu dispositivo móvil

Para descargar la aplicación en un dispositivo móvil Android hay que instalar adicionalmente Java JDK 8 y Android Studio. Además, hay que habilitar en el dispositivo los permisos para desarrolladores (hay que averiguar en cada dispositivo cómo se hace eso).

Una vez conectado el móvil al ordenador por USB, el comando para descargar la aplicación en el móvil es:
```
ionic cordova run android
```
