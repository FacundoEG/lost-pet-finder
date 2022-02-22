LOST PETS APP V.1

Link de acceso a la webapp en Heroku: https://lost-pets-app.herokuapp.com/

Link de la documentación de la API en postman: https://documenter.getpostman.com/view/17261810/UVknsFUT

Webapp creada para el desafío final del modulo 7 de la carrera de programación web fullstack en APXschool.

Dicha app cuenta con 4 objetivos basicos:

1. Poder buscar mascotas perdidas cerca de la ubicación brindada por el usuario.
2. Registrarse dentro de la base de datos, para poder subir mascotas y autenticarse.
3. Reportar nuevas mascotas utilizando una geolocalización, imagen y nombre.
4. Editar, cambiar el estado y despublicar a las mascotas reportadas.

El frontend fue diseñado para poder soportar correctamente los componentes dentro de las resoluciones de Iphone5, Iphone 6, Tablet y Desktop, con la intención de que sea responsivo para la mayor cantidad de pantallas posibles.

La arquitectura web esta basada en pages montadas como custom elements con su shadowDOM propio, usando vaadin como router para redirecciónar.

La escritura del codigo esta basada en funciones declarativas, describiendo al inicio de cada función que logica sucedera, los metodos para el frontend, backend y basics para manejar el state, estan detallados dentro del archivo "state.ts".

Para persistir los datos y poder recargar las paginas, se utilizo el recurso de localStorage, para que cada vez que el usuario cierre el navegador, los datos se pierdan y simule el volver a tener que iniciar, dandole la oportunidad de entrar y crear diferentes salas cuando lo desee.

Cuando el usuario ingrese a la app, podra navegar como invitado o darse de alta en la base de datos, donde se generara un token propio indentificandolo que le permitira validar sus acciones y mantener su sesión iniciada en el dispositivo.

VERSION 1.0: APP DEPLOY Y TESTING
