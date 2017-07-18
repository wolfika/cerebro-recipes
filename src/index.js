const entities = require('html-entities').XmlEntities;
const {memoize} = require('cerebro-tools');

/**
 * Cerebro plugin to find recipes
 */
module.exports = {
	/**
	 * Fetches recipes from the API
	 *
	 * @param  {String} searchTerm Term to search for
	 * @param  {Function} [httpClient=fetch] HTTP client which will be used to handle sending the request to the API
	 * @return {Promise} Promise object which resolves to an array of found recipes
	 */
	fetchRecipes: (searchTerm, httpClient = fetch) => {
		const url = `http://www.recipepuppy.com/api/?q=${searchTerm}`;
		return httpClient(url)
			.then(response => response.json())
			.then(response => response.results);
	},
	/**
	 * Checks if the user is looking for recipes, memoizes the fetchRecipes
	 * function, and handles the server response.
	 *
	 * @param  {String} term Term entered by the user
	 * @param  {Function} display Used to render the response to the user
	 * @param  {Object} actions Collection of utilities carried by Cerebro
	 * @return {Boolean|null} Either returns false indicating an early return, or null if the response display was successful
	 */
	fn: ({term, display, actions}) => {
		let match = term.match(/^recipes\s+(.+)/i);
		match = match || term.match(/(.+)\srecipes$/i);

		if (!match) {
			return false;
		}

		memoize(this.fetchRecipes)(match[1]).then(recipes => {
			const response = recipes.map(recipe => ({
				icon: recipe.thumbnail,
				id: recipe.href,
				title: entities.decode(recipe.title),
				subtitle: entities.decode(recipe.ingredients),
				onSelect: () => actions.open(recipe.href)
			}));

			display(response);
		});
	}
};
