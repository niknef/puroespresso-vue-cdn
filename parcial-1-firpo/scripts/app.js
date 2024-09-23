const app = Vue.createApp({
  data: function () {
    return {
      titulo: "PuroEspresso",
      
    };
    
  },
  
});

app.component("form-component", {
  data: function() {
    const localData = localStorage.getItem("local");

    return {
        
    form: {
        nombre: "",
        apellido: "",
        email: "",
        subscription: "",
        preferenciasCafe: "",
        notas: "",
    },
    errores: [],
    arr: localData ? JSON.parse(localData) : [], // Inicializar arr directamente desde localStorage
    enviado: false,
    peligro: false,
    alerta: "¡Gracias por suscribirte!",
        
        
    };
},
  template: `
  <div class="container my-5 ">
  <div class="card shadow-sm p-4 bg-light-coffee" :class="peligro ? 'borde-rojo' : 'borde-marron'">
    <h2 class="text-center mb-4" id="suscribite">Formulario de Suscripción</h2>
    <form @submit.prevent="guardar" novalidate>
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="nombre" class="form-label fw-bold">Nombre</label>
          <input type="text" class="form-control" id="nombre" v-model="form.nombre" placeholder="Nombre" />
        </div>
        <div class="col-md-6">
          <label for="apellido" class="form-label fw-bold">Apellido</label>
          <input type="text" class="form-control" id="apellido" v-model="form.apellido" placeholder="Apellido" />
        </div>
      </div>
      
      <div class="mb-3">
        <label for="email" class="form-label fw-bold">Email</label>
        <input type="email" class="form-control" id="email" v-model="form.email" />
        <div class="form-text">Nunca compartiremos tu email con nadie más.</div>
      </div>
      <div class="row mb-3">
      <!-- Opciones de Suscripción -->
      <div class="col-md-6">
        <label class="form-label fw-bold">Opciones de Suscripción</label>
        <div class="form-check">
          <input type="radio" class="form-check-input" id="starterPack" value="starter" v-model="form.subscription" />
          <label class="form-check-label fw-bold" for="starterPack">Starter Pack</label>
        </div>
        <div class="form-check">
          <input type="radio" class="form-check-input" id="premiumPack" value="premium" v-model="form.subscription" />
          <label class="form-check-label fw-bold" for="premiumPack">Premium Pack</label>
        </div>
      </div>

      <!-- Preferencias de Café -->
      <div class="col-md-6">
        <label for="preferenciasCafe" class="form-label fw-bold">Preferencias de Café</label>
        <select class="form-select" id="preferenciasCafe" v-model="form.preferenciasCafe">
          <option disabled selected>Selecciona una opción</option>
          <option value="suave">Suave</option>
          <option value="medio">Medio</option>
          <option value="intenso">Intenso</option>
        </select>
      </div>
    </div>
      
      <div class="mb-3">
        <label for="notas" class="form-label fw-bold">Notas Adicionales</label>
        <textarea class="form-control" id="notas" v-model="form.notas" rows="3"></textarea>
      </div>
      
      <div class="text-center">
        <button type="submit" class="btn btn-dark">Suscribirse</button>
      </div>
    </form>
    <div v-if="enviado && errores.length > 0" class="text-danger">
        <ul>
          <li v-for="error in errores">{{ error }}</li>
        </ul>
    </div>
  </div>
  
</div>
<divider-component></divider-component>
<template v-if="arr.length > 0">
  <modal-gracias :usuario="arr[arr.length - 1]" :alerta="alerta"></modal-gracias>
</template>
  `,
methods: {
  guardar(form) {
    this.enviado = true;
    this.errores = [];
    this.peligro = true;

      // Validaciones
      
      if (!this.form.nombre) {
          this.errores.push("El nombre es obligatorio.");
      } 
      if (this.form.nombre && this.form.nombre.length < 3) {
          this.errores.push("El nombre debe tener al menos 3 caracteres.");
      }
      if (!this.form.apellido) {
          this.errores.push("El apellido es obligatorio.");
      }
      if (!this.form.email) {
          this.errores.push("El email es obligatorio.");
      }
      if (!this.form.subscription) {
          this.errores.push("Debes elegir una opción de suscripción.");
      }
      if (!this.form.preferenciasCafe) {
          this.errores.push("Selecciona tus preferencias de café.");
      }
      

      if (this.errores.length === 0) {
        var localData = localStorage.getItem("local");
        this.arr = localData ? JSON.parse(localData) : [];
        this.peligro = false;
        
        this.arr.push({
          nombre: this.form.nombre,
          apellido: this.form.apellido,
          email: this.form.email,
          subscription: this.form.subscription,
          preferenciasCafe: this.form.preferenciasCafe,
          notas: this.form.notas,
        });

        localStorage.setItem("local", JSON.stringify(this.arr));

        // Limpio el formulario
        this.form = {
          nombre: "",
          apellido: "",
          email: "",
          subscription: "",
          preferenciasCafe: "",
          notas: "",
        };
      }
    }
  }
});

