/*
Edoardo Staffa DIAL per Fuasto Ambisonico
*/
outlets = 4;
sketch.default2d();
var val = 0;

var last_x = 0;
var last_y = 1;

var siz = 0.9;
var spk = 0.04;
var width = box.rect[2] - box.rect[0];
var prop = 362/345;

var old_y = 0;
var last_val = 0;
var sep = 0;
var sep_old = 0;
var old_x = 0;
var last_val_v = 0;
var sep_v = 0;
var sep_old_v = 0;

var deg = 0;
var rad = Math.PI/2;
var deg_old = 0;
var cc = 0;
var ld1 = [];
var ld2 = [];
var ld3 = [];

angles("hangle");
angles("vangle");
angles("hsep");
angles("vsep");
draw();

function draw()
{
	var theta;
	var lnx = siz*(1-val)*Math.cos(rad);
	var lny = siz*(1-val)*Math.sin(rad)
	width = box.rect[2] - box.rect[0];
	
	var lnxv = clip(lnx*(sep_v+1), siz*Math.cos(rad)*(sep_v)+lnx*(1-sep_v), siz*Math.cos(rad)*(sep_v));
	var lnyv = clip(lny*(sep_v+1), siz*Math.sin(rad)*(sep_v)+lny*(1-sep_v), siz*Math.sin(rad)*(sep_v));
	
	with (sketch) {
		
		glclearcolor(0.125,0.125,0.125,1);
		glclear();
		gllinewidth(1);
		
		point(lnx*Math.pow(val,10),lny*Math.pow(val,10));
		glcolor(0.2,0.2,0.966,0.1);
		circle(siz*(1-val), (360-deg+80)-sep*170, (360-deg+100)+sep*170);
		glcolor(0.125,0.125,0.125,1);
		circle(siz*(1-Math.pow(val,2/3))*2/3, (360-deg+80)-sep*170, (360-deg+100)+sep*170);
		
		point(0,0);	
		glcolor(0.996,0.964,0.895,1);
		framecircle(siz);
		framecircle(siz*2/3);
		framecircle(siz/3);
		
		gllinewidth(6);
		glcolor(0.3,0.5,1,1);
		framecircle(siz*(1-val), (360-deg+80)-sep*170, (360-deg+100)+sep*170);
		glcolor(0.996,0.964,0.895,1);
		point(0,0);
		lineto(lnx, lny);
		
		glcolor(0.3,0.5,1,1);
		point(lnx, lny);
		circle(spk);
		lineto((1-sep_v)*lnx, (1-sep_v)*lny);
		circle(spk*0.6);
		point(lnx, lny);
		lineto(lnxv,lnyv);
		circle(spk*0.6);
		
		for (i=0; i<10; i++) {
			glcolor(0.996-Math.pow(ld1[i], 0.5)*0.9, 0.964, 0.85-ld1[i]*0.8, 1);
			if (ld1[i] > 0.96) {glcolor(1,0,0,1);}
			point(Math.sin(i/10*3.14*2)*siz, Math.cos((10-i)/10*3.14*2)*siz);
			circle(spk);
		}	
		
		for (i=0; i<9; i++) {
			glcolor(0.996-Math.pow(ld2[i], 0.5)*0.9, 0.964, 0.85-ld2[i]*0.8, 1);
			if (ld2[i] > 0.96) {glcolor(1,0,0,1);}
			point(Math.sin(i/9*3.14*2)*(siz*2/3), Math.cos((9-i)/9*3.14*2)*(siz*2/3));
			circle(spk);
		}	
		
		for (i=0; i<3; i++) {
			glcolor(0.996-Math.pow(ld3[i], 0.5)*0.9, 0.964, 0.85-ld3[i]*0.8, 1);
			if (ld3[i] > 0.96) {glcolor(1,0,0,1);}
			point(Math.sin(i/3*3.14*2)*(siz/3), Math.cos((3-i)/3*3.14*2)*(siz/3));
			circle(spk);
		}
		
		glcolor(0.996,0.964,0.895,1);
		point(0,0);
		circle(0.07);
	
	}
}

function leds1() {
	ld1 = arrayfromargs(arguments);
	bang();
}

function leds2() {
	ld2 = arrayfromargs(arguments);
}

function leds3() {
	ld3 = arrayfromargs(arguments);
}

function bang()
{
	draw();
	refresh();
	
}

function resets() {
	deg_out = 0;
}
function msg_float(v)
{
	val = Math.min(Math.max(0,v),1);
	notifyclients();
	bang();
}

function set(v)
{
	val = Math.min(Math.max(0,v),1);
	notifyclients();
	draw();
	refresh();
}

function fsaa(v)
{
	sketch.fsaa = v;
	bang();
}

function setvalueof(v)
{
	msg_float(v);
}

