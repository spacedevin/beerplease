
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
}).run(function($rootScope, $location, $http) {

	var handler = StripeCheckout.configure({
		key: config.stripe.publish,
		image: config.stripe.image,
		locale: 'auto',
		token: function(token) {
			console.log(token);
			$http.post('/pay', {
				amt: $rootScope.beers * 5 * 100,
				token: token.id
			}).then(function() {
				// just asume all is well
			}, function() {
				alert('Failed!');
			});
		}
	});

	$rootScope.pay = function() {
		handler.open({
			name: config.general.name,
			description: config.general.title,
			amount: $rootScope.beers * 5 * 100,
			bitcoin: config.stripe.bitcoin ? true : false
		});
	};

	$rootScope.beers = 1;

	$rootScope.$watch('beers', function() {
		if (parseInt($rootScope.beers) != $rootScope.beers || $rootScope.beers < 1 || ($rootScope.beers.replace && $rootScope.beers.replace(/[^0-9]/,'') != $rootScope.beers)) {
			$rootScope.beers = 1;
		}
		if ($rootScope.beers > 99) {
			$rootScope.beers = 99;
		}
		App.setBeers($rootScope.beers);
	});

	$('body').addClass('loaded');
});
