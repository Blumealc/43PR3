autowatch = 1;
outlets = 1;
var lst1 = [];
var lst2 = [];
var lst3 = [];

// inizializzazione per interpolazione delle variabili
for (var i = 0; i < 10; i++) {
    lst1[i] = 0;
    lst2[i] = 0;
    lst3[i] = 0;
}

// loops per invio dei messaggi, l'indice del led viene indicato dalle decine
function leds1(v) {
    var lst = arrayfromargs(arguments);
    for (i = 0; i < lst.length; i++) {
        lst[i] = (lst1[i]+lst[i])*0.5;
        outlet(0, "/leds1",i*10+lst[i]);
        lst1[i] = lst[i];
    }
}

function leds2(v) {
    var lst = arrayfromargs(arguments);
    for (i = 0; i < lst.length; i++) {
        lst[i] = (lst2[i]+lst[i])*0.5;
        outlet(0, "/leds2",i*10+lst[i]);
        lst2[i] = lst[i];
    }
}

function leds3(v) {
    var lst = arrayfromargs(arguments);
    for (i = 0; i < lst.length; i++) {
        lst[i] = (lst3[i]+lst[i])*0.5;
        outlet(0, "/leds3",i*10+lst[i]);
        lst3[i] = lst[i];
    }
}