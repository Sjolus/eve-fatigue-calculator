// ---------------------------------------------------------------

var selectTravel = 1;
var selectShip = 4;
var selectShipCovert = 1;
var selectJdc = 5;

var baserange = 0;
var jdc = 0;
var modifier = 0;

// ---------------------------------------------------------------

$(document).ready(function() {
    readjust();
});

// ---------------------------------------------------------------

function readjust() {
    $("#option-jdc").addClass('hide');
    $("#option-ship").addClass('hide');
    $("#option-ship-covert").addClass('hide');

    $("#option-travel button").each(function( index ) {
        $(this).removeClass('btn-primary');
        $(this).addClass('btn-default');
    });
    $("#option-travel-" + selectTravel).addClass('btn-primary');

    $("#option-ship button").each(function( index ) {
        $(this).removeClass('btn-primary');
        $(this).addClass('btn-default');
    });
    $("#option-ship-" + selectShip).addClass('btn-primary');

    $("#option-ship-covert button").each(function( index ) {
        $(this).removeClass('btn-primary');
        $(this).addClass('btn-default');
    });
    $("#option-ship-covert-" + selectShipCovert).addClass('btn-primary');

    $("#option-jdc button").each(function( index ) {
        $(this).removeClass('btn-primary');
        $(this).addClass('btn-default');
    });
    $("#option-jdc-" + selectJdc).addClass('btn-primary');


    if (selectTravel == 1) {
	$("#option-ship").removeClass('hide');

	baserange = 5;
	jdc = 0;
	modifier = 0;

	if (selectShip == 1) modifier = 0.5;
	if (selectShip == 2) modifier = 0.9;
	if (selectShip == 3) modifier = 0.9;
    }

    if (selectTravel == 2) {
	$("#option-ship").removeClass('hide');
	$("#option-jdc").removeClass('hide');

	jdc = selectJdc;
	switch(selectShip) {
	case 1:
	    baserange = 4.0;
	    modifier = 0.5;
	    break;
	case 2:
	    baserange = 5.0;
	    modifier = 0.9;
	    break;
	case 3:
	    baserange = 2.5;
	    modifier = 0.9;
	    break;
	case 4:
	    baserange = 2.5;
	    modifier = 0.0;
	    break;
	} 
    }

    if (selectTravel == 3) {
	$("#option-ship-covert").removeClass('hide');
	$("#option-jdc").removeClass('hide');

	baserange = 4.0;
	jdc = selectJdc;

	if (selectShipCovert == 1) modifier = 0.5;
	if (selectShipCovert == 2) modifier = 0.95;
    }

    $('#fatigue-bonus').html((modifier * 100) + "%");
    recalc();
}

function resetMin() {
    $("input").each(function( index ) {
	if ($(this).prop('step') == '0.01') {
	    $(this).val($(this).prop('min'));
	}
    });
    recalc();
}

function resetMax() {
    $("input").each(function( index ) {
	if ($(this).prop('step') == '0.01') {
	    $(this).val($(this).prop('max'));
	}
    });
    recalc();
}

function toTime(m) {
    min = Math.ceil(m);

    years = Math.floor(min / 60 / 24 / 365);
    min -= years * 60 * 24 * 365;

    days = Math.floor(min / 60 / 24);
    min -= days * 60 * 24;

    hours = Math.floor(min / 60);
    min -= hours * 60;

    minutes = Math.ceil(min);

    str = "";

    if (years != 0) {
	str = str + years + "y ";
    }

    if (days != 0) {
	str = str + days + "d ";
    }

    if (hours != 0) {
	str = str + hours + "h ";
    }

    str = str + minutes + "m"

    return str;
}

function refreshInputTime(obj, min, max) {
    max = Math.max(min, max);

    v = $(obj + "-input").val();

    $(obj + "-input").prop('min', min);
    $(obj + "-input").prop('max',max);
    $(obj + "-input").val(v);

    v = $(obj + "-input").val();

    $(obj + "-min").html(toTime(min));
    $(obj + "-max").html(toTime(max));
    $(obj + "-value").html(toTime(v));

    return Number(v);
}

function refreshInputDistance(obj, min, max) {
    max =  Math.max(min, max);

    v = $(obj + "-input").val();

    $(obj + "-input").prop('min', min);
    $(obj + "-input").prop('max',max);
    $(obj + "-input").val(v);
    v = $(obj + "-input").val();

    $(obj + "-min").html(min + "ly");
    $(obj + "-max").html(max + "ly");
    $(obj + "-value").html(v + "ly");

    return Number(v);
}


function recalc() {
    maxrange = baserange * (1 + jdc * 0.2);

    traveltime = 0;
    fatigue = 0.0;

    distance = refreshInputDistance('#distance-1', 0, maxrange);
    cooldown = 1 + distance * (1 - modifier);
    fatigue = 1 + distance * (1 - modifier);

    if ($("#distance-1-input").val() == 0) {
	$("#result-1-fatigue-after").html('<span class="text-muted">N/A</span>');
	$("#result-1-fatigue-time").html('<span class="text-muted">N/A</span>');
	$("#result-1-time").html('<span class="text-muted">N/A</span>');
    } else {
	$("#result-1-fatigue-after").html((fatigue).toFixed(2));
	$("#result-1-fatigue-time").html("<span class='text-muted'><small>" + toTime(fatigue * 10 - 10) + "</small></span>");
	$("#result-1-time").html("0m");
    }

    hide = false;

    for (i=2; i < 10; i++) {
	$("#result-" + i + "-cooldown").html(toTime(cooldown));
	traveltime += cooldown;
	fatigue -= cooldown / 10;

	wait = refreshInputTime('#wait-' + i, 0, Math.ceil(fatigue / 0.1 - 10));
	traveltime += wait;
	fatigue -= wait * 0.1;
	$("#result-" + i + "-fatigue-before").html((fatigue).toFixed(2));

	distance = refreshInputDistance('#distance-' + i, 0, maxrange);
	cooldown = Math.max(1 + distance * (1 - modifier), fatigue);
	fatigue = Math.max(fatigue, 1) * (1 + distance * (1 - modifier));
	fatigue = Math.min(fatigue, 60 * 24 * 30 / 10);

	if ($("#distance-" + (i - 1) + "-input").val() == 0) {
	    hide = true;
	}

	if (hide) {
	    $("#row-" + i).addClass('hide');
	} else {
	    $("#row-" + i).removeClass('hide');
	}

	if ($("#distance-" + i + "-input").val() == 0) {
	    $("#result-" + i + "-fatigue-after").html('<span class="text-muted">N/A</span>');
	    $("#result-" + i + "-time").html('<span class="text-muted">N/A</span>');
	    $("#result-" + i + "-fatigue-time").html('<span class="text-muted">N/A</span>');
	} else {
	    $("#result-" + i + "-fatigue-after").html((fatigue).toFixed(2));
	    $("#result-" + i + "-fatigue-time").html("<span class='text-muted'><small>" + toTime(fatigue * 10 - 10) + "</small></span>");
	    $("#result-" + i + "-time").html(toTime(traveltime));
	}
    }
}
