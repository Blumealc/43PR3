autowatch = 1;
outlets = 4;

function wsMsg() {
	var m = arrayfromargs(arguments);
	
	if (m[0] == "/distance") {outlet(0, "/spanner_v/Angle", m[1]);}
		
	if (m[0] == "/deg") {
		outlet(1, "/spanner10/Angle", m[1]);
		outlet(2, "/spanner9/Angle", m[1]);
		outlet(3, "/spanner3/Angle", m[1]);
	}
	
	if (m[0] == "/hsep") {
		outlet(1, "/spanner10/Separation", m[1]);
		outlet(2, "/spanner9/Separation", m[1]*9*0.1);
		outlet(3, "/spanner3/Separation", m[1]*3*0.1);
	}
	if (m[0] == "/vsep") {
		outlet(0, "/spanner_v/Separation", m[1]);
	}
}