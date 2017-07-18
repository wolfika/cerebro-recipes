import test from 'ava';
import plugin from './src/index';

test('should return an object', t => {
	t.is(typeof plugin, 'object');
});

test('returned object should have fn and fetchRecipes properties which are functions', t => {
	t.truthy(plugin.fn);
	t.truthy(plugin.fetchRecipes);
	t.is(typeof plugin.fn, 'function');
	t.is(typeof plugin.fetchRecipes, 'function');
});

test('#fn() should return false if search term doesn\'t start with \'recipes\'', t => {
	t.false(plugin.fn({term: 'randomness'}));
});

test('#fetchRecipes() should call httpClient', t => {
	const fetchMock = () => {
		return Promise.resolve({
			json: () => {
				return Promise.resolve([]);
			}
		});
	};

	t.is(typeof plugin.fetchRecipes('hello world', fetchMock).then, 'function');
});
