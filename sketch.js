W = 720;
H = W;
mx = W/2;
my = H/2;
sx = mx;
sy = my;
val = 1/3;
siz = 0.85;
rad = 0;
sxx = sx;
syy = sy;
sep = {x:0.125, y:0.125};
dsep = {x:0.125, y:0.125};
old_sep = {x:0.125, y:0.125};
flag = 0;
cc = 0;
deg = 0;
deg_old = deg;

function setup() {
  createCanvas(720, 1280);
}

function draw() {
  background(12);
  calc();
  stroke(255*0.99, 255*0.95, 225*0.9);
  strokeWeight(2);
  noFill();

  // i 3 livelli circolari 
  circle(W/2, H/2, H*pow(siz,3.15));
  circle(W/2, H/2, H*pow(siz,3.15)*(2/3));
  circle(W/2, H/2, H*pow(siz,3.15)/3);
  strokeWeight(W*0.005);

  // il raggio
  line(W/2, H/2, sxx, syy);
  stroke(50, 120, 255);

  // la separazione verticale
  line(sxx, syy, sxx+(W/2-sxx)*sep.y, syy+(H/2-syy)*sep.y);
  var sx2 = map(sep.y*(1-val)*4, 0, 1, sxx, sx);
  var sy2 = map(sep.y*(1-val)*4, 0, 1, syy, sy);
  line(sxx, syy, sx2, sy2);

  // la separazione orizzontale
  arc(W/2, H/2, pow(siz,3.15)*val*W, pow(siz,3.15)*val*H, rad-(sep.x*PI), rad+(sep.x*PI))
  fill(50, 120,255);
  noStroke();

  // cerchio centrale e cerchio alla fine del raggio
  circle(W/2, H/2, W*0.03)
  circle(sxx, syy, W*0.03);
  
  // for loop per disegnare gli altoparlanti sui diversi anelli
  for (sp=3; sp>0; sp--) {
    var colo = [];
    if (sp==3) {
      spk=10;
      colo = leds1;
    } 
    if (sp==2) {
      spk=9;
      colo = leds2;
    }
    if (sp==1) {
      spk=3;
      colo = leds3;
    }

    for (i=0; i<spk; i++) {
      var r = 255*(0.996-pow(colo[i], 0.5)*0.996);
      var g = 255*0.964;
      var b = 255*(0.85-pow(colo[i], 0.5)*0.85);

      if (colo[i] > 0.97) fill(255,0,0);
      else fill(r, g, b);

      let px = map(sin(i/spk*3.14*2)*(siz*sp/3), -1, 1, W*siz, W-W*siz,);
      let py = map(cos((spk-i)/spk*3.14*2)*(siz*sp/3), -1, 1, H*siz, H-H*siz);
      circle(px, py, W*0.025);
    }
  }
}

function calc() {
  // calcola posizione polare quando percepisce 1 input
  if (touches.length > 0) {
    mx = clip(touches[0].x, W*siz, W-W*siz);
    my = clip(touches[0].y, H*siz, H-H*siz);
    let mxx = map(mx, W-W*siz, W*siz, -1, 1);
    let myy = map(my, H-H*siz, H*siz, -1, 1);

    // calcolo della posizione in radianti e gradi
    rad = atan2(myy, mxx);
    deg = 360-((rad/PI-1.5)%2)*-180;
    var ddeg = deg-deg_old;
    if (ddeg < -180) {cc+=1;}
    if (ddeg > 180) {cc-=1;}
    deg_old = deg;

    // calcolo del valore di azimuth
    val = clip(sqrt(mxx*mxx + myy*myy), 1, 1/3);

    // calcolo per la rappresentazione grafica
    let vx = (val)*cos(rad);
    let vy = (val)*sin(rad);

    sxx = map(vx*siz, -1, 1, W-W*siz, W*siz);
    syy = map(vy*siz, -1, 1, W-W*siz, W*siz);

    sx = map(vx, -0.9, 0.9, 0, W);
    sy = map(vy, -0.9, 0.9, 0, W);

    // invio dei messaggi tramite OSC
    sendMSG('/distance', 144*((1-val)/(1/1.5)));
    sendMSG('/deg', deg+360*cc);

    // reset dei flag e storage degli ultimi valori per aumento relativo
    if (touches.length < 2) {flag = 0; old_sep.x = sep.x; old_sep.y = sep.y;}
    
    // quando viene percepito un secondo input
    if (touches.length > 1) {
      
      // calcolo dei valori relativi (delta)
      if (flag==0) {
      dsep.x = clip(touches[1].x, W*siz, W-W*siz)-old_sep.x;
      dsep.y = clip(touches[1].y, H*siz, H-H*siz)-old_sep.y; 
      flag = 1;
      }
      let dxx = clip(touches[1].x, W*siz, W-W*siz); 
      let dyy = touches[1].y; 

      // calcolo separazione orizzontale (sep.x) e verticale (sep.y)
      sep.x = clip((dxx-dsep.x)/dsep.x + old_sep.x, 1, 0.125);
      sep.y = clip((dyy-dsep.y)/dsep.y + old_sep.y, 1, 0.125);
      
      // invio dei messaggi tramite OSC
      sendMSG('/hsep', pow(1-sep.x, 3.5)*100);
      sendMSG('/vsep', pow(1-sep.y, 3.5)*100*3*0.1);
    }
  }
}

// funzione per clipping
function clip(v, a, b) {
  if (v>a) {v = a};
  if (v<b) {v = b};
  return v;
}

function mousePressed() {
  return false;
}

// funzione per inviare messaggi OSC
function sendMSG(chan, msg) {
    var message = new OSC.Message(chan, msg);
    osc.send(message);
}
