// Variable Globales
$AnimationTime = 800;
$CounterPagination = 0;
$AllFilter = [];
$grid = $('.grid'); 
$cdn = "https://cdn.statically.io/img/lucasarts.fr/";
$options = "w=376,f=jpeg";
$optionsLarge = "w=1920,f=jpeg";
$folder = "assets/media/img/galerie/";
$timerStart = Date.now();
$DarkButton = "";
$DarkMode = true;
// Local Storage & Affichage dans la console.
if (localStorage.getItem("DarkMode") == "false"){	
	$DarkButton = "dark-btn";
	setTimeout(console.log.bind(console,"%cChargement du mode : "+"%c Clair",'color: #333333;font-size:11px;font-family: "Google", sans-serif;','color: green;font-size:11px;font-family: "Google", sans-serif;'),0);
	DarkMode();
}
else{localStorage.setItem('DarkMode', $DarkMode);}
console.group('Données site');
setTimeout(console.log.bind(console,"%cTemps de chargement DOM : "+"%c"+(Date.now()-$timerStart)+" ms",'color: #333333;font-size:11px;font-family: "Google", sans-serif;','color: green;font-size:11px;font-family: "Google", sans-serif;'),0);
 
// Chargement dynamique de la galerie
function ajax1(){
	return $.ajax({
		url : $folder,
		async:false,
		success: function (data) {
			$(data).find("a").attr("href", function (i, val) {
				if( val.match(/\.(jpe?g|png|gif)$/) ) { 
					var $items = ( '\
						<div class="grid-item masonry-item masonry-apear transition" id="'+val.split('/').pop().split('-')[0]+'.jpg">\
						<img class="masonry-content" width="600px" height="auto" id="img'+val.split('/').pop().split('-')[0]+'"  src="'+$cdn+$options+'/dev/Gumlet/'+ $folder + val +'">\
						<img class="user" width="18px" height="18px" alt="Lucas Pires" src="https://cdn.statically.io/img/lucasarts.fr/w=18,f=jpeg/dev/Gumlet/assets/media/img/theme/user.jpg"> \
						</div>' );
					$(".grid").prepend($items); 
					console.log.bind(console, "%cTemps de chargement DOM : "+"%c"+(Date.now()-$timerStart)+" ms",'color: #333333;font-size:15px;font-family: "Google", sans-serif;','color: green;font-size:15px;font-family: "Google", sans-serif;');
				} 
			});    
		},
		error: function(){setTimeout(function(){
				$('.container-masonry').append("<span class='error'> Oups.<br><b>Il y a une erreur.</b></span>")
				$('.error').fadeIn().css({'display':'block'})
				$('.logo').css({'opacity':'1'})
			},$AnimationTime);
		}
	});	
}

// Après chargement Ajax
$.when(ajax1()).done(function(a1){
    setTimeout(console.log.bind(console,"%cTemps de chargement Ajax : "+"%c"+(Date.now()-$timerStart)+" ms",'color: #333333;font-size:11px;font-family: "Google", sans-serif;','color: green;font-size:11px;font-family: "Google", sans-serif;'),0)
});

