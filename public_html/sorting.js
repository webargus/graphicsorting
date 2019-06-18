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
        var thread, passnum, max_pos, temp;
        var chart =  chart;
        
        var init = function() {
            thread = new Thread(sort, delay);
            chart =  new barChart(chart, list);
        };
        
        var sort = function() {
            
            if(passnum > 0) {
                max_pos = 0;
                for(var ix = 0; ix <= passnum; ix++) {
                    if(list[ix] > list[max_pos]) {
                        max_pos = ix;
                    }
                }
                
               //   swap last element with element at max_pos, both in list and graphically
                temp = list[passnum];
                list[passnum] = list[max_pos];
                list[max_pos] = temp;
                chart.swap(passnum, max_pos);
                
                // decrease index of last item to visit in list
                passnum--;
                return;
            }
            
            thread.Stop();
            
        };

        this.start = function() {
            passnum = list.length - 1;
            max_pos = 0;
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
        var thread, swapped, passnum, temp;
        
        //  constructor
        var init = function() {
            thread = new Thread(sort, delay);
            chart = new barChart(chart, list);
        };
        
        var sort = function() {
           if( (passnum > -1) && swapped ) {
                swapped = false;
                for(var ix = 0; ix < passnum; ix++) {
                    if( list[ix+1] < list[ix] ) {
                        // swap in memory, also graphically and remember it
                        temp = list[ix];
                        list[ix] = list[ix+1];
                        list[ix+1] = temp;
                        chart.swap( ix, ix+1 );
                        swapped = true;
                    }
                }
                passnum--;
                return;
            }
            thread.Stop();
        };
        
        this.start = function() {
            swapped = true;
            passnum = list.length - 1;
            thread.Start();
        };
        
        // call constructor to instantiate object
        init();
 
    };
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    var insertionSort = function (list, delay, chart) {
        
        /*
         *      IMPORTANT! Use .slice() to hard-copy array to sort; spent HOURS trying to figure out why
         *      sorting was ending before completion when running mutiple sorting threads simultaneously;
         *      that was precisely because I wasn't hard-copying the array to sort (list); as a consequence,
         *      all threads stopped once one or another sorting algorithm finished sorting the shared list.
         */
        var list = list.slice();           // save list COPY in local member
        var delay = delay;             // delay between sorting steps in millisecs
        var chart = chart;
        var thread, curr_pos, curr_val, ins_pos;
        
        //  constructor
        var init = function() {
            thread = new Thread(sort, delay);
            chart = new barChart(chart, list);
        };
        
        var sort = function() {
            
            // start from current position in array and scan elements before it until we hit the first element
            // or we find an element less than current one
            curr_val = list[curr_pos];
            ins_pos = curr_pos;
            while((ins_pos > 0) && (list[ins_pos - 1] > curr_val))  {
                list[ins_pos]  = list[ins_pos - 1];
                chart.swap(ins_pos, ins_pos - 1);
                ins_pos--;
            }
            list[ins_pos] = curr_val;
            
            // increment current scan position in array and interrupt thread if end of array hit
            curr_pos++;
            if(curr_pos === list.length) {
                thread.Stop();
            }
        };
        
        this.start = function() {
            curr_pos = 1;
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
        var delay = 400;        // in millisecs
        var selSort = new selectionSort(list, delay, "chart1");
        var bubble = new bubbleSort(list, delay, "chart2");
        var insert = new insertionSort(list, delay, "chart3");
        selSort.start();
        bubble.start();
        insert.start();
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




