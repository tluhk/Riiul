//Author: Angel Lootus
//Jquery helper functions
//January 2021

$(document).ready(function(){

    $(".owl-carousel").owlCarousel({

       loop:false,
    rewind:true,
       margin:30,
       nav: true,
       navText: ['<i class="fas fa-chevron-left">', '<i class="fas fa-chevron-right">'],
       dots: false,
       responsive: {
           0: {
               items: 1
           },
           400: {
               items: 2
           },
           700: {
               items: 3
           },
           1000: {
               items: 4
           },
           1800:{
               items: 6
           },
           2000: {
               items: 8
           }

       }
    });

     $('#mixcontent').mixItUp({
    animation: {
        effects: 'fade translateX(50%)',
        reverseOut: true,
        duration: 1000
    },
    load: {
        filter: 'all'
    }
});

});