function getvalueof()
{
	return val;
}

// all mouse events are of the form: 
// onevent <x>, <y>, <button down>, <cmd(PC ctrl)>, <shift>, <capslock>, <option>, <ctrl(PC rbutton)>
// if you don't care about the additonal modifiers args, you can simply leave them out.
// one potentially confusing thing is that mouse events are in absolute screen coordinates, 
// with (0,0) as left top, and (width,height) as right, bottom, while drawing 
// coordinates are in relative world coordinates, with (0,0) as the center, +1 top, -1 bottom,
// and x coordinates using a uniform scale based on the y coordinates. to convert between screen 
// and world coordinates, use sketch.screentoworld(x,y) and sketch.worldtoscreen(x,y,z).

function onclick(x,y,but,cmd,shift,capslock,option,ctrl)
{
	// cache mouse position for tracking delta movements

}
onclick.local = 1; //private. could be left public to permit "synthetic" events

function ondrag(x,y,but,cmd,shift,capslock,option,ctrl)
{
	with (Math) {
		var xx = clip(x, 0, width*siz);
		var yy = clip(y, 0, width*siz);
		var sx = clip((x/width*2-1), -1, 1);
		var sy = clip((1-y/width*2), -1, 1);
		var tmp = 1;
		if (shift == 0) {
			rad = atan2(sy,sx);
			deg = 360-((rad/PI+1.5)%2)*180;
			var ddeg = deg-deg_old;
			if (ddeg < -180) {cc+=1;}
			if (ddeg > 180) {cc-=1;}
			//if (deg<0) {deg=(deg+360);}
			angles("hangle");
			deg_old = deg;
			
			val = sqrt(sx*sx + sy*sy);
			val = pow(1-clip(val, 0, 1),1);
			val = clip(val, 0, 2/3);
			angles("vangle");
			
			last_x = sx;
			last_y = sy;
			last_val = clip(x/width, 0,1);
			last_val_v = 1-clip(y/width, 0,1);
			old_y = y;
			old_y = x;
			sep_old = 0;
			sep_old_v = 0;
		}
		if (shift == 1) {
			//var dist = abs((x/width)-last_val);
			if (old_x != x) {
				var nsep = (clip(x*1.5/width,-last_val*1.5, 1+last_val*1.5))-last_val*1.5;
				var dsep = (nsep*2-sep_old);
				sep += dsep;
				sep = clip((sep+sep_old)*0.5, 0, 1);
				angles("hsep");
				sep_old = nsep;
				old_x = x;
			}
			if (old_y != y) {
				var nsep_v = (1-clip(y*2/width,-last_val_v, 1+last_val_v))-last_val_v;
				var dsep_v = (nsep_v*2-sep_old_v);
				sep_v += dsep_v;
				sep_v = clip((sep_v+sep_old_v)*0.5, 0, 1);
				angles("vsep");
				sep_old_v = nsep_v;
				old_y = y;
			}
		}
		bang();
	}
}

function angles(w) {
	if (w == "hangle") {
		outlet(0, "/spanner10/Angle", (deg+360*cc));
		outlet(1, "/spanner9/Angle", (deg+360*cc));
		outlet(2, "/spanner3/Angle", (deg+360*cc));
	}
	if (w == "vangle") {
		outlet(3, "/spanner_v/Angle", 144*(val/(1/1.5)));
	}
	if (w == "hsep") {
		outlet(0, "/spanner10/Separation", Math.pow(1-sep, 3.5)*100);
		outlet(1, "/spanner9/Separation", Math.pow(1-sep, 3.5)*100*9*0.1);
		outlet(2, "/spanner3/Separation", Math.pow(1-sep, 3.5)*100*3*0.1);
	}
	if (w == "vsep") {
		outlet(3, "/spanner_v/Separation", Math.pow(1-sep_v, 3.5)*100*3*0.1);
	}
}

ondrag.local = 1; //private. could be left public to permit "synthetic" events

function ondblclick(x,y,but,cmd,shift,capslock,option,ctrl)
{
	last_x = 0;
	last_y = 1;
	deg = 0;
	rad = Math.PI/2;
	sep_old = 0;
	old_y = 0;
	sep = 0;
	val = 0;
	angles("hangle");
	angles("vangle");
	angles("hsep");
	angles("vsep");
}
ondblclick.local = 1; //private. could be left public to permit "synthetic" events

function forcesize(w,h)
{
	if (w!=h) {
		h = w;
		box.size(w,h);
	}
}
forcesize.local = 1; //private

function onresize(w,h)
{
	forcesize(w,h);
	draw();
	refresh();
}
onresize.local = 1; //private

function clip(x, m, mx) {
	if (x > mx) {x = mx;}
	if (x < m) {x = m;}
	return x;
}
