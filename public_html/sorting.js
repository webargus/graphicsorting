/*
 * 
 *              Bar chart class to test sorting algorithms
 *              -----------------------------------------------------
 *              
 *              Author: Edson Kropniczki - (c) jun/2019
 *              mailto: kropniczki@gmail.com
 *              License: you're free to mess up with this code at your will, just keep reference to developer
 *              Disclaimer: no warrant given, use it on your own risk! 
 * 
 */

( function () {
    
    /*      private class barChart 
     * 
     * @param {type} id                         = id of tag to include bar chart
     * @param {type} list                       = array of integers, one integer for a bar in chart
     * 
     */
    var barChart = function(id, list) {
        
        var self = this;
        
        this.swap = function(ix0, ix1) {
            if(ix0 == ix1) {
                return;
            }
            // just swap bar widths and texts
            [self.bars[ix0].style.width, self.bars[ix1].style.width] = [self.bars[ix1].style.width, self.bars[ix0].style.width];
            [self.bars[ix0].innerText, self.bars[ix1].innerText] = [self.bars[ix1].innerText, self.bars[ix0].innerText];
        };
        
        // constructor
        var create = function() {
            // get DOM element where we'll insert the chart bars
            self.chart = document.getElementById(id);
            // save the integer array param in obj member
            self.list = list;
            // find the greatest integer in array, in order to calculate largest bar size
            var max = Math.max.apply(null, self.list);
            // all bars must be equal or less than largest one
            var ratio = 200/max;
            clear();        // empty chart, create and add bars to it
            for (var i = 0; i < self.list.length; i++) {
                addBar(Math.floor(ratio*self.list[i])+"px", self.list[i]);
            }
            // save bar collection in obj member for further use
            self.bars = self.chart.children;
        };
        
        var clear = function() {
            while (self.chart.hasChildNodes()) {
                self.chart.removeChild(self.chart.lastChild);
            }
        };
        
        var addBar = function(sz, txt) {
            var b = new bar();
            b.style.width = sz;
            b.innerText = txt;
            self.chart.appendChild(b);
        };
        
        /* private class bar
         * the wrapping barChart class instantiates this class when constructing its bar chart
         * @returns {DOM element} = div with class attr pointing to .bar class in main.css;
         *                                               
         */
        var bar  = function () {

            var self = this;
            var element = "";
            
            // constructor
            var create = function() {
                self.element = document.createElement('div');
                self.element.setAttribute("class", "bar");
                return self.element;
            };
            // call constructor and return bar object
            return create();
        };
        
        // instantiate bar chart
        create();
    
    };
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    var selectionSort = function(list, delay, chart) {
        
        /*
         *      IMPORTANT! Use .slice() to hard-copy array to sort; spent HOURS trying to figure out why
         *      sorting was ending before completion when running mutiple sorting threads simultaneously;
         *      that was precisely because I wasn't hard-copying the array to sort (list); as a consequence,
         *      all threads stopped once one or another sorting algorithm finished sorting the shared list.
         */
        var list = list.slice();           // save COPY of list in local member
        var delay = delay;             // delay between sorting steps in millisecs
        var curr_pos = 0;              // index of current walking position in array to sort
        var smallest, smaller_pos;
        var chart =  chart;
        var thread;
        
        var init = function() {
            thread = new Thread(callback, delay);
            chart =  new barChart(chart, list);
        };
        
        var callback = function() {

            if(curr_pos === list.length - 1) {
                thread.Stop();
                return;
            }
            smallest = list[curr_pos];
            smaller_pos = curr_pos;
            
            for(var ix = curr_pos + 1; ix < list.length; ix++) {
                if(list[ix] < smallest) {
                    smallest = list[ix];
                    smaller_pos = ix;
                }
            }
            
            if (smaller_pos != curr_pos) {
               [list[curr_pos], list[smaller_pos]] = [list[smaller_pos], list[curr_pos]];
               chart.swap(curr_pos, smaller_pos);
            }
            
            curr_pos++;
        };

        this.start = function() {
            thread.Start();
        };
        
        // call constructor
        init();
        
    };
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    var bubbleSort = function (list, delay, chart) {
        
        /*
         *      IMPORTANT! Use .slice() to hard-copy array to sort; spent HOURS trying to figure out why
         *      sorting was ending before completion when running mutiple sorting threads simultaneously;
         *      that was precisely because I wasn't hard-copying the array to sort (list); as a consequence,
         *      all threads stopped once one or another sorting algorithm finished sorting the shared list.
         */
        var list = list.slice();           // save list COPY in local member
        var delay = delay;             // delay between sorting steps in millisecs
        var chart = chart;
        var thread, swapped;
        
        //  constructor
        var init = function() {
            thread = new Thread(callback, delay);
            chart = new barChart(chart, list);
        };
        
        var callback = function() {
            swapped = false;
            for(var i = 1; i < list.length; i++) {
                if(list[i-1] > list[i]) {
                    // swap in memory, also graphically and remember it
                    [ list[i-1], list[i] ] = [ list[i], list[i-1] ];
                    chart.swap(i-1, i);
                    swapped = true;
                }
            }
            if(!swapped) {
                thread.Stop();
            }
        };
        
        this.start = function() {
            thread.Start();
        };
        
        // call constructor to instantiate object
        init();
 
    };
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    var initSorting = function() {
        
        // read n from user input, create array and fill it with integers from 1 to n 
        var n = document.getElementById("list_sz").value;
        var list = [];
        for(var i = 0; i < n; i++) {
            list.push(i+1);
        }
        // shuffle array
        for(var i = 0; i < 100; i++) {
            ix0 = parseInt(Math.random()*n);
            ix1 = parseInt(Math.random()*n);
            [list[ix0], list[ix1]] = [list[ix1], list[ix0]];    // trick to swap
        }
        
        // instantiate selection sort object and make it work
        var delay = 150;        // in millisecs
        var selSort = new selectionSort(list, delay, "chart1");
        var bubble = new bubbleSort(list, delay, "chart2");
        selSort.start();
        bubble.start();
    };
    
   var  init  = function() {
            
        console.log("page loaded");     // debug
        
        // Add event listener to start btn:
        document.getElementById("start").addEventListener("click", initSorting);
        
    };
    
    document.addEventListener("DOMContentLoaded", init);
    
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//		class Thread  (c)	E. Kropniczki - 2005
//		--------------------------------------------------------
//
//		- purpose:
//                                      execute function *callback*  after each *interval* milliseconds elapses
//
//		- constructor:
//                                      Thread(callback, interval);	=> instantiates a thread obj  that calls *callback* 
//                                                                                           every *interval*
//
//		- public methods:
//                                      Start(); => starts the thread (the madness)
//                                      Stop(); => interrupts the thread
//                                      isBusy(); => returns boolean *true* if madness is running, false otherwise
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      var Thread = function (callback, interval) {

        //private members:
          var threadBusy = false;
          var callback = callback;
          var interval = interval;
          var threadID;

          //public:
          this.Start = function () {
              if (threadBusy)
                  this.Stop();
              threadBusy = true;
              threadID = setInterval(callback, interval);
          };
          
          this.Stop = function () {
              if (threadBusy) {
                  clearInterval(threadID);
              }
              threadBusy = false;
          };

          this.isBusy = function () {
              return threadBusy;
          };
      };

})(); 




