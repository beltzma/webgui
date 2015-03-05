var t;
var tt;
var req=false;
function lion() { 
  req=false;
  function reqComplete(){ 
    if(req.readyState==4) {
      if(req.status==200) { 
        tt=setTimeout("loadingDisappear()",40);
        
        var values=req.responseText.split("\n");
        var f=0;
        var voltMax = 0;
        var voltMaxElem;
        var voltMin = 6;
        var voltMinElem;
        var volt;
        var voltHeight;
        var currentModule = 0;
        var nextModule;
        
        for (i=0;i<values.length;++i) {
          line = values[i].split("=");
          var htmlobj = document.getElementById(line[0]);
          //update value
          if (htmlobj.type == "text") {
            htmlobj.value=line[1];
          } else {
            htmlobj.innerHTML=line[1];
          }
          //CSS voltage + min,max
          if (line[0].substring(0,2) == "vm") {
            voltHeight = Math.round(300*(parseFloat(line[1])-2.4)/2);
            volt = parseFloat(line[1]);
            if(voltHeight>250) {
              voltHeight = 250;
            }
            if(voltHeight<10) {
              voltHeight = 10;
            }
            document.getElementById(line[0]).parentNode.parentNode.style.height=voltHeight;
            if(volt > voltMax) {
              voltMax = volt;
              voltMaxElem = document.getElementById(line[0]); 
            }
            if(volt < voltMin) {
              voltMin = volt;
              voltMinElem = document.getElementById(line[0]);
            }
          }
          //uptime format
          if (line[0].substring(0,6) == "uptime") {
            document.getElementById(line[0]).innerHTML = getReadableTime(line[1]);
          }
          if (line[0].substring(0,7) == "cputime") {
            document.getElementById(line[0]).innerHTML = getReadableTime(line[1]);
          }
          
          //CSS temperature
          if (line[0].substring(0,2) == "tm") {
            var tempHeight = Math.round(parseFloat(line[1]));
            if (tempHeight<10) {
              tempHeight = 10;
            }
            if(tempHeight>200) {
              tempHeight = 200;
            }
            document.getElementById(line[0]).style.height=tempHeight;
          }
          //CSS balancing
          if (line[0].substring(0,2) == "bm") {
            if (line[1]=="1") {
              document.getElementById(line[0]).style.display="inline";
            } else {
              document.getElementById(line[0]).style.display="none";
            }
          }
          //sound warning test
          if (line[0].substring(0,12) == "stackmaxcell") {
            if (3.6<parseFloat(line[1])) {
              if (document.getElementById('alarm_stackmaxcell').innerHTML != 'played') {
                document.getElementById('alarm_stackmaxcell').innerHTML = "played";
                playalarm();
              }
            } 
          }
          
          
          //CSS error USB
          if (line[0].substring(0,6) == "status") {
            if (line[1].substring(0,9) != "connected") {
              var x = document.querySelectorAll(".module");
              for (j = 0; j < x.length; j++) {
                x[j].style.backgroundColor = '#444';
              }
            } else {
              var x =document.querySelectorAll(".module")
              for (j = 0; j < x.length; j++) {
                x[j].style.backgroundColor = '#eee';
              }
            }
            if (line[1].substring(0,5) == "retry") {
              document.getElementById('status').style.backgroundColor = '#f22';
            } else {
              document.getElementById('status').style.backgroundColor = '';
            }
          }
          //CSS error PIC (PEC percent > 5)
          if (line[0].substring(0,13) == "cpuPECpercent") {
            if (Math.round(parseFloat(line[1]))> 5) {
              document.body.style.background = '#f00';
            } else {
              document.body.style.background = '#ccc';
            }
          }
          
        } //for
        
        /* run user function if exists */
        viewname = document.getElementById('current-view').innerHTML;
        if (typeof window[viewname] === 'function') { 
          window[viewname]();
        }
        /**/
      }
    }
  }
  if(window.XMLHttpRequest) {
    req=new XMLHttpRequest();
  } else if(window.ActiveXObject) {
    req=new ActiveXObject("Microsoft.XMLHTTP");
  }
  if(req) {
    document.getElementById("refreshblink").style.display="block";
    req.open("GET", "/data/"+Math.round(100000000*Math.random())+"/"+document.getElementById('current-view').innerHTML, true);
    req.onreadystatechange=reqComplete;
    req.send(null);
  }
  refreshms=document.getElementById("refreshms").value;
  t=setTimeout("lion()",refreshms);
}

function loadView(view) {

  //load content
  var text = lionLoad("/view/"+view,'container');
  document.getElementById('container').innerHTML = text;
  
  //save current view var
  document.getElementById('current-view').innerHTML = view;
  
  /* run user init function if exists */
  var funcname = view+'_init';
  if (typeof window[funcname] === 'function') { 
    window[funcname]();
  }
}

function lionLoad(url,where) {
  reqX=false;
  function reqXComplete(){ 
    if(reqX.readyState==4) {
      if(reqX.status==200) {
        if (where != null) {
          document.getElementById(where).innerHTML = reqX.responseText;
        }
      }
    }
  }
  if(window.XMLHttpRequest) {
    reqX=new XMLHttpRequest();
  } else if(window.ActiveXObject) {
    reqX=new ActiveXObject("Microsoft.XMLHTTP");
  }
  if(reqX) {
    reqX.open("GET", url, true);
    reqX.onreadystatechange=reqXComplete;
    reqX.send(null);
  }
}


function loadingDisappear() {
  document.getElementById("refreshblink").style.display="none";    
}

function playalarm() {
  var audio = new Audio('/static/buzzer.mp3');
  //audio.play();  
}

