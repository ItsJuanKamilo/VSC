Informe: Desarrollo Full Stack de Aplicación - Prueba Técnica
Objetivo:
 El objetivo de este proyecto fue desarrollar un prototipo funcional de una aplicación que conectará a personas que necesitan enviar sobres con personas que tienen motocicletas disponibles para realizar entregas. Para esta prueba técnica, se decidió realizar únicamente la aplicación móvil, ya que se consideró más compleja en su desarrollo, lo que permitía demostrar mejor las capacidades del prototipo.
Tecnologías Utilizadas:
Frontend: React Native, Expo.


Backend: Node.js con Supabase.


Base de Datos: Supabase (PostgreSQL).


Autenticación: bcrypt para la contraseña hasheada.


Desarrollo y Funcionalidad:
Estructura y Registro:


Al inicio de la aplicación, los usuarios deben elegir el rol que desean desempeñar: Transportador o Cliente.


Posteriormente, tienen la opción de registrarse mediante un login si ya están registrados.


Interfaz de Usuario:


Una vez registrado, los usuarios (clientes o transportistas) verán una barra inferior con tres opciones: Inicio, Listado y Perfil. Aunque las opciones son las mismas para ambos roles, cada uno tiene funciones distintas según su rol:


Cliente: Puede crear un pedido de envío que será visible instantáneamente para los transportistas.


Transportista: Puede ver los pedidos disponibles y aceptar aquellos que desea entregar. El transportista tiene la capacidad de aceptar múltiples pedidos.


Funcionalidad de Entrega:


Cuando un transportista decide realizar una entrega, puede presionar la opción En camino, lo que abrirá una ventana de navegación con un mapa integrado. Los botones de Confirmación de entrega y Cancelar también estarán disponibles en esta ventana.


Una vez entregado, el pedido se marca como Entregado en el sistema, y el cliente debe confirmar la recepción del sobre.


Distribución de Ganancias:


La ganancia se divide de forma predeterminada en un 80% para el transportista y 20% para la plataforma, asegurando una compensación adecuada para los transportistas.


Seguridad:


Se implementó bcrypt para el hasheo de contraseñas, lo que garantiza una gestión segura de las credenciales de los usuarios.


Demostración Funcional:
 Todas las funciones realizadas en la aplicación cumplen con los requisitos establecidos y ejecutan correctamente las tareas mencionadas. Se adjunta un video junto a esta entrega que muestra una demostración del prototipo funcional.
Inteligencia Artificial:
 Para mejorar la aplicación, la inteligencia artificial podría ser aplicada en los siguientes aspectos:
Gestión de rutas: Utilizando algoritmos de optimización de rutas para mejorar la eficiencia en las entregas y minimizar los tiempos de desplazamiento.


Recomendación de precios: Un sistema basado en IA podría sugerir precios ajustados en tiempo real dependiendo de variables como la distancia, urgencia o demanda.


Optimización de asignación de envíos: La IA podría optimizar la distribución de solicitudes de entrega entre los transportistas, teniendo en cuenta su ubicación y carga de trabajo.


Escalabilidad:
 Se utilizó React Native junto con Supabase y PostgreSQL para garantizar que la aplicación pueda escalar eficientemente a miles de usuarios, ya que esta tecnología permite un desarrollo multiplataforma (iOS, Android y Web). React Native permite mantener la misma base de código para todas las plataformas, lo que facilita el mantenimiento y escalabilidad de la aplicación en múltiples dispositivos. Además, se eligió PostgreSQL como base de datos debido a su estabilidad y capacidad para manejar grandes volúmenes de datos de forma eficiente.
Conclusión:
 Este proyecto demuestra la capacidad de desarrollar una aplicación funcional y escalable que conecta a clientes y motociclistas para la entrega de sobres. A pesar de ser una versión simplificada, el sistema desarrollado cubre correctamente todas las funcionalidades.