app.component('modal-gracias', {
  props: ["usuario", "alerta"],
  template: `
      <div class="container my-5 text-center">
        <div class="bienvenido mx-auto my-2"></div>
        <h2 class="fw-bold text-light-coffee">Bienvenido/a {{ toCapitalized(usuario.nombre) }}</h2>
        <h3 class="fw-bold text-light-coffee">{{ alerta }}</h3>
        <h4 class="fw-bold text-light-coffee">Pack {{ toCapitalized(usuario.subscription) }}</h4>
        <p class="fw-regular text-light-coffee">Recibirás un correo de confirmación al mail: <span class="fw-light">{{ usuario.email }}</span></p>
        <p v-if="usuario.notas" class="fw-regular text-light-coffee">Notas adicionales: <span class="fw-light fst-italic">"{{ usuario.notas }}"</span></p>
        <p class="fw-regular text-light-coffee">¡Gracias por formar parte de nuestra comunidad de amantes del café! En nuestra página encontrarás una recomendación especial para ti.</p>
      </div>
      <coffees-component :preferencia="usuario.preferenciasCafe"></coffees-component>
  `,
  methods: {
    toCapitalized(text) {
      if (!text) return '';
      text = text.toLowerCase();
      return text.charAt(0).toUpperCase() + text.slice(1);
    }
  }
});

app.component("coffees-component", {
  data: function () {
    return {
      coffees: [
        {
          name: "Café Colombiano",
          nacionalidad: "Colombia",
          img: "./img/cafe-colombiano.png",
          intensidad: "Medio",
          descripcion:
            "Un café suave con una acidez balanceada y notas de frutas tropicales. Es conocido por su consistencia y sabor excepcional.",
        },
        {
          name: "Café Etíope Yirgacheffe",
          nacionalidad: "Etiopía",
          img: "./img/cafe-ethiopia.png",
          intensidad: "Suave",
          descripcion:
            "Este café ofrece un perfil de sabor floral con toques de cítricos y té. Es apreciado por su complejidad y elegancia.",
        },
        {
          name: "Café Brasileño Santos",
          nacionalidad: "Brasil",
          img: "./img/cafe-brasilero.png",
          intensidad: "Medio",
          descripcion:
            "Un café con cuerpo y notas de chocolate y nueces. Es uno de los cafés más populares debido a su suavidad y dulzura natural.",
        },
        {
          name: "Café Keniano AA",
          nacionalidad: "Kenia",
          img: "./img/cafe-kenia.png",
          intensidad: "Intenso",
          descripcion:
            "Con una acidez vibrante y sabores de frutas rojas y vino, este café es potente y complejo, ideal para quienes buscan una experiencia intensa.",
        },
        {
          name: "Café de Sumatra Mandheling",
          nacionalidad: "Indonesia",
          img: "./img/cafe-sumatra.png",
          intensidad: "Intenso",
          descripcion:
            "Con cuerpo pesado y bajo nivel de acidez, este café tiene sabores terrosos y de especias, perfecto para quienes prefieren un perfil más robusto.",
        },
        {
          name: "Café de Costa Rica Tarrazú",
          nacionalidad: "Costa Rica",
          img: "./img/cafe-costarica.png",
          intensidad: "Suave",
          descripcion:
            "Un café limpio y brillante con acidez viva y notas de cítricos y cacao. Es muy equilibrado y agradable para cualquier momento del día.",
        },
      ],
      
    };
  },
  props: ['preferencia'],
  template: `
    <div class="container">
      <div class="text-center">
        <h2 class="display-4 fw-bold text-brown-light my-3">Nuestras Recomendaciones</h2>
      </div>
      <div class="text-center mb-4">
        <p v-if="preferencia == 'suave' " class="lead text-light-coffee">Si te gustan los cafés suaves y amigables, estas son las recomendaciones de nuestros baristas.</p>
        <p v-else-if="preferencia == 'medio' " class="lead text-light-coffee">Si prefieres un equilibrio perfecto entre suavidad y carácter, nuestros baristas recomiendan estos cafés de intensidad media.</p>
        <p v-else class="lead text-light-coffee">Si disfrutas de un café con cuerpo y sabor intenso, estas son las recomendaciones de nuestros baristas para ti.</p>
      </div>
      <div class="row row-cols-1 row-cols-md-2 g-4" id="opciones">
        <div v-for="(coffee, index) in filtrarCafes()" :key="index" class="col">
          <div class="card h-100 text-center rounded overflow-hidden">
            <div class="card-body">
              <h2 class="card-title display-5 fs-2">{{ coffee.name }}</h2>
              <p class="lead fw-bold">{{ coffee.nacionalidad }}</p>
              <p class="lead">{{ coffee.descripcion }}</p>
            </div>
            <div class="bg-body shadow-sm mx-auto">
              <img :src="coffee.img" :alt="coffee.name" class="img-fluid drop-shadow" width="300px">
            </div>
          </div>
        </div>
      </div>
    </div>
    `,
    methods: {
      filtrarCafes() {
        return this.coffees.filter(coffee => {
          return coffee.intensidad.toLowerCase() === this.preferencia.toLowerCase();
        });
      }
    },
});