function getReadableTime(num) {
  var output = '';
  var temp = Math.round(parseFloat(num));
  if (temp<60) {
    output = temp+'s';
  } else if (temp<3600) {
    var minute = Math.floor(temp/60);
    var second = temp % 60;
    output = minute+'m'+second+'s';
  } else {
    var hour = Math.floor(temp/3600);
    var minutes = temp % 3600;
    minute = Math.floor(minutes/60);
    var second = minutes % 60;
    output = hour+'h'+minute+'m'+second+'s';
  }
  return output;
}

function lionEeprom() {
  var data = document.getElementById("eepromIN").value;
  lionLoad("/send/:e"+data+"/"+Math.round(100000000*Math.random()),null);
}
function lionSend(data) {
  lionLoad("/send/"+data+"/"+Math.round(100000000*Math.random()),null);
}

function hex2a() {
    var hex = document.getElementById("eepromOUT").value.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    
    alert(str);
}

function toggleStatusTable() {
  var obj = document.getElementById("statustablewrap");
  
  if (obj.style.display == 'block') {
    obj.style.display='none';
  } else {
    obj.style.display='block';
  }
}

function struct() {
    var eeprom = document.getElementById("eepromOUT").value.toString();//force conversion
    
    var CounterRuntime = getReadableTime(parseLittleEndian(eeprom.substring(0,8),16));
    var CounterMakebreak = parseLittleEndian(eeprom.substring(8,16),16);
    var error1 = parseLittleEndian(eeprom.substring(16,18),16);
    var error2 = parseLittleEndian(eeprom.substring(18,20),16);
    var V_StackMaximum = parseLittleEndian(eeprom.substring(20,28),16);
    var V_StackMinimum = parseLittleEndian(eeprom.substring(28,36),16);
    var I_StackMaximum = parseLittleEndian(eeprom.substring(36,44),16);
    var I_StackMinimum = parseLittleEndian(eeprom.substring(44,52),16);
    I_StackMinimum = -1*(~I_StackMinimum);
    var V_CellMaximum = parseLittleEndian(eeprom.substring(52,56),16);
    var V_CellMinimum = parseLittleEndian(eeprom.substring(56,60),16);
    var T_CellMaximum = parseLittleEndian(eeprom.substring(60,64),16);
    var T_CellMinimum = parseLittleEndian(eeprom.substring(64,68),16);
    var CounterWrites = parseLittleEndian(eeprom.substring(68,72),16);
    var SOC = parseLittleEndian(eeprom.substring(72,76),16);
    
    var error1str = '';
    error1str += 'CellOvervoltage: '+((error1 & 1)  !=0 )+'\n';
    error1str += 'CellUndervoltage: '+((error1 & 2)  !=0 )+'\n';
    error1str += 'CellOverTemperature: '+((error1 & 4)  !=0 )+'\n';
    error1str += 'CellTempTooHigh: '+((error1 & 8)  !=0 )+'\n';
    error1str += 'CellTempTooHighToCharge: '+((error1 & 16)  !=0 )+'\n';
    error1str += 'CellTempTooLowToCharge: '+((error1 & 32)  !=0 )+'\n';
    error1str += 'VoltageDifferenceSumCells: '+((error1 & 64)  !=0 )+'\n';
    error1str += 'InternalCommunicationError: '+((error1 & 128) !=0 )+'\n';
    
    var error2str = '';
    error2str += 'MasterSlaveCommunicationError: '+((error2 & 1)  !=0 )+'\n';
    error2str += 'BatteryEmpty: '+((error2 & 2)  !=0 )+'\n';
    error2str += 'ShortCircuitDetected: '+((error2 & 4)  !=0 )+'\n';
    error2str += 'LeakDetected: '+((error2 & 8)  !=0 )+'\n';
    error2str += 'ContactorErrorMainsP: '+((error2 & 16)  !=0 )+'\n';
    error2str += 'ContactorErrorMainsN: '+((error2 & 32)  !=0 )+'\n';
    error2str += 'ContactorErrorPrecharge: '+((error2 & 64)  !=0 )+'\n';
    error2str += 'Not used: '+((error2 & 128) !=0 )+'\n';


    var output = 'CounterRuntime: '+CounterRuntime+'\n';
    output += 'CounterMakebreak: '+CounterMakebreak+'\n';
    output += 'CounterWrites: '+CounterWrites+'\n';
    output += 'SOC: '+SOC/100+'%\n';
    output += '----------------\n';
    output += 'V_StackMaximum: '+V_StackMaximum/10000+'V\n';
    output += 'V_StackMinimum: '+V_StackMinimum/10000+'V\n';
    output += 'I_StackMaximum: '+I_StackMaximum/10000+'A\n';
    output += 'I_StackMinimum: '+I_StackMinimum/10000+'A\n';
    output += 'V_CellMaximum: '+V_CellMaximum/10000+'V\n';
    output += 'V_CellMinimum: '+V_CellMinimum/10000+'V\n';
    output += 'T_CellMaximum: '+(T_CellMaximum-27315)/100+'°C\n';
    output += 'T_CellMinimum: '+(T_CellMinimum-27315)/100+'°C\n';
    output += '----------------\n';
    output += error1str;
    output += '----------------\n';
    output += error2str;
    output += '----------------\n';
 
    
    //alert(parseLittleEndian('9f000000'));
    alert(output);
}

function parseLittleEndian(hex) {
    var result = 0;
    var pow = 0;
    while (hex.length > 0) {
        result += parseInt(hex.substring(0, 2), 16) * Math.pow(2, pow);
        hex = hex.substring(2, hex.length);
        pow += 8;
    }
    return result;
};
