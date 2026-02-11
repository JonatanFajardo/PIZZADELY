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