app.component("navbar-component", {
  template: `
    <nav class="navbar navbar-expand-lg bg-light-coffee rounded m-3">
        <div class="container-fluid">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample11" aria-controls="navbarsExample11" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
        <div class="collapse navbar-collapse d-lg-flex" id="navbarsExample11">
            <a class="navbar-brand col-lg-3 me-0" href="#">
                <img src="./img/logo-puroespresso.png" alt="PureEspresso" width="200">
                <h1 class="visually-hidden" v-once>PureEspresso</h1>
            </a>
            
            <ul class="navbar-nav col-lg-6 justify-content-lg-center">
                <li class="nav-item">
                    <a class="nav-link fw-medium active text-brown" aria-current="page" href="#">Home</a>
                </li>
                
                <li class="nav-item">
                    <a class="nav-link fw-medium text-brown" href="#opciones">Opciones</a>
                </li>
                
                <li class="nav-item">
                    <a class="nav-link fw-medium text-brown" href="#nosotros">Nosotros</a>
                </li>
            </ul>
            
            <div class="d-lg-flex col-lg-3 justify-content-lg-end">
                <a class="btn btn-brown fw-medium" href="#suscribite" >Suscríbete</a>
            </div>
        </div>
        </div>
    </nav>
    `,
});

app.component("banner-component", {
  template: `
    <div class="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center rounded bg-body-tertiary" id="fondo-cafe">
        <div class="col-md-6 p-lg-5 mx-auto my-5 w-75">
            <h2 class="display-4 fw-bold">Para los Amantes del Café que Buscan lo Mejor en Cada Taza.</h2>
            <h3 class="fw-normal text-muted mb-3">Descubre el Placer de Degustar Cafés Únicos y Encuentra tu Favorito.</h3>
            <div class="d-flex gap-3 justify-content-center lead">
                <a class="btn btn-brown fw-medium" href="#suscribite">Suscríbete ahora!</a>
            </div>
        </div>
    </div>
    <divider-component></divider-component>
    `,
});

app.component("packs-component", {
  data: function () {
    return {
      packs: [
        {
          name: "Starter Pack",
          price: "$3usd",
          items: [
            "3 variantes de café",
            "Guía de cata básica",
            "Tutoriales online",
            "Newsletter Comunidad",
            "Receta con café",
          ],
          imageUrl: "./img/starterpack.png",
          imageAlt: "Ilustración del pack starter",
        },
        {
          name: "Premium Pack",
          price: "$5usd",
          items: [
            "5 variantes de café",
            "Guía de cata avanzada",
            "Tutoriales online + Newsletter",
            "Descuentos exclusivos",
            "Regalo adicional",
          ],
          imageUrl: "./img/premiumpack.png",
          imageAlt: "Ilustración del pack premium",
        },
      ],
    };
  },

  template: `
    <div class="container my-5">
        <div class="pricing-header p-3 pb-md-4 mx-auto text-center">
            <h2 class="display-4 fw-bold text-light-coffee" id="opciones">Nuestros Packs</h2>
            <p class="fs-5 text-light fw-light">Descubre una experiencia única con nuestra selección de packs de café. Cada mes, te traemos una cuidada combinación de los mejores granos, accesorios esenciales y consejos para que disfrutes de tu café como nunca antes.</p>
        </div>
        
        <div class="row justify-content-center text-center">
            <div class="col-md-4" v-for="(pack, index) in packs" :key="index">
                <div class="card mb-4 rounded-3 shadow-sm">
                    <div class="card-header py-3">
                        <h3 class="my-0 fw-bold">{{ pack.name }}</h3>
                    </div>
                    <div class="card-body">
                        <h4 class="card-title pricing-card-title fw-bold">{{ pack.price }}<small class="text-body-secondary fw-light">/mo</small></h4>
                        
                        <img :src="pack.imageUrl" :alt="pack.imageAlt" class="img-fluid drop-shadow" width="300px">
                        
                        <ul class="list-unstyled mt-3 mb-4">
                            <li v-for="item in pack.items" :key="item" class="fw-regular text-start"><i class="bi bi-arrow-right-short ms-3 me-2"></i>{{ item }}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <divider-component></divider-component>
    `,
});

