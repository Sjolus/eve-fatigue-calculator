// ---------------------------------------------------------------

var jdc = 0;
var baserange = 0;
var modifier = 0;

// ---------------------------------------------------------------

$(document).ready(function() {
    $('#init-1').click();
    $('#init-2').click();
});

// ---------------------------------------------------------------

function shipChange(obj, range, fat) {
    $("#option-ships button").each(function( index ) {
        $(this).removeClass('btn-primary');
        $(this).addClass('btn-default');
    });

    $(obj).removeClass('btn-default');
    $(obj).addClass('btn-primary');

    baserange = range;
    modifier = fat;

    recalc();
}

function jdcChange(obj, lvl) {
    $("#option-jdc button").each(function( index ) {
        $(this).removeClass('btn-primary');
        $(this).addClass('btn-default');
    });

    $(obj).removeClass('btn-default');
    $(obj).addClass('btn-primary');

    jdc = lvl;

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
	$("#result-1-fatigue").html('<span class="text-muted">N/A</span>');
    } else {
	$("#result-1-fatigue").html(toTime(fatigue * 10));
    }

    hide = false;

    for (i=2; i < 10; i++) {
	wait = refreshInputTime('#wait-' + i, Math.ceil(cooldown), Math.ceil(fatigue / 0.1 - 10));

	traveltime += wait;
	fatigue -= wait * 0.1;

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
	    $("#result-" + i + "-fatigue").html('<span class="text-muted">N/A</span>');
	    $("#result-" + i + "-time").html('<span class="text-muted">N/A</span>');
	} else {
	    $("#result-" + i + "-fatigue").html(toTime(fatigue * 10));
	    $("#result-" + i + "-time").html(toTime(traveltime));
	}
    }
}
