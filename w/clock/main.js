window.addEventListener('load', function() {
    var langaugeCode = navigator.languages[0];
    var mtp = 3600000; // Millisecond to hour multiplier.
    var gmt = 0; // GMT offset.
    var sub = (new Date().getTimezoneOffset() / 60) * mtp; // Offset by 7 hours. I'm sure there is a way to not do this? Ok, there totally is and this may even be broken in certain ways. Frick!
    var timeElement = document.getElementById('time');
    var dateElement = document.getElementById('date');
    var tooltipElement = document.getElementById('tooltip');
    var sliderElement = document.getElementById("slider");
    var outputElement = document.getElementById("add");
    var customElement = document.getElementById("customText");

    sliderElement.oninput = function() { slider(); }
    
    function slider() { // Slider function.
        var val = sliderElement.value;
        gmt = val * mtp;
        var gmtStamp = "GMT" + (val >= 0 ? "+" + val : val)
        outputElement.innerHTML = gmtStamp;
        tooltipElement.innerHTML = gmtStamp;
        // Converting value strings into integers is cursed. Also this artifical tooltip is kinda jank, but so awesome!! I want the tooltip to be completely centered on the left, but I'm not sure how to do that yet.
        var slideMain = (+val + 25.5) * 10.35  // Create margin based on slider value + offset.
        // marginLeft slideMain + some offset for string length.
        tooltipElement.style.marginLeft = slideMain - (gmtStamp.length - 6) * 4.5;
        // marginRight with extra stuff for string length.
        tooltipElement.style.marginRight = -((slideMain + (gmtStamp.length - 6) * 4.5) - (525 - (val >= 0) * 4));
        clock();
    }
    
    function clock() { // Main stuff.
        if ("" + window.getSelection() != "") return;;
        var unix = Date.now();
        var date = new Date(unix + sub + gmt);
        
        var formattedTime = date.toLocaleString(langaugeCode, { // Formatted into time.
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit"
        });
        
        var formattedDate = date.toLocaleString(langaugeCode, { // Formatted into date.
            weekday: "long",
            month: "long",
            day: "2-digit",
            year: "numeric"
        });
        timeElement.innerHTML = formattedTime.substring(0, formattedTime.length - 3) + (formattedTime.substring(formattedTime.length - 2, formattedTime.length) == "AM" ? '<span style="font-size: 0.5em;">AM</span>' : '<span style="font-size: 0.5em;">PM</span>');
        dateElement.innerHTML = formattedDate;
    }
    
    function hash() {
        var hash = window.location.hash.slice(1);
        split = hash.split("//");
        sliderElement.value = split[0];
        customElement.innerHTML = typeof split[1] !== "undefined" ? "Current time for: " + decodeURIComponent(split[1]) : "";
    }
    
    hash();
    clock();
    slider();
    
    setInterval(clock, 1000);
    
    window.addEventListener('hashchange', function() { // This shouldn't work, but it works.
        hash();
        clock();
        slider();
    })
})