app.component("nosotros-component", {
  template: `
      <div class="my-1" id="nosotros">
        <div class="p-4 text-center bg-body-dark text-light">
          <div class="container py-1">
            <h2 class="fw-bold text-brown-light">¿Porqué suscribirse?</h2>
            <p class="col-lg-10 mx-auto lead mt-5 text-start">
              <span class="fw-bold text-brown-light">Descubre el Café de tus Sueños:</span> 
              Con nuestra suscripción, cada mes recibirás una selección curada de cafés de especialidad de las mejores regiones del mundo. Perfecto para explorar nuevos sabores y encontrar tu mezcla ideal.
            </p>
            <p class="col-lg-10 mx-auto lead mt-2 text-start">
              <span class="fw-bold text-brown-light">Calidad y Variedad:</span> 
              Disfruta de granos frescos y cuidadosamente seleccionados, que ofrecen una experiencia de cata única en cada entrega. Desde orígenes únicos hasta blends exclusivos, siempre hay algo nuevo para saborear.
            </p>
            <p class="col-lg-10 mx-auto lead mt-2 text-start">
              <span class="fw-bold text-brown-light">Comodidad a tu Puerta:</span> 
              Olvídate de buscar el café perfecto. Nosotros lo hacemos por ti y lo entregamos directamente en la comodidad de tu hogar.
            </p>
            <p class="col-lg-10 mx-auto lead mt-2 text-start">
              <span class="fw-bold text-brown-light">Acceso Exclusivo:</span> 
              Como suscriptor, tendrás acceso a cafés raros y ediciones limitadas que no encontrarás en ningún otro lugar.
            </p>
            <p class="col-lg-10 mx-auto lead mt-2 text-start">
              <span class="fw-bold text-brown-light">Aprende y Disfruta:</span> 
              Nuestra guía de cata te acompaña en cada paso, ayudándote a descubrir los matices y perfiles de sabor de cada variedad, convirtiendo cada taza en una experiencia educativa y deliciosa.
            </p>
          </div>
        </div>
      </div>
    `,
});

app.component("products-component", {
  data: function () {
    return {
      products: [
        {
          name: "Cafetera Italiana",
          description:
            "Diseñada para capturar la esencia del espresso auténtico. Fácil de usar y elegante en su diseño, perfecta para los amantes del café, esta clásica cafetera de aluminio ofrece una experiencia de café robusta y rica, que despierta tus sentidos con cada sorbo.",
          imageUrl: "./img/cafetera-italiana.jpg",
          imageAlt: "Cafetera Italiana",
        },
        {
          name: "Prensa Francesa",
          description:
            "Prepara un café suave y rico en matices. Diseñada para resaltar los sabores naturales de los granos, esta elegante prensa no solo es perfecta para hacer café, sino que también se convierte en tu herramienta esencial para espumar la leche.",
          imageUrl: "./img/prensa-fransesa.jpg",
          imageAlt: "Prensa Francesa de vidrio",
        },
        {
          name: "Molinillo de Café",
          description:
            "Descubre la clave para un café excepcional con nuestro molinillo de café, diseñado para liberar todo el potencial de los granos frescos. Ajustable y preciso, permite moler tus granos a la perfección, desde un molido fino hasta uno grueso.",
          imageUrl: "./img/molinillo-profesional.jpg",
          imageAlt: "Molinillo profesional para granos de café",
        },
      ],
    };
  },
  template: `
        <div class="album py-1 bg-dark text-center">
            <div class="container">
            <h2  class="fw-bold text-brown-light mb-4">Proximos Productos</h2>
                <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 mb-5">
                <div class="col" v-for="(product, index) in products" :key="index">
                <div class="card shadow-sm">
                    <img :src="product.imageUrl" :alt="product.imageAlt" class="rounded-top">
                    <div class="card-body bg-light-coffee">
                        <p class="card-text fw-regular text-dark">
                            <span class="text-brown">{{ product.name }}</span>, {{ product.description }}
                        </p>
                    </div>
                </div>
                </div>
                </div>
            </div>
        </div>
        <divider-component></divider-component>
    `,
});

app.component("divider-component", {
  template: `
        <div class="b-example-divider"></div>
    `,
});

app.component("footer-component", {
  template: `
    <footer class="container row justify-content-between align-items-center py-3 my-4 mx-auto border-top">
        <p class="col-md-4 mb-0 text-light">&copy; 2024 Davinci - Nicolás Firpo</p>
    
        <ul class="nav col-md-4 justify-content-end">
            <li class="nav-item"><a href="#" class="nav-link px-2 text-light">Home</a></li>
            <li class="nav-item"><a href="#opciones" class="nav-link px-2 text-light">Opciones</a></li>
            <li class="nav-item"><a href="#nosotros" class="nav-link px-2 text-light">Nosotros</a></li>
        </ul>
    </footer>
`,
});


// Montamos la app
app.mount(".app");
