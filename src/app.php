<?php

require_once __DIR__ . '/../vendor/autoload.php';

$beer = new Tipsy\Tipsy;
$beer->config('../src/*.ini');

if ($_ENV['GENERAL_TITLE']) {
	$this->tipsy()->config([general => [title => $_ENV['GENERAL_TITLE']]]);
}

if ($_ENV['GENERAL_NAME']) {
	$this->tipsy()->config([general => [name => $_ENV['GENERAL_NAME']]]);
}

if ($_ENV['STRIPE_IMAGE']) {
	$this->tipsy()->config([stripe => [image => $_ENV['STRIPE_IMAGE']]]);
}

if ($_ENV['STRIPE_PUBLISH']) {
	$this->tipsy()->config([stripe => [publish => $_ENV['STRIPE_PUBLISH']]]);
}

if ($_ENV['STRIPE_BITCOIN']) {
	$this->tipsy()->config([stripe => [bitcoin => $_ENV['STRIPE_BITCOIN']]]);
}

$beer->router()
	->when('/pay', function($Request) {
		\Stripe\Stripe::setApiKey('JJW3NRMJam6X7z5MWRbdJOHSq5HwJy4N');
		$charge = \Stripe\Charge::create([
			'source' => $Request->token,
			'amount' => $Request->amt,
			'currency' => 'usd'
		]);
		if ($charge->id) {
			echo 'success';
		} else {
			http_response_code(500);
		}
	})
	->home(function($View, $Scope) {
		$Scope->config = $this->tipsy()->config();
		$Scope->title = $Scope->config['general']['title'];
		$Scope->name = $Scope->config['general']['name'];
		$View->display('index');
	})
	->otherwise(function() {
		header('Location: /');
	});

$beer->run();
