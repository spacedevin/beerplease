<?php

require_once __DIR__ . '/../vendor/autoload.php';

$beer = new Tipsy\Tipsy;
$beer->config('../src/*.ini');

$beer->router()
	->when('/pay', function($Request) {
		\Stripe\Stripe::setApiKey($_ENV['STRIPE_SECRET'] ? $_ENV['STRIPE_SECRET'] : $this->tipsy()->config()['stripe']['secret']);
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
	->when('/info', function() {
		phpinfo();
	})
	->when('/favicon.ico', function() {
		http_response_code(404);
	})
	->home(function($View, $Scope, $Settings) {
		$config = $this->tipsy()->config();

		if ($_ENV['GENERAL_TITLE']) {
			$config['general']['title'] = $_ENV['GENERAL_TITLE'];
		}

		if ($_ENV['GENERAL_NAME']) {
			$config['general']['name'] = $_ENV['GENERAL_NAME'];
		}

		if ($_ENV['STRIPE_IMAGE']) {
			$config['stripe']['image'] = $_ENV['STRIPE_IMAGE'];
		}

		if ($_ENV['STRIPE_PUBLISH']) {
			$config['stripe']['publish'] = $_ENV['STRIPE_PUBLISH'];
		}

		if ($_ENV['STRIPE_BITCOIN']) {
			$config['stripe']['bitcoin'] = $_ENV['STRIPE_BITCOIN'];
		}


		$Scope->config = $config;
		$View->display('index');
	})
	->otherwise(function() {
		header('Location: /');
	});

$beer->run();
