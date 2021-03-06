from flask import render_template, session, redirect, url_for, current_app
from . import main
from ..lionlib import * 
from ..bmslion import BmsLion
import time

from matplotlib import pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
from matplotlib.dates import AutoDateFormatter, AutoDateLocator, date2num



@main.route('/', methods=['GET','POST'])
def index():
    return render_template('default.html', datalayer = BmsLion.self.datalayer)

@main.route('/bms')
@main.route('/bms/<param>')
def GET_page(param=None):

    if param == "kill":
        BmsLion.self.terminate()  
        BmsLion.self.thread.join()
    if param == "start":
        BmsLion.self.start()  
       
    #return render_template('default_empty.html', messages='test')
    return render_template('default.html', datalayer = BmsLion.self.datalayer)

@main.route('/data/<param>/<page>')
def GET_data(param, page):
#    global sql_i, uptime
    global uptime

    # sql testing here at the moment...
#    if BmsLion.self.datalayer.sqllog == 1:
#        sql_i.stackV(BmsLion.self.datalayer.stackvolt/100)
#        sql_i.stackI(BmsLion.self.datalayer.stackI/10000)
#        sql_i.cellVmin(BmsLion.self.datalayer.stackmincell/10000)
#        sql_i.cellVmax(BmsLion.self.datalayer.stackmaxcell/10000)
#        sql_i.cellTmin((BmsLion.self.datalayer.stackmaxtemp-27315)/100)
#        sql_i.cellTmax((BmsLion.self.datalayer.stackmintemp-27315)/100)    
#        sql_i.SOC(BmsLion.self.datalayer.stacksoc/100)
#        sql_i.PEC(BmsLion.self.datalayer.cpuPEC)
#        sql_i.commit()
    
    #cellcounter = 0
    #for module in BmsLion.self.datalayer.Modules:
    #    for cell in module.Cells:
    #        if cell.volt > 500:
    #            sql_i.cellV(cellcounter, cell.volt/10000)
    #            sql_i.cellT(cellcounter, (cell.temp-27315)/100 )
    #            cellcounter +=1
   
#    BmsLion.self.datalayer.uptime = int(time.time() - uptime)
    
    return render_template(page+'_data.html', datalayer = BmsLion.self.datalayer)

@main.route('/view/<page>')
def GET_view(page):
    
    return render_template(page+'.html', datalayer = BmsLion.self.datalayer)

@main.route('/fig/<param1>/<param2>')
def GET_plot(param1="1", param2="2"):
    
    plt.plot(date2num(time),values)
    plt.title("Quant SOC reset")
    plt.xlabel("time")
    plt.ylabel("voltage")
    # the the x limits to the 'hours' limit
    #plt.xlim(0, 23)
    # set the X ticks every 2 hours
    #plt.xticks(range(0, 23, 2))
    xtick_locator = AutoDateLocator(minticks=5, maxticks=5)
    xtick_formatter = AutoDateFormatter(xtick_locator)
    ax = plt.axes()
    ax.xaxis.set_major_locator(xtick_locator)
    ax.xaxis.set_major_formatter(xtick_formatter)
    plt.grid()
    
    buf = io.BytesIO()
    plt.savefig(buf, format = 'png')
    buf.seek(0)
    #plt.show()
    return send_file(buf, mimetype='image/png')

