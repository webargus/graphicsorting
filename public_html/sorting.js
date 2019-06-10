

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

            var create = function() {
                self.element = document.createElement('div');
                self.element.setAttribute("class", "bar");
                return self.element;
            };
            // create bar and return it
            return create();
        };
        
        // create bar chart
        create();
    
    };
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    var selectionSort = function(list) {
        
        var list = list;                     // save list in local member
        var delay = 150;                 // delay between sorting steps in millisecs
        var curr_pos = 0;              // index of current walking position in array to sort
        var smallest, smaller_pos;
        var thread, chart;
        
        var init = function() {
            thread = new Thread(callback, delay);
            chart = new barChart("chart", list);
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
        /*
        for current_pos in range(len(lst) - 1):
            smallest = lst[current_pos]
            smaller_pos = current_pos
            for pos in range(current_pos + 1, len(lst)):
                if lst[pos] < smallest:
                    smallest = lst[pos]
                    smaller_pos = pos
            if smaller_pos != current_pos:
                lst[current_pos], lst[smaller_pos] = lst[smaller_pos], lst[current_pos]

         */
        this.start = function() {
            thread.Start();
        };
        
        // call constructor
        init();
        
    };
    
    var initSelectionSort = function() {
        var n = document.getElementById("list_sz").value;
        var list = [];
        for(var i = 0; i < n; i++) {
            list.push(i+1);
        }
        for(var i = 0; i < 100; i++) {
            ix0 = parseInt(Math.random()*n);
            ix1 = parseInt(Math.random()*n);
            [list[ix0], list[ix1]] = [list[ix1], list[ix0]];
        }
        console.log(list);
        var selSort = new selectionSort(list);
        selSort.start();
    };
    
   var  init  = function() {
            
        console.log("page loaded");
        
        // Add event listener to start btn:
        document.getElementById("start").addEventListener("click", initSelectionSort);
        
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

          //private:
          var threadID;
          var threadBusy = false;
          var callback = callback;
          var interval = interval;

          //public:
          this.Start = function () {
              if (threadBusy)
                  this.Stop();
              threadBusy = true;
              threadID = setInterval(callback, interval);
          };

          this.Stop = function () {
              if (threadBusy)
                  clearInterval(threadID);
              threadBusy = false;
          };

          this.isBusy = function () {
              return threadBusy;
          };
      };

})(); 




