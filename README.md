# SIGIVENT - Gestión de Inventario

Sistema de Gestión de Inventario.

## Ejecución - Local (Docker)

### **Prerrequisitos**

Instala el software necesario según tu sistema operativo.

* **Para Windows y macOS:**
    * Necesitas **Docker Desktop**. Este paquete incluye todo lo necesario: el motor de Docker, la línea de comandos (CLI) y Docker Compose.
    * **[Descargar Docker Desktop](https://www.docker.com/products/docker-desktop/)**

* **Para Linux:**
    * El proceso consta de dos pasos:
        1.  **Instalar Docker Engine:** Sigue la guía oficial para tu distribución de Linux.
            * **[Instrucciones para instalar Docker Engine](https://docs.docker.com/engine/install/)**
        2.  **Instalar el Plugin de Docker Compose:** Después de instalar el motor, añade el plugin de Compose.
            * **[Instrucciones para instalar Docker Compose](https://docs.docker.com/compose/install/linux/)**

---

### **Instalación**

1.  **Clona el repositorio** desde GitHub:
    ```bash
    git clone https://github.com/YLlampi/sigivent.git
    ```

2.  **Navega al directorio** del proyecto:
    ```bash
    cd sigivent
    ```

3.  **Levanta los servicios** con Docker Compose. Este comando construirá la imagen y creará los contenedores.
    ```bash
    docker-compose up --build
    ```

4.  **Crea los archivos de migración**
    ```bash
    docker-compose exec web python manage.py makemigrations
    ```

5.  **Aplica las migraciones** para preparar o actualizar la base de datos.
    ```bash
    docker-compose exec web python manage.py migrate
    ```

6.  **(Opcional) Crea un superusuario** para acceder al panel de administración de Django:
    ```bash
    docker-compose exec web python manage.py createsuperuser
    ```

---

### **Acceso a la Aplicación**

Una vez que los contenedores estén en funcionamiento, podrás acceder a la aplicación en tu navegador:

* **Aplicación Web:** [http://localhost:8000](http://localhost:8000)
* **Admin de Django:** [http://localhost:8000/admin](http://localhost:8000/admin)

---

### **Comandos Útiles**

* **Detener la aplicación:**
    ```bash
    docker-compose down
    ```
* **Ver los logs (registros) en tiempo real:**
    ```bash
    docker-compose logs -f web
    ```
* **Ejecutar cualquier comando de `manage.py`:**
    ```bash
    # Ejemplo con makemigrations y migrate
    docker-compose exec web python manage.py makemigrations
    docker-compose exec web python manage.py migrate
    ```