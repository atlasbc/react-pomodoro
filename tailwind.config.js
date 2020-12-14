module.exports = {
	purge: [ './src/**/*.{js,jsx,ts,tsx}', './public/index.html' ],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				comp1: '#F8DF84',
				comp2: '#D9B973',
				comp3: '#F0C68C',
				comp4: '#D99F73',
				comp5: '#F8A684'
			},
			backgroundImage: (theme) => ({
				fabric: "url('/src/img/45-degree-fabric-light.png')",
				absurdity: "url('/src/img/absurdity.png')",
				paper: "url('/src/img/beige-paper.png')",
				cardboard: "url('/src/img/cardboard.png')",
				graypaper: "url('/src/img/clean-gray-paper.png')"
			}),
			fontFamily: {
				cursive: [ 'Indie Flower', 'cursive' ],
				montserrat: [ 'Montserrat', 'sans-serif' ]
			}
		}
	},
	variants: {
		extend: {}
	},
	plugins: []
};
