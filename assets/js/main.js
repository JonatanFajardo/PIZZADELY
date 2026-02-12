$('.owl-carousel').owlCarousel({
    loop:true,
    margin:10,
    nav:true,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:3
        },
        1000:{
            items:4
        }
    }
})

// ========== FUNCIONALIDAD FAQ ACCORDION ==========
$(document).ready(function() {
    $('.faq-question').click(function() {
        const faqItem = $(this).parent('.faq-item');

        // Toggle active class
        faqItem.toggleClass('active');

        // Close other items (opcional - descomenta para accordion único)
        // $('.faq-item').not(faqItem).removeClass('active');
    });
});

// ========== FUNCIONALIDAD FORMULARIO DE CONTACTO ==========
$(document).ready(function() {
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();

        // Obtener valores del formulario
        const formData = {
            name: $('#contactName').val(),
            email: $('#contactEmail').val(),
            phone: $('#contactPhone').val(),
            subject: $('#contactSubject').val(),
            message: $('#contactMessage').val()
        };

        // Validación básica
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            alert('Por favor, completa todos los campos obligatorios.');
            return;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Por favor, ingresa un correo electrónico válido.');
            return;
        }

        // Simular envío del formulario (en producción, aquí harías una llamada AJAX a tu servidor)
        console.log('Datos del formulario:', formData);

        // Ocultar formulario y mostrar mensaje de éxito
        $('#contactForm').slideUp(300, function() {
            $('#formSuccessMessage').fadeIn(500);
        });

        // Resetear formulario después de 3 segundos
        setTimeout(function() {
            $('#contactForm')[0].reset();
            $('#formSuccessMessage').fadeOut(500, function() {
                $('#contactForm').slideDown(300);
            });
        }, 3000);
    });

    // Animación suave para los campos del formulario al hacer focus
    $('.form-group-contact input, .form-group-contact select, .form-group-contact textarea').on('focus', function() {
        $(this).parent().addClass('focused');
    }).on('blur', function() {
        if (!$(this).val()) {
            $(this).parent().removeClass('focused');
        }
    });
});