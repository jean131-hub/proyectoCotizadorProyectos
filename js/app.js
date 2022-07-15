//Variables
const formulario = document.querySelector('#cotizar-seguro');
const spinner = document.querySelector('#cargando');

function Seguro(marca, year, tipo){
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
};

Seguro.prototype.cotizarSeguro = function(){

    console.log('Cotizando...');

    /*  1 = americano 1.15
        2 = asiatico 1.05
        3 = europeo 1.35    */

    const precioBaseSeguro = 2000;
    let precioSeguro;

    switch(this.marca){
        case '1':
            precioSeguro = precioBaseSeguro * 1.15;
            break;
        case '2':
            precioSeguro = precioBaseSeguro * 1.05;
            break;
        case '3':
            precioSeguro = precioBaseSeguro * 1.35;
            break;
        default:
            break;
    };

    // Cada año de diferencia hay que reducir 3% el valor del seguro
    const anioActual = new Date().getFullYear();
    precioSeguro -= (precioSeguro*0.03)*(anioActual-this.year);

    /*
          Si el seguro es básico se múltiplica por 30% mas, es decir, 1.30
          Si el seguro es completo 50% mas
     */

    if (this.tipo === 'basico'){
        precioSeguro *= 1.30;
    }else{
        precioSeguro *= 1.50;
    };

    ui.mostrarResultado(precioSeguro, this);
};

function UI(){};

UI.prototype.llenarOpciones = () => {

    const year = document.querySelector('#year');

    const max = new Date().getFullYear(),
          min = max - 20;
    
    for(let anio = max; anio > min;anio--){

        let option = document.createElement('option');
        option.value = anio;
        option.textContent = anio;
        year.appendChild(option);

    };
};

UI.prototype.mostrarResultado = (precioSeguro, seguro) => {
    
    const resultado = document.querySelector('#resultado');
    const div = document.createElement('div');
    let marca;

    switch(seguro.marca){
        case '1':
            marca = 'Americano';
            break;
        case '2':
            marca = 'Asiatico';
            break;
        case '3':
            marca = 'Europeo';
            break;
        default:
            break;
    };

    div.classList.add('mt-10');
    div.innerHTML = `
        <p class="header">Tu resultado</p>
        <p class="font-bold">Marca: <span class="font-normal">${marca}</span></p>
        <p class="font-bold">Año: <span class="font-normal">${seguro.year}</span></p>
        <p class="font-bold">Tipo: <span class="font-normal">${seguro.tipo}</span></p>   
        <p class="font-bold">Total: <span class="font-normal">$${precioSeguro}</span></p>
    `;

    div.classList.add('font-bold');
    resultado.appendChild(div);

};

//Instanciar UI
const ui = new UI();

cargarEventListeners();

function cargarEventListeners(){

    document.addEventListener('DOMContentLoaded', () => {
        ui.llenarOpciones();
    });

    formulario.addEventListener('submit', (e) => {

        e.preventDefault();

        const marca = document.querySelector('#marca');
        const year = document.querySelector('#year');
        const selector = document.querySelector("input[type=radio]:checked");

        const seguro = validarFormulario(marca.value, year.value, selector.value);

        //Ocultar Spinner y div con mensaje
        setTimeout(() => {
            document.querySelector('.mensaje').remove();

            if (!spinner.classList.contains('hidden')) {
                spinner.classList.add('hidden');
            };

            if (seguro) {
                seguro.cotizarSeguro();
            };

        }, 3000);

    });


};

function validarFormulario(marca, year, selector){

    if(marca && year && selector){
        alerta('correcto', 'Cotizando...');
        return new Seguro(marca, year, selector);
    }; 
    alerta('error', 'Todos los campos son Obligatorios');

};

function alerta(tipo, mensaje){

    //variables
    const div = document.createElement('div');

    div.textContent = mensaje;
    div.classList.add(tipo, 'mt-10', 'mensaje');

    //Mostrar spinner
    if(tipo === 'correcto'){
        limpiarHTML();
        spinner.classList.remove('hidden');
    };

    formulario.insertBefore(div, document.querySelector('#resultado'));
};

function limpiarHTML(){
    const resultado = document.querySelector('#resultado');

    while(resultado.firstChild){
        resultado.firstChild.remove();
    };

};