(function($) {
    "use strict";

    /**
     * Función para gestionar el estado activo de los enlaces de navegación.
     * @param {string} selector - El selector del enlace que debe activarse.
     */
    function setActiveNavLink(selector) {
        const navMenu = $('.nav-menu, .mobile-nav');
        navMenu.find('li.active').removeClass('active');
        navMenu.find(`a[href="${selector}"]`).closest('li').addClass('active');
    }

    /**
     * Función para alternar la navegación móvil.
     */
    function toggleMobileNav() {
        $('body').toggleClass('mobile-nav-active');
        $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
    }

    // 1. Inicialización de Typed.js para el efecto de escritura en el Hero Section
    if ($('.typed').length) {
        let typed_strings = $(".typed").data('typed-items');
        typed_strings = typed_strings.split(',');
        new Typed('.typed', {
            strings: typed_strings,
            loop: true,
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 2000
        });
    }

    // 2. Smooth scroll para la navegación y otros enlaces con la clase .scrollto
    $(document).on('click', '.nav-menu a, .scrollto', function(e) {
        if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
            const target = $(this.hash);
            if (target.length) {
                e.preventDefault();
                const scrollto = target.offset().top;

                $('html, body').animate({
                    scrollTop: scrollto
                }, 1500, 'easeInOutExpo');

                if ($(this).parents('.nav-menu, .mobile-nav').length) {
                    setActiveNavLink(this.hash);
                }

                if ($('body').hasClass('mobile-nav-active')) {
                    toggleMobileNav();
                }
                return false;
            }
        }
    });

    // 3. Activar el estado de navegación al cargar la página con un hash en la URL
    $(document).ready(function() {
        if (window.location.hash) {
            const initial_nav = window.location.hash;
            if ($(initial_nav).length) {
                setActiveNavLink(initial_nav);
            }
        }
    });

    // 4. Toggle para la navegación móvil
    $(document).on('click', '.mobile-nav-toggle', function(e) {
        toggleMobileNav();
    });

    // 5. Cerrar el menú móvil al hacer clic fuera de él
    $(document).on('click', function(e) {
        const container = $(".mobile-nav, .mobile-nav-toggle");
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            if ($('body').hasClass('mobile-nav-active')) {
                toggleMobileNav();
            }
        }
    });

    // 6. Evento de scroll unificado para varias funcionalidades
    $(window).on('scroll', function() {
        const cur_pos = $(this).scrollTop();
        const back_to_top = $('.back-to-top');

        // Lógica para el botón "back-to-top"
        (cur_pos > 100) ? back_to_top.fadeIn('slow'): back_to_top.fadeOut('slow');

        // Lógica para el estado activo de la navegación
        const nav_sections = $('section');
        nav_sections.each(function() {
            const top = $(this).offset().top - 200; //-200px de offset para activar antes
            const bottom = top + $(this).outerHeight();
            if (cur_pos >= top && cur_pos <= bottom) {
                setActiveNavLink('#' + $(this).attr('id'));
            }
        });
    });

    // 7. Funcionalidad del botón "Back to top"
    $('.back-to-top').click(function() {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });

    // 8. Inicialización de plugins cuando la página ha cargado
    $(window).on('load', function() {
        // Inicialización de Isotope para el filtro del portafolio
        const portfolioIsotope = $('.portfolio-container').isotope({
            itemSelector: '.portfolio-item',
            layoutMode: 'fitRows'
        });

        $('#portfolio-flters li').on('click', function() {
            $("#portfolio-flters li").removeClass('filter-active');
            $(this).addClass('filter-active');
            portfolioIsotope.isotope({ filter: $(this).data('filter') });
        });

        // Inicialización de Venobox (lightbox)
        $('.venobox').venobox();
        
        // Inicialización de AOS (Animate On Scroll)
        AOS.init({
            duration: 1000,
            easing: "ease-in-out-back"
        });
    });
    
    // 9. Inicialización de otros plugins que no dependen de la carga de imágenes
    // jQuery counterUp
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 1000
    });

    // Animación de barras de Skills al hacer scroll
    $('.skills-content').waypoint(function() {
        $('.progress .progress-bar').each(function() {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {
        offset: '80%'
    });

    // Carrusel de Testimonios (Owl Carousel)
    $(".testimonials-carousel").owlCarousel({
        autoplay: true,
        dots: true,
        loop: true,
        responsive: { 0: { items: 1 }, 768: { items: 2 }, 900: { items: 3 } }
    });

    // Carrusel de Detalles del Portafolio
    $(".portfolio-details-carousel").owlCarousel({
        autoplay: true,
        dots: true,
        loop: true,
        items: 1
    });

})(jQuery);