// Au chargement de la page 
$(window).on('load', function(){ 
	setTimeout(console.log.bind(console,"%cTemps de chargement Page : "+"%c"+(Date.now()-$timerStart)+" ms",'color: #333333;font-size:11px;font-family: "Google", sans-serif;','color: green;font-size:11px;font-family: "Google", sans-serif;'),0)
		// Chargement des images puis création Isotope
        $('.container-masonry').imagesLoaded( function() {

        	// On construit la grille isotope
			$grid.isotope({
	          itemSelector : '.grid-item',
	          layoutMode : 'masonry',
	          percentPosition: true,
	          stagger: 5,	
	          transitionDuration: 400,
	          masonry: {
	            columnWidth: '.grid-sizer',
	            gutter: '.gutter-sizer',
	          }
	        });

	        // Random les éléments
	        $('.shuffle-button').on( 'click', function() {
			  $grid.isotope('shuffle');
			});

			// Filtrer les éléments
			$('.filter-button-group').on( 'click', 'a', function() {
	          	$('.activefilter').removeClass('activefilter')
	          	$(this).addClass('activefilter')           
	          	var filterValue = $(this).attr('data-filter');
	          	$grid.isotope({ filter: filterValue });
	     	});	
        	
        	// Lecture des Informations
			$(".masonry-content").each(function(i,e) {
				var fullPath = decodeURIComponent(this.src.split("/").pop().replace('.jpg', ''));
				var NumberEl = fullPath.split("-")[0];
				var Title = fullPath.split("-")[1];
				var Filter = fullPath.split("-")[2].split(',');
				var Model = fullPath.split("-")[3];

				$AllFilter = $.merge($AllFilter,Filter).filter(function(elem, index, self){return index === self.indexOf(elem);});
				$(e).parent().addClass(Filter);
				$(e).attr('alt', Title);		
				if(Title == null) Title = "-";
				if(Model == null) Model = "-";
				if(Model == "A7II" || Model == "ILCE-7M2" || Model == "a7ii"){$(e).parent().append('<img class="model" alt="Shot On A7II" height="auto" width="50px" src="https://cdn.statically.io/img/lucasarts.fr/w=50,f=png/dev/Gumlet/assets/media/img/theme/a7iiw.png">')};				
				});	
			    
			});
       
		// Animation Load
		$LogoPos = $('.logo')[0].getBoundingClientRect();
		$('.logo').clone().addClass('CloneLogo').appendTo('.header').delay(2200).queue(function(next){ 
			$('.CloneLogo').css({
				'top':$LogoPos.top+'px',
				'transform':'translate(-50%,0%)',
			});

		next()}).delay($AnimationTime).queue(function(next){ 
			$('.logo').css({'opacity':'1'});
			$('.CloneLogo').remove();			
			$('.quote').animate({opacity:1},0);		
			$('.block-img').animate({opacity:1},0);	
			$(".masonry-item").each(function(i,e) {
				$(this).delay((i+1)*50).animate({opacity:1},0);   
			}); 

			console.group("Filtres");			
			setTimeout(console.log.bind(console,"%cNombre de Filtres : "+"%c"+$AllFilter.length+"",'color: #333333;font-size:11px;font-family: "Google", sans-serif;','color: #ed1b24;font-size:11px;font-family: "Google", sans-serif;'),0);	

			// Création des filtres
			$.each($AllFilter, function(index, value) {
			  $('.filter-button-group').append('\
			  	 <a class="button '+$DarkButton+'" data-filter=".'+value+'">'+value+'</a>')	
			  	 setTimeout(console.log.bind(console,"%cNombre d'éléments listés en "+value+" : "+"%c"+$('.'+value).length+"",'color: #333333;font-size:11px;font-family: "Google", sans-serif;','color: #ed1b24;font-size:11px;font-family: "Google", sans-serif;'),0)  
			});		
			
			// Affichage du Copyright			
			$('.noscroll').removeClass('noscroll');
			$('.footer').fadeIn().css("display","block");
			$('.button').animate({opacity:1},0);
			setTimeout(function(){$('.masonry-apear').removeClass('masonry-apear transition');
				console.groupEnd();
				console.group("Chargement Photos")
			},1000);			

		next()})
});

// Transition
function Transition(){
	if($('.pagination')){$('.pagination').remove()}
	$('body').append("<div class='pagination "+$DarkMode+"'></div>")
	// Conditions ouverture/Fermeture
	if($CounterPagination % 2 === 0){
		$('html').addClass('noscroll')
		$('.photo-expanded').delay(1200).fadeIn(100)
	}
	else{
		$('html').removeClass('noscroll')
		$('.photo-expanded').delay(1200).fadeOut(100)
	}
	$CounterPagination++;
}

// Page Transition
$('.close').on('click',function(){Transition()});
// Pas de mémorisation du scroll
if ('scrollRestoration' in history) {history.scrollRestoration = 'manual';}
// Changement de page
$('.block-img').on('click', function(){
	$('.toswitch').show().animate({opacity:1},0);	
	$('.block-img-small').removeClass('block-img-small').delay($AnimationTime).queue(function(next){ 
		location.href='about/';
	next()})
})

// Agrandissement des images
$('body').on('click','.masonry-item', function(){
	$('.close').fadeIn();	
	Transition();
	$('#image').css({
		"background":"url('"+$(this).find(".masonry-content").attr('src')+"')"
	})
	var LoadImage = new Image();
	var LoadImageTime = Date.now();	
	LoadImage.src = $cdn+$optionsLarge+"/dev/Gumlet/assets/media/img/gallery/"+this.id;
	LoadImage.onload = function(){
		$('#image').css({"background":"url('"+LoadImage.src+"')"});
		setTimeout(console.log.bind(console,"%cTemps de chargement Image "+this.id+" : "+"%c"+(Date.now()-LoadImageTime)+" ms",'color: #333333;font-size:11px;font-family: "Google", sans-serif;','color: green;font-size:11px;font-family: "Google", sans-serif;'),0)
	}
})

// Mode Sombre		
function DarkMode(){
	$DarkMode = !$DarkMode;
	$('.dark-bg').toggleClass('light-bg')
	$('.userSide').toggleClass('dark-pulse pulse')
	$('.button,.close').toggleClass('dark-btn')
	$('.logo').toggleClass('logo-light')
	localStorage.setItem('DarkMode', $DarkMode);			
}

// Switch mode Theme Dark / Light en cliquant sur le logo
$('.logo').on('click',function(){
	DarkMode()
})



