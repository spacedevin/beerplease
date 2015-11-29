var handler = StripeCheckout.configure({
	key: 'pk_gdm1KopKOp3F90WmR4wcup8zmArrp',
	image: 'https://s3.amazonaws.com/stripe-uploads/QnXaUCtPgcpPDVH1t8fvjoiClYarMyLKmerchant-icon-1436117912995-10547031_685890424836814_2055180330_n-128.png',
	locale: 'auto',
	token: function(token) {
		console.log(token);
		// Use the token to create the charge with a server-side script.
		// You can access the token ID with `token.id`
	}
});

$('#customButton').on('click', function(e) {
	// Open Checkout with further options
	handler.open({
		name: 'Devin Smith LLC',
		description: '2 widgets',
		amount: 2000
	});
	e.preventDefault();
});

// Close Checkout on page navigation
$(window).on('popstate', function() {
	handler.close();
});
