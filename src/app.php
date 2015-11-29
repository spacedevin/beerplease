<?php

require_once __DIR__ . '/../vendor/autoload.php';

$beer = new Tipsy\Tipsy;
$beer->config('../src/*.ini');

$beer->router()
	->when('/pay', function($Params) {
		\Stripe\Stripe::setApiKey('d8e8fca2dc0f896fd7cb4cb0031ba249');
		$charge = \Stripe\Charge::create([
			'source' => $token,
			'amount' => 2000,
			'currency' => 'usd'
		]);
		echo $charge;
	})
	->home(function($View) {
		$View->display('index');
	});

$beer->run();
