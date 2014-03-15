(function() {
	'use strict';
	function Foo() {
		console.debug('FooState constructor');
		this.bar = 'baz';
	}
	Foo.prototype = {
		preload: function() {
			console.debug('FooState preload');
		},
		create: function() {
			console.debug('FooState create');
		},
		update: function() {}
	};
	FooState = Foo;
}());