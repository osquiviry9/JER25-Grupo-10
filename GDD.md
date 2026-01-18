  <img src="FotosGDD/cabecera.png" width="800"/>

# 

# **Game Design Document (GDD)**

**Ponying around\!**

Juegos en Red

Grado en Diseño y Desarrollo de Videojuegos 2025-2026

* Íñigo García Griñolo

* Óscar Pinadero Quintana

* Silvia Álvaro Curiel

* Julia Moya Sánchez

* Henar San Román Santamaría

# **Índice**

[Índice](#índice)

[Introducción](#introduccion)

[Información General](#informacion-general)
- [1.1 Nombre del juego](#11-nombre-del-juego)
- [1.2 Género y dimensión](#12-genero-y-dimension)
- [1.3 Plataforma](#13-plataforma)
- [1.4 Audiencia Objetivo](#14-audiencia-objetivo)

[2. Mecánicas y Jugabilidad](#2-mecanicas-y-jugabilidad)

- [2.1 Jugabilidad](#21-jugabilidad)
- [2.2 Mecánicas Principales](#22-mecanicas-principales)
- [2.3 Controles](#23-controles)
- [2.4 Diagrama de flujo](#24-diagrama-de-flujo)

[3. Arte y Diseño Visual](#3-arte-y-diseno-visual-bocetos-y-modelados)

- [3.1 Interfaces](#31-interfaces)
- [3.2 Entornos](#32-entornos)
- [3.3 Recolectables](#33-recolectables)
- [3.4 Personajes](#34-personajes)

  - [3.4.1 Beersquiviry](#341-beersquiviry)
  - [3.4.2 Ache](#342-ache)
  - [3.4.3 Kamil & Mayo](#343-kamil--mayo)
  - [3.4.4 Haiire](#344-haiire)
  - [3.4.5 Domdimadon](#345-domdimadon)

- [3.5 Logo del juego](#35-logo-del-juego)

[4. Sonidos y efectos sonoros](#4-sonidos-y-efectos-sonoros)

- [4.1 Música](#41-musica)
- [4.2 Efectos de sonido](#42-efectos-de-sonido)

[5. Narrativa](#5-narrativa)

- [5.1 Historia](#51-historia)
- [5.2 Personajes](#52-personajes)

[6. Comunicación](#6-comunicacion)

- [6.1 Marketing](#61-marketing)

[7. Arquitectura de Red y Multijugador](#7-arquitectura-de-red-y-multijugador) 
- [7.1 API REST](#71-api-rest)
- [7.2 WebSockets](#72-websockets)



## **Introducción** 

El juego consistirá en una carrera entre dos jugadores, que manejan a dos ponis, su objetivo será llegar a la meta antes que el contrincante evitando los obstáculos e intentando coger los potenciadores.

Se usará el motor de videojuegos unity y los conocimientos adquiridos en la asignatura para poder lograr un videojuego multijugador.

## **Información General** 

### **1.1 Nombre del juego** 

“Ponying around\!”

### **1.2 Género y dimensión** 

El juego será un videojuego de carreras, concretamente de ponis.

Será en un 2D con una estética de dibujos animados. Contará con un entorno ambientado en el campo, con colores verdes, amarillentos y marrones predominantemente. Además, cada personaje contará con su paleta de colores particular para que se distingan perfectamente y se muestre su estilo único.

### **1.3 Plataforma** 

El juego estará disponible para PC.

### **1.4 Audiencia Objetivo** 

El juego tendrá una orientación para el público general, pero más concretamente a un público infantil y forofos de “My Little Pony”, ya que este es la principal inspiración artística para el juego.


## **2\. Mecánicas y Jugabilidad** 

### **2.1 Jugabilidad** 

El jugador podrá escoger entre cinco diferentes ponis, cada uno tematizado por un integrante del equipo, cada uno tendrá una descripción distinta.

El jugador, en la pantalla de jugar verá los ponis puestos en 2D, puestos en una pista que se recorre horizontalmente de derecha a izquierda, los ponis estarán en una profundidad, **sin pantalla dividida**, véase el apartado de bocetos para un croquis sobre esta misma.

A nivel técnico los ponis estarán quietos y será el entorno el que se mueva. El entorno está compuesto por el camino donde habrá vallas de distintos tipos y las frutas (manzana y limalimón), aparte de un fondo para dar ambiente.

Contará con físicas de salto y al tirar las vallas en caso de choque.  

### **2.2 Mecánicas Principales** 

* Salto de vallas: Los jugadores (ponis) deberán esquivar las vallas, de lo contrario, al chocar con ellas serán ralentizados perdiendo la oportunidad de poder ganar y perdiendo vida.  
    
* Vida: El poni tiene un medidor de vida, que aguanta tres (3) choques de valla antes de desmayarse y abandonar la carrera, provocando que el juego termine y pierda el juego.

* LimaLimón: Fruta especial que te suma una vida.

* Manzana: Fruta especial que te hace inmune a no saltar una valla tanto en la ralentización como en la vida.

* Kakiwii: Fruta que hace que el poni que se lo coma se vaya de vientre y ensucie temporalmente la pantalla del poni contrario

### **2.3 Controles** 

El jugador usará el teclado y el ratón para moverse por los menús del juego y la tecla W o la flecha de dirección hacia arriba para saltar.

De manera adicional se ilustra en este gráfico.

<p align="center">
  <img src="FotosGDD/raton.png" width="300"/>
  <img src="FotosGDD/teclado.jpeg" width="300"/>
</p>


### **2.4 Diagrama de flujo** 

 <img src="FotosGDD/diagramaflujo.png" width="600"/>


## **3\. Arte y Diseño Visual (Bocetos y Modelados)** 

## **3.1 Interfaces**

 <img src="FotosGDD/bocetosLogo.png" width="400"/>


Boceto de pantalla de inicio, pantalla de selección y menú de opciones

 <img src="FotosGDD/menu.png" width="600"/>


Menú de Inicio

 <img src="FotosGDD/selector.png" width="600"/>


Pantalla  de selector de personajes

 <img src="FotosGDD/carrera.png" width="600"/>


Pantalla de carrera

 <img src="FotosGDD/tutorial.jpeg" width="600"/>


Pantalla de ayuda/tutorial

 <img src="FotosGDD/ajustes.png" width="600"/>


Pantalla de ajustes

 <img src="FotosGDD/pausa.png" width="600"/>


Pantalla de pausa

 <img src="FotosGDD/historia.png" width="600"/>


Pantalla de la historia de los ponis

 <img src="FotosGDD/creditos.png" width="600"/>


Pantalla de créditos

### **3.2 Entornos** 

 <img src="FotosGDD/bocetoCarrera.png" width="400"/>


Boceto Inicial de la pista de carreras

 <img src="FotosGDD/bocetoCarrera2.png" width="400"/>


Boceto inicial de la pista de carreras con las frutas “manzana” y “limalimón”

 <img src="FotosGDD/bocetoCarrera3.png" width="400"/>


Boceto más visual de la pista de carreras con las frutas “manzana” y “limalimón”

 <img src="FotosGDD/bocetocarrera4.png" width="600"/>


Boceto final de la pista de carreras con las frutas y el contador de vidas.

 <img src="FotosGDD/matadero.jpeg" width="600"/>


Entorno del sótano donde nuestros ponis son brutalmente asesinados

 <img src="FotosGDD/tuberia.png" width="600"/>


Tubería que transporta los desechos de los ponis

 <img src="FotosGDD/Establo.png" width="600"/>


Establo vacío de los ponis

### **3.3 Recolectables** 

 <img src="FotosGDD/frutaBocetos.png" width="300"/>



Bocetos de manzana y limalimón

Iconos finales manzana, limalimón y kakiwi

 <img src="FotosGDD/Herradura.png" width="200"/>


Icono final de la vida de los ponis

### **3.4 Personajes** 

### **3.4.1 Beersquiviry** 

<p align="center">
 <img src="FotosGDD/beerBoceto.png" width="200"/>
 <img src="FotosGDD/beerBoceto2.png" width="200"/>
 <img src="FotosGDD/beerRun1.png" width="200"/>
</p>


Bocetos personaje número 1: Beersquiviry

  <img src="FotosGDD/BeerRunComplete.png" width="600"/>


Diseño final personaje número 1 corriendo: Beersquiviry


  <img src="FotosGDD/BeerComplete.png" width="300"/>


Imagen final del personaje 1: Beersquiviry

<p align="center">
  <img src="FotosGDD/BeerJump1.png" width="200"/>
  <img src="FotosGDD/BeerJump2.png" width="200"/>
  <img src="FotosGDD/BeerJump3.png" width="200"/>
</p>

Secuencia de salto del personaje 1: Beersquiviry

  <img src="FotosGDD/BeerDead.png" width="300"/>

Personaje 1, Beersquiviry, previo a morir

  <img src="FotosGDD/BeerFinal.jpeg" width="600"/>


Objeto final del personaje Beersquiviry

### **3.4.2 Ache** 


  <img src="FotosGDD/AcheBocetos.png" width="300"/>
  <img src="FotosGDD/AcheRun.png" width="350"/>


Bocetos personaje número 2: Ache

  <img src="FotosGDD/AcheRunComplet.png" width="600"/>


Diseño final del personaje 2 corriendo: Ache

  <img src="FotosGDD/AcheComplete.png" width="300"/>


Imagen final del personaje 2, Ache


<p align="center">
  <img src="FotosGDD/AcheJump1.png" width="200"/>
  <img src="FotosGDD/AcheJump2.png" width="200"/>
  <img src="FotosGDD/AcheJump3.png" width="200"/>
</p>


Secuencia de salto del personaje 2, Ache

  <img src="FotosGDD/AcheDead.png" width="300"/>

Personaje 2, Ache, previa a morir

  <img src="FotosGDD/AchFinal.jpeg" width="600"/>


Objeto final del personaje Ache

### **3.4.3 Kamil & Mayo** 

<p align="center">
  <img src="FotosGDD/KamilBoceto.png" width="300"/>
  <img src="FotosGDD/KamilBoceto2.png" width="300"/>
</p>

Bocetos personaje número 3: Kamil

  <img src="FotosGDD/MayoBoceto.png" width="300"/>


Boceto personaje número 4: Mayo

  <img src="FotosGDD/MyoRun.png" width="800"/>


Diseño final del personaje 4 corriendo: Mayo

  <img src="FotosGDD/KamilComplete.png" width="300"/>


Diseño final del personaje 3 y 4: Kamil & Mayo

<p align="center">
  <img src="FotosGDD/KamilRun1.png" width="150"/>
  <img src="FotosGDD/KamilRun2.png" width="150"/>
  <img src="FotosGDD/KamilRun3.png" width="150"/>
  <img src="FotosGDD/KamilRun4.png" width="150"/>
</p>


Diseño final de los personajes 3 y 5 corriendo: Kamil & Mayo

<p align="center">
  <img src="FotosGDD/KamilJump1.png" width="200"/>
  <img src="FotosGDD/KamilJump2.png" width="200"/>
  <img src="FotosGDD/KamilJump3.png" width="200"/>
</p>

Secuencia de salto del personaje número 3 y 4: Kamil & Mayo

  <img src="FotosGDD/KamilDead.png" width="300"/>


Personajes 3 y 4, Kamil y Mayo, previas a morir

<img src="FotosGDD/KamilEnd.jpeg" width="600"/>

Objeto final de los personajes 3 y 4

### **3.4.4 Haiire** 

  <img src="FotosGDD/HaireBocetos.png" width="300"/>


Bocetos personaje número 5: Haiire

  <img src="FotosGDD/HaireComplete.png" width="300"/>


Diseño final personaje número 5: Haiire

  <img src="FotosGDD/HaireRun.png" width="600"/>


Diseño final del personaje 5 corriendo: Haiire

<p align="center">
  <img src="FotosGDD/HaireJump1.png" width="200"/>
  <img src="FotosGDD/HaireJump2.png" width="200"/>
  <img src="FotosGDD/HaireJump3.png" width="200"/>
</p>


Secuencia de salto del personaje 5, Haiire

  <img src="FotosGDD/HaireDead.png" width="300"/>


Personaje 5, Haiire, previa a morir

  <img src="FotosGDD/HaireFinal.jpeg" width="600"/>


Objeto final del personaje 5, Haiire

### **3.4.5 Domdimadon** 


<p align="center">
  <img src="FotosGDD/DomBoceto.png" width="200"/>
  <img src="FotosGDD/DomComplete2.png" width="150"/>
  <img src="FotosGDD/DomBocetoColor.png" width="200"/>
</p>

Bocetos personaje número 6: Domdimadon


<img src="FotosGDD/DomRun.png" width="600"/>


Diseño final del personaje 6 corriendo: Domdimadon 

<p align="center">
  <img src="FotosGDD/DomJump1.png" width="200"/>
  <img src="FotosGDD/DomJump3.png" width="200"/>
  <img src="FotosGDD/DomJump2.png" width="200"/>
</p>



Secuencia de salto del personaje 6, Domdimadon

  <img src="FotosGDD/DomComplete.png" width="300"/>


Diseño final del personaje 6, Domdimadon

  <img src="FotosGDD/DomDead.png" width="300"/>


Personaje 6, Domdimadon previo a morir

  <img src="FotosGDD/DomFinal.jpeg" width="600"/>

Objeto final del personaje 6, Domdimadon

### **3.5 Logo del juego** 

  <img src="FotosGDD/bocetoslogosJuego.png" width="300"/>


Posibles bocetos
  <img src="FotosGDD/LogoJuego.png" width="300"/>


Logo final del juego

  <img src="FotosGDD/Logo.png" width="200"/>


Logo final del estudio

## **4\. Sonidos y efectos sonoros** 

### **4.1 Música** 

La banda sonora consta de música alegre y feliz que acompañe el espíritu de carreras.

### **4.2 Efectos de sonido** 

Aparte de la música, el juego contará con diversos efectos de sonido que darán más ambiente:

* Al realizar un poni la acción de saltar sonará un sonido similar a la onomatopeya **‘*boing*’**.  
* Cuando un poni se dé contra una valla sonará un golpe.  
* Al coger una manzana, una limalimón, o un kiwi sonará un efecto de feedback.  
* Al estar en los efectos de limalimón sonará un sonido de potenciación.  
* Dándole a los botones para desplazarse por los menús sonará un sonido de **‘*clic*’**.
* La cuenta atrás para la carrera es visual y sonora.

## **5\. Narrativa** 

### **5.1 Historia** 

La historia sigue de cerca a nuestros ponis, viviendo tranquilamente en Tohelloso, pero una vez al año, un señor obliga a los ponis a correr una carrera a muerte entre los mismos. Este señor, apodado “Melgarga” tiene como misión exterminar a los ponis de una macabra manera, el que pierda será exterminado de una manera horrible, macabra y perturbadora. Utilizando ... ¡Una trituradora\! ¿Sobrevivirás? 

### 

### 

Esta historia se ilustra al principio del juego con una secuencia que explica de manera clara el contexto del juego.

<p align="center">
  <img src="FotosGDD/Inicio_1.jpeg" width="300"/>
  <img src="FotosGDD/Inicio2.jpeg" width="300"/>
</p>


Secuencia contextual inicial

Cuando un poni muere, se enseña su establo vacío para reforzar esta narrativa

  <img src="FotosGDD/Establo.png" width="600"/>

Imagen del establo vacío

### **5.2 Personajes** 

* [**Haiire**](#3.4.4-haiire): Se comió una fruta, llamada *cuernocuerno fruit*, esto provocó que brotase un cuerno de su lóbulo frontal, pudiendo tirar rayos desde ahí y provocando una oleada de bulliyng por parte de los secuaces de Melgarga. Ahora busca venganza salvando a los ponis de sus malvadas garras.  
* [**Domdimadon**](#3.4.5-domdimadon) : Se comió la fruta después de Haiire, pero a diferencia de ella, es la mascota de Melgarga y por lo tanto no quiere salvar a los ponis.  
* [**Ache**](#3.4.2-ache): Antes era un pegaso pero Melgarga le arrancó las alas. Ahora es un poni que está aprendiendo el poder de la hipnotización para hipnotizar a Melgarga y controlarlo para que se terminen las carreras mortales. 
* [**Kamil**](#3.4.3-kamil-&-mayo)**:** Amante de lo ajeno, corre soltando fanzines por los ojos y patatas de sal y vinagre del ponydona, es acompañada por Mayo, una entidad que a través de la lobotomía que se hizo Kamil se coló en su cuerpo y la controla.  
* [**Beersquiviry**](#3.4.1-beersquiviry)**:** Un día, después de una larga fiesta se despertó en la villa de los ponis, corre en cada carrera con la esperanza de salir de la villa y poder volver a su casa a tomarse una cerveza.

## 

## **6\. Comunicación** 

### **6.1 Marketing** 
Se decide empezar la fase de marketing en torno a seis (6) meses antes del lanzamiento del juego, con una campaña publicitaria agresiva en todos los medios (Televisión, Redes Sociales, Publicidad en la calle (Paradas de buses, paradas de metro, Buses y carteles en edificios)).

Además, la semana de antes, dos o más desarrolladores, aparecerán por las calles céntricas de ciudades clave de España haciendo cosplay de su personaje para llamar la atención de los transeúntes e informales acerca del juego. 

Se publicarán tres trailers del juego, uno siendo un trailer-gameplay y adicionalmente se publicará un tráiler por cada personaje explorando al mismo.

El objetivo de la campaña es llegar al máximo de personas posibles en el periodo de tiempo que dure la campaña.

# 7. Arquitectura de Red y Multijugador

A partir de la Fase 3, el proyecto ha evolucionado de un prototipo local a un videojuego multijugador en red completo. Se ha implementado una arquitectura Cliente-Servidor utilizando Node.js que gestiona tanto la persistencia de datos como la sincronización en tiempo real.

### 7.1 API REST 
Para la gestión de usuarios y sesiones, se ha desarrollado una API RESTFUL

* **Funcionalidad:** Permite el registro de usuarios (Nickname), monitorización de conexiones activas (Keep-Alive) y persistencia de estadísticas (Poni Favorito).
* **Protocolo:** Con el uso de verbos GET, POST, PUT, DELETE.
* **Estado:** El servidor mantiene un registro en memoria de los usuarios y detecta desconexiones mediante un sistema de polling cada 2 segundos.

>**Documentación Técnica Completa:**  Para consultar la tabla de endpoints, códigos de respuesta y diagramas de flujo de registro, ver:  
> [🔗 Documentación API REST](./Documentación%20API.md)

### 7.2 WebSockets

Para la jugabilidad principal (carreras), se ha implementado un sistema de comunicación bidireccional mediante WebSockets.

* **Funcionalidad:** Gestión de lobbys, lobbys privadas, matchmaking automático y sincronización de la carrera.
* **Sincronización:** Se utiliza un modelo de servidor Relay que sincroniza la semilla del mapa (para asegurar obstáculos idénticos) y retransmite posiciones y eventos (ataques, saltos).
* **Compensación de Lag:** El cliente implementa interpolación lineal y predicción de movimiento para asegurar la fluidez visual a pesar de la latencia de red.

>**Documentación Técnica Completa:** Para consultar el protocolo de mensajes JSON, gestión de salas y diagramas de secuencia de la partida, ver:  
> [🔗 Documentación WebSockets](./Documentación%20WebSockets.md)
 


