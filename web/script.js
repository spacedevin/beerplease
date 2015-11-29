

var App = {};
App.setBeers = function(count) {
	var old;
	App.removeBeers(count);
	for (x=2; x<=count; x++) {
		App.addBeer(x);
	}
};

App.addBeer = function(count) {
	var old = $('.beers .beer[data-beer-item="'+count+'"]');

	if (old.length) {
		old.stop();
		newBeer = old;

	} else {
		var newBeer = $('<div class="beer" data-beer-item="'+count+'"></div>').css({
			'margin-top': '-500px',
			'margin-left': '500px',
			'z-index': 500 - count,
			'opacity': 0
		});
		$('.beers').append(newBeer);
	}

	newBeer
		.animate({
		'margin-top': (count * 15) + 'px',
		'margin-left': (count * 15) + 'px',
		'opacity': 1 - (count * .08),
	}, {
		duration: 2000,
		easing: 'easeOutElastic'
	});
};


App.removeBeers = function(count) {
	$('.beers .beer').each(function() {
		if ($(this).attr('data-beer-item') > count) {
			$(this).stop().fadeOut(100,function() { $(this).remove(); });
		}
	});
};

angular.module('BeerPlease', [])
	.config(function($locationProvider){
	$locationProvider.html5Mode(true);
}).run(function($rootScope, $location) {

	var handler = StripeCheckout.configure({
		key: 'pk_gdm1KopKOp3F90WmR4wcup8zmArrp',
		image: 'https://s3.amazonaws.com/stripe-uploads/QnXaUCtPgcpPDVH1t8fvjoiClYarMyLKmerchant-icon-1436117912995-10547031_685890424836814_2055180330_n-128.png',
		locale: 'auto',
		token: function(token) {
			console.log(token);
		}
	});

	$rootScope.pay = function(e) {
		handler.open({
			name: 'Devin Smith',
			description: '2 widgets',
			amount: $rootScope.beers * 5 * 100,
			bitcoin: true
		});
		e.preventDefault();
	};

	// Close Checkout on page navigation
	$(window).on('popstate', function() {
		handler.close();
	});

	$rootScope.beers = 1;

	$rootScope.$watch('beers', function() {
		if (parseInt($rootScope.beers) != $rootScope.beers || $rootScope.beers < 1 || $rootScope.beers.replace(/[^0-9]/,'') != $rootScope.beers) {
			$rootScope.beers = 1;
		}
		if ($rootScope.beers > 99) {
			$rootScope.beers = 99;
		}
		App.setBeers($rootScope.beers);
	});
});
