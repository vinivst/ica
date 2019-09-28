const fs = require('fs')
module.exports = function(filePath, array, seed) {
	//le o arquivo arrays.json e transforma num objeto
	let data = fs.readFileSync(filePath).toString() /* open the file as string */
	let object = JSON.parse(data) /* parse the string to object */
    //console.log(object.arrays[0]);

    //instancia o mersenne com a seed
    var MersenneTwister = require('mersenne-twister');
    var generator = new MersenneTwister(seed);

    //gera as 2 soluções iniciais aleatorias do tipo [0 1 0 1 1 1 0] para o array lido
    let inicialObj = {
    	solucoes: []
    };

    for (var i = 0; i < 2; i++) {
    	let inicial = object.arrays[array].map((num) => {
    		if (Math.floor(generator.random()*10) <= 5) {
    			return 0;
    		} else {
    			return 1;
    		}
    	});
    	inicialObj.solucoes.push(inicial);
    }

    // Soma cada subconjunto e calcula a diferença, gerando uma solução

    let calcula = (array) => {
    	let count1 = 0;
    	let count2 = 0;
    	let sumSubset = array.map((val, index, arr) => {
    		if (val == 0) {
    			count1 += array[index]
    		} else {
    			count2 += array[index]
    		}
    	});

    	return Math.abs(count2 - count1);
    };

    let melhorSolucao = Infinity;

    let calculaMelhorSolucao = (solucao) => {
    	if (solucao < melhorSolucao) {
    		melhorSolucao = solucao;
    	}
    };

    // Cruza os 2 individuos iniciais
    let gerarSolucao = (individuo1, individuo2) => {

    	let indice = Math.floor(generator.random()*individuo1.length);
    	let indice2 = Math.floor(generator.random()*individuo1.length) + indice;
    	
    	/*
    	let subset1 = individuo1.slice(0, indice);
    	let subset2 = individuo1.slice(indice, individuo1.length);

    	let subset3 = individuo2.slice(0, indice);
    	let subset4 = individuo2.slice(indice, individuo2.length);

    	let filho1 = subset1.concat(subset4);
    	let filho2 = subset3.concat(subset2);
    	*/

    	let parent1_subset1 = individuo1.slice(0, indice);
    	let parent1_subset2 = individuo1.slice(indice, indice2);
    	let parent1_subset3 = individuo1.slice(indice2);

    	let parent2_subset1 = individuo2.slice(indice, individuo2.length);
    	let parent2_subset2 = individuo2.slice(indice, indice2);
    	let parent2_subset3 = individuo2.slice(indice2);

    	let filho1 = parent1_subset1.concat(parent2_subset2).concat(parent1_subset3);
    	let filho2 = parent2_subset1.concat(parent1_subset2).concat(parent2_subset3);


    	//Realiza a mutação

    	let mutacao = (array) => {
    		let indexMutacao = Math.floor(generator.random()*array.length) - 1;
    		if (array[indexMutacao] == 0) {
    			array[indexMutacao] = 1;
    		} else {
    			array[indexMutacao] = 0;
    		}
    		return array;
    	}

    	filho1 = mutacao(filho1);
    	filho2 = mutacao(filho2);

    	//Calcula solução

    	let solucao1 = calcula(individuo1);
    	let solucao2 = calcula(individuo2);
    	let solucao3 = calcula(filho1);
    	let solucao4 = calcula(filho2);
    	calculaMelhorSolucao(solucao1);
    	calculaMelhorSolucao(solucao2);
    	calculaMelhorSolucao(solucao3);
    	calculaMelhorSolucao(solucao4);

    	//Seleciona 2 melhores soluções para sobreviver à proxima iteração

    	let solucoes = [solucao1, solucao2, solucao3, solucao4];
    	solucoes.sort(function(a, b){return a-b});

    	solucoes.pop();
    	solucoes.pop();

    	if (solucoes[0] == solucao1) {
    		solucoes.splice(0, 1, individuo1);
    	} else if (solucoes[0] == solucao2) {
    		solucoes.splice(0, 1, individuo2);
    	} else if (solucoes[0] == solucao3) {
    		solucoes.splice(0, 1, filho1);
    	} else if (solucoes[0] == solucao4) {
    		solucoes.splice(0, 1, filho2);
    	}

    	if (solucoes[1] == solucao1) {
    		solucoes.splice(1, 1, individuo1);
    	} else if (solucoes[1] == solucao2) {
    		solucoes.splice(1, 1, individuo2);
    	} else if (solucoes[1] == solucao3) {
    		solucoes.splice(1, 1, filho1);
    	} else if (solucoes[1] == solucao4) {
    		solucoes.splice(1, 1, filho2);
    	} 

    	return solucoes;
    };

    let proximaGeracao = gerarSolucao(inicialObj.solucoes[0], inicialObj.solucoes[1]);
    //console.log(proximaGeracao);

    let count = 0;
    let newMax = 100000;

    console.time("tempo gasto");
    while (melhorSolucao != 0 && (count < 100000 || newMax > 0)) {
    	let melhorInicial = melhorSolucao;
    	proximaGeracao = gerarSolucao(proximaGeracao[0], proximaGeracao[1]);
    	if (melhorInicial != melhorSolucao) {
    		console.log("Iteração: " + count);
    		newMax = Math.floor(0.3 * count);
    		//console.log(newMax);
    		console.log("Solucao: " + melhorSolucao);
    		melhorInicial = melhorSolucao;
    	}
    	count++;
    	newMax--;
    }
    console.timeEnd("tempo gasto");
    console.log("Tamanho do array: " + object.arrays[array].length);
    return "Melhor solucao: " + melhorSolucao;

    // console.log(solucao1);
    // console.log(solucao2);
    // console.log(solucao3);
    // console.log(solucao4);
    // console.log(melhorSolucao);
    //console.table(inicialObj.solucoes[1]);
}