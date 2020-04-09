# Classpip mobile application for students
[![Classpip Badge](https://img.shields.io/badge/classpip-dashboard-brightgreen.svg)](https://github.com/rocmeseguer/classpip-dashboard)
[![Classpip Badge](https://img.shields.io/badge/classpip-mobile-brightgreen.svg)](https://github.com/rocmeseguer/classpip-mobile)
[![Classpip Badge](https://img.shields.io/badge/classpip-services-brightgreen.svg)](https://github.com/rocmeseguer/classpip-services)
[![license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://github.com/classpip/classpip/blob/master/LICENSE)

Classpip is a software architecture for teachers and students to perform school gamification activities inside the school environment through different platforms such as mobiles, tablets and computers.

The software architecture is composed by two mobile applications for performing “quick” class activities oriented to teachers and students. For “long” operations such as deep into reports and setup the platform there is an administration dashboard accessible from every computer. These three pieces share the information through a service-oriented architecture that exposes the main methods for data manipulation.

![classpip-arch](https://github.com/classpip/classpip/raw/master/images/project-architecture.png)

# Mobile-student

This repository contains the mobile application for students.


## Global dependencies

You need to install NodeJS v10.13.0. This will install also npm (Node Package Manager). Check that you have the correc NodeJS version:

node -v
> v10.13.0

Install also ionic and cordova:

```
npm install -g ionic@~4.6.0
npm install -g cordova@~8.1.2
```
Check that you have the correct versions:

```
npm list -g -depth=0
```


## Local dependencies

After cloning this repository you must install the local dependencies:

```
npm install
```

## License

Classpip is released under the [Apache2 License](https://github.com/classpip/classpip-mobile/blob/master/LICENSE).
