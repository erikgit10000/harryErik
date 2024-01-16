import { hogwartsHouses } from './hogwartsHouses.js';

/**
 * Elimina los datos almacenados en localStorage y redirige a la página de inicio.
 *
 * @function
 * @returns {void}
 */
function clearStorage() {
	localStorage.clear();
	window.location = '../index.html';
}

/**
 * Crea un fragmento de documento que contiene la presentación de la casa seleccionada.
 * - Incluye una sección con el nombre de la casa y su logo, video y botón asociados.
 *
 * @function
 * @returns {DocumentFragment} - Fragmento de documento con la presentación de la casa.
 */
function createFragment() {
	const fragmentToReturn = document.createDocumentFragment();

	// Crear la sección principal.
	const section = createHTMLElement(
		'section',
		'section-house');
	fragmentToReturn.appendChild(section);

	// Crear el encabezado con el nombre del usuario y el mensaje del sombrero seleccionador.
	const h2 = createHTMLElement(
		'h2',
		'h2-house',
		{
			innerHTML: `${localStorage.getItem('name')}, el sombrero seleccionar te elige para...`
		});
	section.appendChild(h2);

	// Crear la imagen de la casa.
	const img = createHTMLElement(
		'img',
		'img-house',
		{
			src: selectedHouse.logoPath,
			alt: `Logo de la casa ${localStorage.getItem('selectedHouse')}`
		}
	);
	section.appendChild(img);

	// Crear el video de presentación de la casa.
	const video = createHTMLElement(
		'video',
		'video-house',
		{
			src: selectedHouse.videoPath,
			controls: true,
			autoplay: true,
		}
	);
	section.appendChild(video);

	// Crear el botón de retorno al cuestionario.
	const button = createHTMLElement(
		'button',
		'btn-return',
		{
			innerHTML: 'Volver a realizar el cuestionario'
		}
	);
	button.style.background = `linear-gradient(to right, ${selectedHouse.btnColor[0]}, ${selectedHouse.btnColor[1]})`;
	button.addEventListener('click', clearStorage);
	section.appendChild(button);

	return fragmentToReturn;
}

/**
 * Crea y retorna un elemento HTML con un identificador específico y otros parámetros opcionales.
 *
 * @function
 * @param {string} elementTag - Tipo de elemento HTML a crear (por ejemplo, 'div', 'p', 'h2', 'img', 'button').
 * @param {string} elementId - Identificador único para el elemento creado.
 * @param {Object} otherParameters - Otros parámetros opcionales a asignar al elemento (clave-valor).
 * @returns {HTMLElement} - El elemento HTML creado.
 */
function createHTMLElement(elementTag, elementId, otherParameters = undefined) {
	const elementToReturn = document.createElement(elementTag);
	elementToReturn.id = elementId;

	if (otherParameters) {
		for (const parameter in otherParameters) {
			elementToReturn[parameter] = otherParameters[parameter];
		}
	}

	return elementToReturn;
}

/**
 * Crea la estructura del contenedor principal y la añade al cuerpo del documento.
 *
 * @function
 * @returns {void}
 */
function createContainer() {
	const fragment = createFragment();

	// Crear la sección principal.
	const section = createHTMLElement('section', 'section-main');
	section.appendChild(fragment);

	// Crear el elemento main.
	const main = createHTMLElement('main', 'main-house');
	main.appendChild(section);

	document.body.appendChild(main);
}

function checkStorage() {
	const userName = localStorage.getItem('name');

	// Si el nombre no está presente, redirige a la página principal y devuelve falso.
	if (userName === null) {
		window.location = '../index.html';
		return false;
	}

	const selectedHouse = localStorage.getItem('selectedHouse');

	// Si la casa no está presenta, redirige al cuestionario y devuelve falso.
	if (selectedHouse === null) {
		window.location = '../questionnaire.html';
		return false;
	}

	return true;
}

/**
 * Obtiene el objeto de datos de la casa de Hogwarts seleccionada almacenado en localStorage.
 *
 * @function
 * @returns {Object} - Objeto de datos de la casa de Hogwarts seleccionada. Undefined si no existe la casa.
 */
function getHouseObject() {
	const selectedHouse = localStorage.getItem('selectedHouse');
	return hogwartsHouses[selectedHouse];
}

/**
 * Función de inicialización que se ejecuta al cargar completamente el DOM.
 * Verifica la existencia de datos almacenados y, si es el caso, realiza las acciones de inicialización.
 *
 * @function
 * @returns {void}
 */
function init() {
	// Verifica si hay datos almacenados y procede con la inicialización.
	if (checkStorage()) {
		// Obtiene el objeto de datos de la casa seleccionada.
		selectedHouse = getHouseObject();

		// Verifica si la casa seleccionada es válida.
		if (selectedHouse === undefined) {
			// En caso de que no sea válida, limpia los datos almacenados y redirige al usuario.
			localStorage.removeItem('selectedHouse');
			window.location = './questionnaire.html';
			return;
		}

		// Aplica estilos al fondo, crea el contenedor y realiza otras acciones de inicialización.
		document.body.style.background = `url(${selectedHouse.background})`;
		createContainer();
	}
}

/**
 * Variable global que almacenará la casa de Hogwarts seleccionada.
 * Inicializada como una cadena vacía.
 *
 * @type {Object}
 */
let selectedHouse;

/**
 * Evento que se ejecuta cuando el DOM ha sido completamente cargado,
 * inicializa la aplicación llamando a la función 'init'.
 *
 * @event
 * @listens DOMContentLoaded
 * @returns {void}
 */
window.addEventListener('DOMContentLoaded', init);